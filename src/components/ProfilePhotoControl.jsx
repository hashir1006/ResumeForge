import { useRef, useState } from 'react';
import { useResume } from '../context/ResumeContext';
import PhotoCropModal from './PhotoCropModal';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ProfilePhotoControl() {
  const { state, actions } = useResume();
  const resume = state.resume;
  const fileInputRef = useRef(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const isAllowed = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTS.includes(ext);

    if (!isAllowed) {
      return 'Unsupported file format. Please upload a JPG, PNG, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Please choose an image under 10MB.';
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      e.target.value = '';
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target.result);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerFileInput = () => {
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCropComplete = (croppedBase64) => {
    actions.updateResume({ photoData: croppedBase64, hasPhoto: true });
    setCropImageSrc(null);
  };

  const toggleIncludePhoto = (checked) => {
    setErrorMessage('');
    actions.updateResume({ hasPhoto: checked });
  };

  const handleRemovePhoto = () => {
    setErrorMessage('');
    actions.updateResume({ photoData: null });
  };

  return (
    <div className="profile-photo-control-container" style={{ marginBottom: 18 }}>
      {/* Toggle Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          marginBottom: resume?.hasPhoto ? 12 : 0,
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label className="toggle" style={{ margin: 0 }}>
            <input
              type="checkbox"
              id="include-photo-checkbox"
              checked={!!resume?.hasPhoto}
              onChange={(e) => toggleIncludePhoto(e.target.checked)}
              aria-label="Include photo in resume"
            />
            <span className="toggle-slider" />
          </label>
          <label
            htmlFor="include-photo-checkbox"
            style={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Include photo
          </label>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {resume?.hasPhoto ? 'Photo layout enabled' : 'Text-only layout'}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="profile-photo-file-input"
        aria-label="Upload profile photo file"
      />

      {/* Upload Controls & Preview - ONLY shown when Include Photo is enabled */}
      {resume?.hasPhoto && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 6,
                color: '#f87171',
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '0 4px',
                }}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {resume.photoData ? (
            /* Uploaded State */
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--accent)',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  background: '#0f172a',
                }}
              >
                <img
                  src={resume.photoData}
                  alt="Profile Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Profile Photo Loaded
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>
                  Visible in resume preview and exports
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCropImageSrc(resume.photoData)}
                    title="Crop, zoom, and reposition photo"
                  >
                    ✂ Crop / Adjust
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={triggerFileInput}
                    title="Choose a different image file"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleRemovePhoto}
                    title="Remove this photo from resume"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '16px 12px',
                border: '1px dashed var(--border-light)',
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                No Photo Uploaded Yet
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                Upload a professional headshot (JPG, PNG, or WebP up to 10MB)
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={triggerFileInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerFileInput();
                  }
                }}
                tabIndex={0}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Choose Image File
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cropper Modal */}
      {cropImageSrc && (
        <PhotoCropModal
          imageSrc={cropImageSrc}
          onComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
}
