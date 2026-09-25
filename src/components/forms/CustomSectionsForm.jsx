import { useState } from 'react';
import { useResume } from '../../context/ResumeContext';

const PRESET_SECTIONS = [
  'Volunteer Experience',
  'Publications',
  'Speaking Engagements',
  'References',
  'Hobbies & Interests',
  'Patents',
  'Affiliations',
];

export default function CustomSectionsForm() {
  const { state, actions } = useResume();
  const customSections = state.resume?.customSections || [];
  const sectionOrder = state.resume?.sectionOrder || [];
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addCustomSection = (title) => {
    const finalTitle = (title || newTitle || '').trim();
    if (!finalTitle) return;

    const id = `c_${Date.now()}`;
    const newSection = {
      id,
      title: finalTitle,
      items: [
        {
          id: `item_${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: '',
        },
      ],
    };

    const updatedSections = [...customSections, newSection];
    const updatedOrder = [...sectionOrder, `custom_${id}`];

    actions.updateResume({
      customSections: updatedSections,
      sectionOrder: updatedOrder,
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const removeCustomSection = (sectionId) => {
    const updatedSections = customSections.filter((s) => s.id !== sectionId);
    const updatedOrder = sectionOrder.filter((key) => key !== `custom_${sectionId}`);
    actions.updateResume({
      customSections: updatedSections,
      sectionOrder: updatedOrder,
    });
  };

  const updateSectionTitle = (sectionId, title) => {
    const updatedSections = customSections.map((s) =>
      s.id === sectionId ? { ...s, title } : s
    );
    actions.updateResume({ customSections: updatedSections });
  };

  const addItem = (sectionId) => {
    const updatedSections = customSections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: [
          ...(s.items || []),
          {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: '',
            subtitle: '',
            date: '',
            description: '',
          },
        ],
      };
    });
    actions.updateResume({ customSections: updatedSections });
  };

  const updateItem = (sectionId, itemIndex, field, value) => {
    const updatedSections = customSections.map((s) => {
      if (s.id !== sectionId) return s;
      const items = [...(s.items || [])];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      return { ...s, items };
    });
    actions.updateResume({ customSections: updatedSections });
  };

  const removeItem = (sectionId, itemIndex) => {
    const updatedSections = customSections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.filter((_, i) => i !== itemIndex),
      };
    });
    actions.updateResume({ customSections: updatedSections });
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px 0' }}>
          Create custom sections for publications, volunteer work, hobbies, references, or anything else you'd like on your resume.
        </p>

        {!isAdding ? (
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => setIsAdding(true)}
          >
            + Create New Custom Section
          </button>
        ) : (
          <div className="entry-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>
              New Section Name
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                className="input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Volunteer Experience"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomSection();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
              />
              <button className="btn btn-primary" onClick={() => addCustomSection()}>
                Add
              </button>
              <button className="btn btn-ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>

            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Or pick a suggestion:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESET_SECTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #334155' }}
                  onClick={() => addCustomSection(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections.map((section) => (
        <div key={section.id} className="entry-card" style={{ marginBottom: 20 }}>
          <div className="entry-card-header">
            <input
              className="input"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              style={{ fontWeight: 600, fontSize: 14, maxWidth: '70%', background: 'transparent' }}
              placeholder="Section Title"
            />
            <div className="entry-card-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (window.confirm(`Delete section "${section.title}"?`)) {
                    removeCustomSection(section.id);
                  }
                }}
                title="Delete entire section"
              >
                Delete Section
              </button>
            </div>
          </div>

          {(section.items || []).map((item, itemIdx) => (
            <div
              key={item.id || itemIdx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #334155',
                borderRadius: 6,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                  Item #{itemIdx + 1}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '2px 6px', fontSize: 11 }}
                  onClick={() => removeItem(section.id, itemIdx)}
                  title="Remove this item"
                >
                  ✕
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="label">Title / Role / Activity</label>
                  <input
                    className="input"
                    value={item.title || ''}
                    onChange={(e) => updateItem(section.id, itemIdx, 'title', e.target.value)}
                    placeholder="e.g. Volunteer Coordinator"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Organization / Subtitle (optional)</label>
                  <input
                    className="input"
                    value={item.subtitle || ''}
                    onChange={(e) => updateItem(section.id, itemIdx, 'subtitle', e.target.value)}
                    placeholder="e.g. Local Food Bank"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Date / Year (optional)</label>
                <input
                  className="input"
                  value={item.date || ''}
                  onChange={(e) => updateItem(section.id, itemIdx, 'date', e.target.value)}
                  placeholder="e.g. 2022 - 2023"
                />
              </div>

              <div className="form-group">
                <label className="label">Description / Details (optional)</label>
                <textarea
                  className="textarea"
                  value={item.description || ''}
                  onChange={(e) => updateItem(section.id, itemIdx, 'description', e.target.value)}
                  placeholder="Describe details, contributions, or achievements..."
                  rows={2}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: 4 }}
            onClick={() => addItem(section.id)}
          >
            + Add Item to {section.title || 'Section'}
          </button>
        </div>
      ))}
    </div>
  );
}
