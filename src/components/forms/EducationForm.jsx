import { useResume } from '../../context/ResumeContext';

export default function EducationForm() {
  const { state, actions } = useResume();
  const items = state.resume?.education || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    actions.updateResume({ education: updated });
  };

  const addItem = () => {
    actions.updateResume({
      education: [...items, {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
      }],
    });
  };

  const removeItem = (index) => {
    actions.updateResume({ education: items.filter((_, i) => i !== index) });
  };

  const moveItem = (index, dir) => {
    const updated = [...items];
    const target = index + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    actions.updateResume({ education: updated });
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="entry-card">
          <div className="entry-card-header">
            <h4>{item.institution || `Education ${index + 1}`}</h4>
            <div className="entry-card-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
              <button className="btn btn-ghost btn-sm" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>↓</button>
              <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>✕</button>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Institution</label>
            <input className="input" value={item.institution} onChange={(e) => updateItem(index, 'institution', e.target.value)} placeholder="University Name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Degree</label>
              <input className="input" value={item.degree} onChange={(e) => updateItem(index, 'degree', e.target.value)} placeholder="e.g. Bachelor of Science" />
            </div>
            <div className="form-group">
              <label className="label">Field of Study</label>
              <input className="input" value={item.field} onChange={(e) => updateItem(index, 'field', e.target.value)} placeholder="e.g. Computer Science" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Start Date</label>
              <input className="input" type="month" value={item.startDate} onChange={(e) => updateItem(index, 'startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">End Date</label>
              <input className="input" type="month" value={item.endDate} onChange={(e) => updateItem(index, 'endDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">GPA (optional)</label>
            <input className="input" value={item.gpa} onChange={(e) => updateItem(index, 'gpa', e.target.value)} placeholder="e.g. 3.8/4.0" />
          </div>
          <div className="form-group">
            <label className="label">Additional Details (optional)</label>
            <textarea className="textarea" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Relevant coursework, honors, activities..." rows={3} />
          </div>
        </div>
      ))}
      <button className="add-entry-btn" onClick={addItem}>+ Add Education</button>
    </div>
  );
}
