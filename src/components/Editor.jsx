import { useState, useRef, useCallback, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { createEmptyResume } from '../data/resumeDefaults';
import ContactForm from './forms/ContactForm';
import SummaryForm from './forms/SummaryForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import { ProjectsForm, CertificationsForm, LanguagesForm, AwardsForm } from './forms/OtherForms';
import CustomSectionsForm from './forms/CustomSectionsForm';
import DesignPanel from './DesignPanel';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import { exportToPDF, exportToImage, printResume } from '../utils/exportUtils';

const TABS = [
  { id: 'contact', label: 'Contact' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certs' },
  { id: 'languages', label: 'Languages' },
  { id: 'awards', label: 'Awards' },
  { id: 'custom', label: '+ Custom' },
  { id: 'design', label: '🎨 Design' },
];

export default function Editor() {
  const { state, actions } = useResume();
  const [activeTab, setActiveTab] = useState('contact');
  const [zoom, setZoom] = useState(70);
  const [inlineEditMode, setInlineEditMode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const resumeRef = useRef(null);

  const resume = state.resume;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        actions.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        actions.redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printResume();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);

  const handleExport = useCallback(async (format) => {
    setShowExportMenu(false);
    const el = resumeRef.current;
    if (!el) return;

    if (format === 'pdf') {
      await exportToPDF(el);
    } else if (format === 'png' || format === 'jpeg') {
      await exportToImage(el, format);
    } else if (format === 'print') {
      printResume();
    }
  }, []);

  const renderForm = () => {
    switch (activeTab) {
      case 'contact': return <ContactForm />;
      case 'summary': return <SummaryForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      case 'languages': return <LanguagesForm />;
      case 'awards': return <AwardsForm />;
      case 'custom': return <CustomSectionsForm />;
      case 'design': return <DesignPanel />;
      default: return null;
    }
  };

  if (!resume) return null;

  const saveStatusLabel = {
    saved: 'Saved',
    saving: 'Saving...',
    error: 'Error saving',
    idle: 'Unsaved changes',
  };

  return (
    <div className="editor-layout">
      {/* Sidebar */}
      <div className="editor-sidebar">
        {/* Header */}
        <div className="editor-sidebar-header">
          <button className="back-btn" onClick={actions.closeEditor} data-tooltip="Back to dashboard">
            ←
          </button>
          <input
            className="resume-name-input"
            value={resume.name}
            onChange={(e) => actions.updateResume({ name: e.target.value })}
          />
          <div className="save-indicator">
            <span className={`dot ${state.saveStatus}`} />
            <span>{saveStatusLabel[state.saveStatus]}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="editor-toolbar no-print">
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={actions.undo}
            disabled={state.historyIndex <= 0}
            data-tooltip="Undo (Ctrl+Z)"
          >↶</button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={actions.redo}
            disabled={state.historyIndex >= state.history.length - 1}
            data-tooltip="Redo (Ctrl+Y)"
          >↷</button>
          <div className="toolbar-divider" />
          <button
            className="btn btn-ghost btn-sm"
            onClick={actions.toggleTemplateSelector}
            data-tooltip="Change template"
          >🎨 Template</button>
          <div className="toolbar-divider" />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (window.confirm('Clear all data and start fresh? This cannot be undone.')) {
                const empty = createEmptyResume();
                actions.updateResume({
                  contact: empty.contact,
                  summary: empty.summary,
                  experience: empty.experience,
                  education: empty.education,
                  skills: empty.skills,
                  projects: empty.projects,
                  certifications: empty.certifications,
                  languages: empty.languages,
                  awards: empty.awards,
                });
              }
            }}
            data-tooltip="Clear all data"
          >🗑 Clear</button>
        </div>

        {/* Tabs */}
        <div className="editor-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="editor-panel">
          {renderForm()}
        </div>
      </div>

      {/* Preview Area */}
      <div className="preview-area">
        <div className="preview-toolbar no-print">
          <div className="preview-toolbar-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Preview
            </span>
            <button
              type="button"
              className={`btn btn-sm ${inlineEditMode ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setInlineEditMode((m) => !m)}
              title={inlineEditMode ? 'Exit on-page editing mode' : 'Click to enable direct typing onto the preview document'}
              style={{ fontSize: 12, padding: '3px 9px' }}
            >
              ✏️ {inlineEditMode ? 'Page Editing: ON' : 'Direct Edit'}
            </button>
          </div>
          <div className="preview-toolbar-right">
            {/* Zoom */}
            <div className="zoom-controls">
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setZoom((z) => Math.max(30, z - 10))}
              >−</button>
              <span>{zoom}%</span>
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
              >+</button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setZoom(70)}
              >Fit</button>
            </div>

            <div className="toolbar-divider" />

            {/* Print */}
            <button className="btn btn-secondary btn-sm" onClick={() => handleExport('print')}>
              🖨 Print
            </button>

            {/* Export */}
            <div className="export-dropdown">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowExportMenu((v) => !v)}
              >
                ⬇ Export
              </button>
              {showExportMenu && (
                <div className="export-menu">
                  <button onClick={() => handleExport('pdf')}>📄 PDF</button>
                  <button onClick={() => handleExport('png')}>🖼 PNG</button>
                  <button onClick={() => handleExport('jpeg')}>📷 JPEG</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="preview-container" onClick={() => setShowExportMenu(false)}>
          <div
            className="resume-page-wrapper"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="resume-page" ref={resumeRef} id="resume-page">
              <ResumePreview
                resume={resume}
                onUpdate={actions.updateResume}
                inlineEditMode={inlineEditMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {state.showTemplateSelector && (
        <TemplateSelector onClose={actions.toggleTemplateSelector} />
      )}
    </div>
  );
}
