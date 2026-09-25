import { useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { COLOR_PALETTES, FONT_OPTIONS, getTemplateDefaults } from '../data/templates';
import { SECTION_LABELS } from '../data/resumeDefaults';
import ProfilePhotoControl from './ProfilePhotoControl';

export default function DesignPanel() {
  const { state, actions } = useResume();
  const resume = state.resume;
  const customization = resume?.customization || {};
  const colorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);
  const textColorInputRef = useRef(null);

  const updateCustomization = (updates) => {
    actions.updateResume({
      customization: { ...customization, ...updates },
    });
  };

  const moveSection = (index, dir) => {
    const order = [...(resume.sectionOrder || [])];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    actions.updateResume({ sectionOrder: order });
  };

  return (
    <div>
      {/* Template */}
      <div className="design-section">
        <div className="design-section-title">Template</div>
        <button className="btn btn-secondary" style={{ width: '100%' }} onClick={actions.toggleTemplateSelector}>
          Change Template
        </button>
      </div>

      {/* Profile Photo */}
      <div className="design-section">
        <div className="design-section-title">Profile Photo</div>
        <ProfilePhotoControl />
      </div>

      {/* Color Palettes */}
      <div className="design-section">
        <div className="design-section-title">Color Palette</div>
        <div className="color-palettes">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              className={`color-palette-item ${customization.accentColor === palette.colors[0] ? 'active' : ''}`}
              onClick={() => updateCustomization({ accentColor: palette.colors[0] })}
            >
              <div className="palette-swatches">
                {palette.colors.map((c) => (
                  <div key={c} className="palette-swatch" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="palette-name">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="design-section">
        <div className="design-section-title">Custom Colors</div>

        <div className="color-picker-row">
          <span className="color-picker-label">Accent</span>
          <input
            ref={colorInputRef}
            type="color"
            value={customization.accentColor || '#6366f1'}
            onChange={(e) => updateCustomization({ accentColor: e.target.value })}
            style={{ width: 28, height: 28, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
          />
          <input
            className="color-input"
            value={customization.accentColor || '#6366f1'}
            onChange={(e) => updateCustomization({ accentColor: e.target.value })}
          />
        </div>

        <div className="color-picker-row">
          <span className="color-picker-label">Background</span>
          <input
            ref={bgColorInputRef}
            type="color"
            value={customization.backgroundColor || '#ffffff'}
            onChange={(e) => updateCustomization({ backgroundColor: e.target.value })}
            style={{ width: 28, height: 28, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
          />
          <input
            className="color-input"
            value={customization.backgroundColor || '#ffffff'}
            onChange={(e) => updateCustomization({ backgroundColor: e.target.value })}
          />
        </div>

        <div className="color-picker-row">
          <span className="color-picker-label">Text</span>
          <input
            ref={textColorInputRef}
            type="color"
            value={customization.textColor || '#1e293b'}
            onChange={(e) => updateCustomization({ textColor: e.target.value })}
            style={{ width: 28, height: 28, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
          />
          <input
            className="color-input"
            value={customization.textColor || '#1e293b'}
            onChange={(e) => updateCustomization({ textColor: e.target.value })}
          />
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 8 }}
          onClick={() => actions.resetCustomization(resume.templateId)}
        >
          ↺ Reset to Template Defaults
        </button>
      </div>

      {/* Typography */}
      <div className="design-section">
        <div className="design-section-title">Typography</div>

        <div className="form-group">
          <label className="label">Font Family</label>
          <select
            className="select"
            value={customization.fontFamily || 'Inter'}
            onChange={(e) => updateCustomization({ fontFamily: e.target.value })}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label} ({f.category})
              </option>
            ))}
          </select>
        </div>

        <div className="slider-row">
          <label>Font Size</label>
          <input
            type="range"
            min="8"
            max="14"
            step="0.5"
            value={customization.fontSize || 10}
            onChange={(e) => updateCustomization({ fontSize: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{customization.fontSize || 10}pt</span>
        </div>

        <div className="slider-row">
          <label>Line Height</label>
          <input
            type="range"
            min="1.1"
            max="2.0"
            step="0.1"
            value={customization.lineHeight || 1.4}
            onChange={(e) => updateCustomization({ lineHeight: parseFloat(e.target.value) })}
          />
          <span className="slider-value">{customization.lineHeight || 1.4}</span>
        </div>

        <div className="slider-row">
          <label>Section Gap</label>
          <input
            type="range"
            min="8"
            max="32"
            step="2"
            value={customization.sectionSpacing || 16}
            onChange={(e) => updateCustomization({ sectionSpacing: parseInt(e.target.value) })}
          />
          <span className="slider-value">{customization.sectionSpacing || 16}px</span>
        </div>
      </div>

      {/* Section Order */}
      <div className="design-section">
        <div className="design-section-title">Section Order</div>
        <ul className="section-list">
          {(resume?.sectionOrder || []).map((section, index) => {
            let label = SECTION_LABELS[section];
            if (!label && section.startsWith('custom_')) {
              const cId = section.replace('custom_', '');
              const found = (resume?.customSections || []).find((c) => c.id === cId);
              label = found?.title || 'Custom Section';
            }
            return (
              <li key={section} className="section-list-item">
                <span className="drag-handle">⠿</span>
                <span className="section-name">{label || section}</span>
                <div className="move-btns">
                  <button onClick={() => moveSection(index, -1)} disabled={index === 0}>▲</button>
                  <button onClick={() => moveSection(index, 1)} disabled={index === (resume.sectionOrder || []).length - 1}>▼</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
