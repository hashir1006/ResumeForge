import { useState } from 'react';
import { useResume } from '../context/ResumeContext';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function MiniPreview({ templateId, accentColor = '#6366f1' }) {
  return (
    <div className="mini-preview">
      <div className="mini-preview-header" style={{ background: accentColor }} />
      <div className="mini-preview-line accent" style={{ background: accentColor }} />
      <div className="mini-preview-line medium" />
      <div className="mini-preview-line" />
      <div className="mini-preview-line short" />
      <div className="mini-preview-line" />
      <div className="mini-preview-line medium" />
      <div className="mini-preview-line short" />
    </div>
  );
}

export default function Dashboard() {
  const { state, actions } = useResume();
  const [contextMenu, setContextMenu] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const handleContextMenu = (e, resume) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, resume });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleRename = (resume) => {
    setRenameId(resume.id);
    setRenameValue(resume.name);
    closeContextMenu();
  };

  const submitRename = async () => {
    if (renameValue.trim()) {
      await actions.renameResume(renameId, renameValue.trim());
    }
    setRenameId(null);
  };

  const handleDuplicate = async (resume) => {
    await actions.duplicateResume(resume.id);
    closeContextMenu();
  };

  const handleDelete = async (resume) => {
    if (window.confirm(`Delete "${resume.name}"? This cannot be undone.`)) {
      await actions.deleteResume(resume.id);
    }
    closeContextMenu();
  };

  return (
    <div className="dashboard" onClick={closeContextMenu}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <h1>ResumeForge</h1>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {/* Create Actions */}
        <div className="dashboard-actions">
          <div className="create-card" onClick={() => actions.createNewResume(true)}>
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3>New Resume with Sample</h3>
            <p>Start with sample data to see how templates look — replace it with your own info</p>
          </div>
          <div className="create-card" onClick={() => actions.createNewResume(false)}>
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <h3>Blank Resume</h3>
            <p>Start from scratch with an empty resume template</p>
          </div>
        </div>

        {/* Saved Resumes */}
        {state.savedResumes.length > 0 && (
          <>
            <div className="section-title">
              Saved Resumes ({state.savedResumes.length})
            </div>
            <div className="resume-grid">
              {state.savedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="resume-card"
                  onClick={() => actions.openResume(resume.id)}
                  onContextMenu={(e) => handleContextMenu(e, resume)}
                >
                  <div className="resume-card-preview">
                    <MiniPreview templateId={resume.templateId} />
                  </div>
                  <div className="resume-card-actions">
                    <button
                      data-tooltip="Duplicate"
                      onClick={(e) => { e.stopPropagation(); handleDuplicate(resume); }}
                    >⧉</button>
                    <button
                      data-tooltip="Delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(resume); }}
                    >✕</button>
                  </div>
                  <div className="resume-card-info">
                    <div className="resume-card-name">{resume.name}</div>
                    <div className="resume-card-meta">
                      {formatDate(resume.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {state.savedResumes.length === 0 && !state.loading && (
          <div className="empty-state">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="60" height="60">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <h3>No resumes yet</h3>
            <p>Create your first resume to get started</p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="context-menu-item" onClick={() => { actions.openResume(contextMenu.resume.id); closeContextMenu(); }}>
            ✎ Edit
          </button>
          <button className="context-menu-item" onClick={() => handleRename(contextMenu.resume)}>
            ✏ Rename
          </button>
          <button className="context-menu-item" onClick={() => handleDuplicate(contextMenu.resume)}>
            ⧉ Duplicate
          </button>
          <div className="context-menu-divider" />
          <button className="context-menu-item danger" onClick={() => handleDelete(contextMenu.resume)}>
            🗑 Delete
          </button>
        </div>
      )}

      {/* Rename Dialog */}
      {renameId && (
        <div className="rename-overlay" onClick={() => setRenameId(null)}>
          <div className="rename-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Rename Resume</h3>
            <input
              className="input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitRename()}
              autoFocus
            />
            <div className="rename-dialog-actions">
              <button className="btn btn-secondary" onClick={() => setRenameId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitRename}>Rename</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
