import { useResume } from '../../context/ResumeContext';

export function ProjectsForm() {
  const { state, actions } = useResume();
  const items = state.resume?.projects || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ projects: updated });
  };

  const addItem = () => {
    actions.updateResume({
      projects: [...items, { id: crypto.randomUUID(), name: '', url: '', description: '', technologies: '' }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ projects: items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.name || `Project ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Project Name</label>
              <input className="input" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} placeholder="Project Name" />
            </div>
            <div className="form-group">
              <label className="label">URL (optional)</label>
              <input className="input" value={item.url} onChange={(e) => updateItem(index, 'url', e.target.value)} placeholder="github.com/..." />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="textarea" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Describe the project..." rows={3} />
          </div>
          <div className="form-group">
            <label className="label">Technologies (optional)</label>
            <input className="input" value={item.technologies} onChange={(e) => updateItem(index, 'technologies', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Project</button>
    </div>
  );
}

export function CertificationsForm() {
  const { state, actions } = useResume();
  const items = state.resume?.certifications || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ certifications: updated });
  };

  const addItem = () => {
    actions.updateResume({
      certifications: [...items, { id: crypto.randomUUID(), name: '', issuer: '', date: '' }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ certifications: items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.name || `Certification ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Certification Name</label>
            <input className="input" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} placeholder="e.g. AWS Solutions Architect" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Issuer</label>
              <input className="input" value={item.issuer} onChange={(e) => updateItem(index, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" />
            </div>
            <div className="form-group">
              <label className="label">Date</label>
              <input className="input" type="month" value={item.date} onChange={(e) => updateItem(index, 'date', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Certification</button>
    </div>
  );
}

export function LanguagesForm() {
  const { state, actions } = useResume();
  const items = state.resume?.languages || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ languages: updated });
  };

  const addItem = () => {
    actions.updateResume({
      languages: [...items, { id: crypto.randomUUID(), language: '', proficiency: '' }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ languages: items.filter((_, i) => i !== index) });
  };

  const proficiencyLevels = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'];

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.language || `Language ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Language</label>
              <input className="input" value={item.language} onChange={(e) => updateItem(index, 'language', e.target.value)} placeholder="e.g. English" />
            </div>
            <div className="form-group">
              <label className="label">Proficiency</label>
              <select className="select" value={item.proficiency} onChange={(e) => updateItem(index, 'proficiency', e.target.value)}>
                <option value="">Select level</option>
                {proficiencyLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Language</button>
    </div>
  );
}

export function AwardsForm() {
  const { state, actions } = useResume();
  const items = state.resume?.awards || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ awards: updated });
  };

  const addItem = () => {
    actions.updateResume({
      awards: [...items, { id: crypto.randomUUID(), title: '', issuer: '', date: '', description: '' }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ awards: items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.title || `Award ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Award Title</label>
            <input className="input" value={item.title} onChange={(e) => updateItem(index, 'title', e.target.value)} placeholder="Award name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Issuer</label>
              <input className="input" value={item.issuer} onChange={(e) => updateItem(index, 'issuer', e.target.value)} placeholder="Issuing organization" />
            </div>
            <div className="form-group">
              <label className="label">Date</label>
              <input className="input" value={item.date} onChange={(e) => updateItem(index, 'date', e.target.value)} placeholder="e.g. 2023" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description (optional)</label>
            <textarea className="textarea" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Brief description..." rows={2} />
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Award</button>
    </div>
  );
}
