// Storage layer using localForage (IndexedDB with fallback)
import localforage from 'localforage';

const store = localforage.createInstance({
  name: 'resumeforge',
  storeName: 'resumes',
});

const metaStore = localforage.createInstance({
  name: 'resumeforge',
  storeName: 'metadata',
});

export const storage = {
  async saveResume(resume) {
    const updated = { ...resume, updatedAt: new Date().toISOString() };
    await store.setItem(resume.id, updated);
    // Update the index
    const index = (await metaStore.getItem('resumeIndex')) || [];
    const existing = index.findIndex((r) => r.id === resume.id);
    const meta = {
      id: resume.id,
      name: resume.name,
      templateId: resume.templateId,
      hasPhoto: resume.hasPhoto,
      updatedAt: updated.updatedAt,
      createdAt: resume.createdAt,
    };
    if (existing >= 0) {
      index[existing] = meta;
    } else {
      index.unshift(meta);
    }
    await metaStore.setItem('resumeIndex', index);
    return updated;
  },

  async getResume(id) {
    return await store.getItem(id);
  },

  async getAllResumeMetas() {
    return (await metaStore.getItem('resumeIndex')) || [];
  },

  async deleteResume(id) {
    await store.removeItem(id);
    const index = (await metaStore.getItem('resumeIndex')) || [];
    await metaStore.setItem(
      'resumeIndex',
      index.filter((r) => r.id !== id)
    );
  },

  async duplicateResume(id, newName) {
    const original = await store.getItem(id);
    if (!original) return null;
    const dup = {
      ...original,
      id: crypto.randomUUID(),
      name: newName || `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await this.saveResume(dup);
  },

  async renameResume(id, newName) {
    const resume = await store.getItem(id);
    if (!resume) return null;
    resume.name = newName;
    return await this.saveResume(resume);
  },
};
