import { useResume } from '../../context/ResumeContext';

export default function SkillsForm() {
  const { state, actions } = useResume();
  const items = state.resume?.skills || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ skills: updated });
  };

  const addItem = () => {
    actions.updateResume({
      skills: [...items, { id: crypto.randomUUID(), category: '', items: '' }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ skills: items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.category || `Skill Group ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <input className="input" value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} placeholder="e.g. Programming Languages" />
          </div>
          <div className="form-group">
            <label className="label">Skills (comma-separated)</label>
            <input className="input" value={item.items} onChange={(e) => updateItem(index, 'items', e.target.value)} placeholder="e.g. JavaScript, Python, Go" />
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Skill Group</button>
    </div>
  );
}
