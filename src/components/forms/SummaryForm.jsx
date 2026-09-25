import { useResume } from '../../context/ResumeContext';

export default function SummaryForm() {
  const { state, actions } = useResume();

  return (
    <div>
      <div className="form-group">
        <label className="label">Professional Summary</label>
        <textarea
          className="textarea"
          value={state.resume?.summary || ''}
          onChange={(e) => actions.updateResume({ summary: e.target.value })}
          placeholder="Write a brief professional summary highlighting your key achievements, skills, and career objectives..."
          rows={5}
        />
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {(state.resume?.summary || '').length} characters
        </div>
      </div>
    </div>
  );
}
