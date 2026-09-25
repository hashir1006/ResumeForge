import { useState, useMemo } from 'react';
import { TEMPLATES, TEMPLATE_CATEGORIES, INDUSTRY_FILTERS, getTemplate } from '../data/templates';
import { useResume } from '../context/ResumeContext';

function TemplateMiniPreview({ template }) {
  const color = template.defaults?.accentColor || '#6366f1';
  const font = template.defaults?.fontFamily || 'Inter';
  const isSidebar = template.layout === 'sidebar-left';
  const isTwoCol = template.layout === 'two-column';

  return (
    <div style={{
      width: '100%', height: '100%', fontFamily: font, fontSize: '6px',
      display: 'flex', flexDirection: isSidebar ? 'row' : 'column',
      overflow: 'hidden', color: '#333', lineHeight: 1.4,
    }}>
      {isSidebar && (
        <div style={{
          width: '35%', background: color, padding: '8px 6px',
          color: '#fff', display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {template.hasPhoto && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
              margin: '0 auto 4px', flexShrink: 0,
            }} />
          )}
          <div style={{ fontWeight: 700, fontSize: '7px' }}>Jane Smith</div>
          <div style={{ fontSize: '5px', opacity: 0.8 }}>Designer</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '3px 0' }} />
          <div style={{ fontSize: '5px', fontWeight: 600 }}>SKILLS</div>
          <div style={{ fontSize: '4px', opacity: 0.8 }}>React • Node.js</div>
          <div style={{ fontSize: '4px', opacity: 0.8 }}>TypeScript</div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.3)', margin: '3px 0' }} />
          <div style={{ fontSize: '5px', fontWeight: 600 }}>CONTACT</div>
          <div style={{ fontSize: '4px', opacity: 0.8 }}>email@test.com</div>
        </div>
      )}
      <div style={{ flex: 1, padding: isSidebar ? '8px 6px' : '0' }}>
        {!isSidebar && (
          <div style={{
            background: color, color: '#fff', padding: '10px 8px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {template.hasPhoto && (
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)', flexShrink: 0,
              }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '8px' }}>Jane Smith</div>
              <div style={{ fontSize: '5px', opacity: 0.8 }}>Senior Designer</div>
            </div>
          </div>
        )}
        <div style={{ padding: isSidebar ? '0' : '6px 8px' }}>
          <div style={{ fontSize: '5px', fontWeight: 700, color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Experience
          </div>
          <div style={{ fontSize: '5px', fontWeight: 600 }}>Software Engineer</div>
          <div style={{ fontSize: '4px', color: '#666', marginBottom: 2 }}>TechCorp • 2021–Present</div>
          {isTwoCol ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, marginBottom: 2 }} />
                <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, width: '80%', marginBottom: 2 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '5px', fontWeight: 700, color, marginBottom: 2, textTransform: 'uppercase' }}>Education</div>
                <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, marginBottom: 2 }} />
                <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, width: '70%' }} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, width: '80%', marginBottom: 4 }} />
              <div style={{ fontSize: '5px', fontWeight: 700, color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Education
              </div>
              <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 3, background: '#e5e7eb', borderRadius: 1, width: '60%' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplateSelector({ onClose }) {
  const { state, actions } = useResume();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [photoFilter, setPhotoFilter] = useState('all'); // 'all' | 'photo' | 'no-photo'
  const [selectedTemplate, setSelectedTemplate] = useState(state.resume?.templateId || 'modern-clean');
  const [selectedHasPhoto, setSelectedHasPhoto] = useState(state.resume?.hasPhoto || false);

  const filteredTemplates = useMemo(() => {
    // Group by base template ID, not variant
    const uniqueTemplates = [];
    const seen = new Set();
    TEMPLATES.forEach((t) => {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        uniqueTemplates.push(t);
      }
    });

    return uniqueTemplates.filter((t) => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (industryFilter !== 'all' && !t.industries.includes(industryFilter)) return false;
      return true;
    });
  }, [categoryFilter, industryFilter]);

  const handleSelect = (template) => {
    setSelectedTemplate(template.id);
  };

  const handleApply = () => {
    actions.changeTemplate(selectedTemplate, selectedHasPhoto);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Choose a Template</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Filters */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600 }}>STYLE</div>
              <div className="template-filters" style={{ marginBottom: 0 }}>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-chip ${categoryFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600 }}>INDUSTRY</div>
              <div className="template-filters" style={{ marginBottom: 0 }}>
                {INDUSTRY_FILTERS.map((ind) => (
                  <button
                    key={ind.id}
                    className={`filter-chip ${industryFilter === ind.id ? 'active' : ''}`}
                    onClick={() => setIndustryFilter(ind.id)}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4, fontWeight: 600 }}>PHOTO</div>
              <div className="template-filters" style={{ marginBottom: 0 }}>
                <button className={`filter-chip ${photoFilter === 'all' ? 'active' : ''}`} onClick={() => setPhotoFilter('all')}>All</button>
                <button className={`filter-chip ${photoFilter === 'photo' ? 'active' : ''}`} onClick={() => { setPhotoFilter('photo'); setSelectedHasPhoto(true); }}>With Photo</button>
                <button className={`filter-chip ${photoFilter === 'no-photo' ? 'active' : ''}`} onClick={() => { setPhotoFilter('no-photo'); setSelectedHasPhoto(false); }}>No Photo</button>
              </div>
            </div>
          </div>

          {/* Template Grid */}
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => handleSelect(template)}
              >
                <div className="template-card-preview">
                  <TemplateMiniPreview template={{ ...template, hasPhoto: selectedHasPhoto }} />
                </div>
                <div className="template-card-info">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <div className="photo-toggle" onClick={(e) => e.stopPropagation()}>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={selectedHasPhoto}
                        onChange={(e) => {
                          setSelectedTemplate(template.id);
                          const checked = e.target.checked;
                          setSelectedHasPhoto(checked);
                          setPhotoFilter(checked ? 'photo' : 'no-photo');
                        }}
                        aria-label={`Include photo in ${template.name}`}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <span className="photo-toggle-label">Include photo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="empty-state">
              <h3>No templates match your filters</h3>
              <p>Try adjusting your filter criteria</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
