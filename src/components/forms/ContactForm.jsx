import { useResume } from '../../context/ResumeContext';
import ProfilePhotoControl from '../ProfilePhotoControl';

export default function ContactForm() {
  const { state, actions } = useResume();
  const contact = state.resume?.contact || {};

  const update = (field, value) => {
    actions.updateResume({
      contact: { ...contact, [field]: value },
    });
  };

  return (
    <div>
      <ProfilePhotoControl />

      <div className="form-group">
        <label className="label">Full Name</label>
        <input
          className="input"
          value={contact.fullName || ''}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="e.g. Jane Smith"
        />
      </div>
      <div className="form-group">
        <label className="label">Job Title</label>
        <input
          className="input"
          value={contact.jobTitle || ''}
          onChange={(e) => update('jobTitle', e.target.value)}
          placeholder="e.g. Senior Software Engineer"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={contact.email || ''}
            onChange={(e) => update('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className="form-group">
          <label className="label">Phone</label>
          <input
            className="input"
            value={contact.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="label">Location</label>
        <input
          className="input"
          value={contact.location || ''}
          onChange={(e) => update('location', e.target.value)}
          placeholder="City, State"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="label">LinkedIn (optional)</label>
          <input
            className="input"
            value={contact.linkedin || ''}
            onChange={(e) => update('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
        </div>
        <div className="form-group">
          <label className="label">Website (optional)</label>
          <input
            className="input"
            value={contact.website || ''}
            onChange={(e) => update('website', e.target.value)}
            placeholder="yoursite.com"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="label">GitHub (optional)</label>
        <input
          className="input"
          value={contact.github || ''}
          onChange={(e) => update('github', e.target.value)}
          placeholder="github.com/username"
        />
      </div>
    </div>
  );
}
