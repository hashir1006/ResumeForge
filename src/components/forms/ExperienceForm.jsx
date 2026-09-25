import { useResume } from '../../context/ResumeContext';

export default function ExperienceForm() {
  const { state, actions } = useResume();
  const items = state.resume?.experience || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'current' && value) {
      updated[index].endDate = '';
    }
    actions.updateResume({ experience: updated });
  };

  const addItem = () => {
    actions.updateResume({
      experience: [...items, {
        id: crypto.randomUUID(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ experience: items.filter((_, i) => i !== index) });
  };

  const moveItem = (index, dir) => {
    const updated = [...items];
    const target = index + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    actions.updateResume({ experience: updated });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.position || item.company || `Experience ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => moveItem(index, -1)} data-tooltip="Move up" disabled={index === 0}>↑</button>
              <button className="btn btn-ghost btn-sm" onClick={() => moveItem(index, 1)} data-tooltip="Move down" disabled={index === items.length - 1}>↓</button>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Position</label>
              <input className="input" value={item.position} onChange={(e) => updateItem(index, 'position', e.target.value)} placeholder="Job Title" />
            </div>
            <div className="form-group">
              <label className="label">Company</label>
              <input className="input" value={item.company} onChange={(e) => updateItem(index, 'company', e.target.value)} placeholder="Company Name" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Location (optional)</label>
            <input className="input" value={item.location} onChange={(e) => updateItem(index, 'location', e.target.value)} placeholder="City, State" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Start Date</label>
              <input className="input" type="month" value={item.startDate} onChange={(e) => updateItem(index, 'startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">End Date</label>
              <input className="input" type="month" value={item.endDate} onChange={(e) => updateItem(index, 'endDate', e.target.value)} disabled={item.current} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <label className="toggle">
                  <input type="checkbox" checked={item.current} onChange={(e) => updateItem(index, 'current', e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Current</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="textarea" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="• Describe your responsibilities and achievements..." rows={4} />
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Experience</button>
    </div>
  );
}
