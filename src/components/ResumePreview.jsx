import { useMemo } from 'react';
import { getTemplate } from '../data/templates';
import { SECTION_LABELS } from '../data/resumeDefaults';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1] || ''} ${year}`;
}

function InlineEditField({ value, onChange, tag: Tag = 'span', style, className, editable, placeholder }) {
  if (!editable) {
    return <Tag style={style} className={className}>{value || placeholder || ''}</Tag>;
  }

  const handleBlur = (e) => {
    const text = e.currentTarget.textContent || '';
    if (onChange && text !== value) {
      onChange(text);
    }
  };

  return (
    <Tag
      className={`inline-editable ${className || ''}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      style={{ ...style, minWidth: 20, display: Tag === 'span' ? 'inline-block' : 'block' }}
      title="Click to edit directly"
    >
      {value || placeholder || ''}
    </Tag>
  );
}

// Render section content based on key
function SectionContent({ sectionKey, resume, accentColor, textColor, fontSize, editable, onUpdate }) {
  const sty = { fontSize: `${fontSize}pt`, color: textColor, lineHeight: resume.customization?.lineHeight || 1.4 };

  // Handle custom sections
  if (sectionKey.startsWith('custom_')) {
    const customId = sectionKey.replace('custom_', '');
    const customSec = (resume.customSections || []).find((c) => c.id === customId);
    if (!customSec || !customSec.items?.length) return null;

    return (
      <div>
        {customSec.items.map((item, idx) => (
          <div key={item.id || idx} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: `${fontSize + 1}pt`, color: resume.customization?.headingColor }}>
                <InlineEditField
                  value={item.title}
                  placeholder="Item Title"
                  editable={editable}
                  onChange={(val) => {
                    const sections = (resume.customSections || []).map((sec) => {
                      if (sec.id !== customId) return sec;
                      const items = [...(sec.items || [])];
                      items[idx] = { ...items[idx], title: val };
                      return { ...sec, items };
                    });
                    onUpdate?.({ customSections: sections });
                  }}
                />
              </strong>
              {item.date && (
                <span style={{ fontSize: `${fontSize - 1}pt`, color: '#6b7280' }}>
                  {item.date}
                </span>
              )}
            </div>
            {item.subtitle && (
              <div style={{ fontSize: `${fontSize}pt`, color: accentColor, fontWeight: 500 }}>
                {item.subtitle}
              </div>
            )}
            {item.description && (
              <div style={{ ...sty, whiteSpace: 'pre-wrap', marginTop: 4 }}>
                <InlineEditField
                  value={item.description}
                  tag="div"
                  editable={editable}
                  onChange={(val) => {
                    const sections = (resume.customSections || []).map((sec) => {
                      if (sec.id !== customId) return sec;
                      const items = [...(sec.items || [])];
                      items[idx] = { ...items[idx], description: val };
                      return { ...sec, items };
                    });
                    onUpdate?.({ customSections: sections });
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  switch (sectionKey) {
    case 'summary':
      if (!resume.summary && !editable) return null;
      return (
        <div style={{ ...sty, whiteSpace: 'pre-wrap' }}>
          <InlineEditField
            value={resume.summary}
            placeholder="Write your professional summary here..."
            tag="div"
            editable={editable}
            onChange={(val) => onUpdate?.({ summary: val })}
          />
        </div>
      );

    case 'experience':
      if (!resume.experience?.length) return null;
      return (
        <div>
          {resume.experience.map((exp, idx) => (
            <div key={exp.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: `${fontSize + 1}pt`, color: resume.customization?.headingColor }}>
                  <InlineEditField
                    value={exp.position}
                    placeholder="Job Title"
                    editable={editable}
                    onChange={(val) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], position: val };
                      onUpdate?.({ experience: updated });
                    }}
                  />
                </strong>
                <span style={{ fontSize: `${fontSize - 1}pt`, color: '#6b7280' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div style={{ fontSize: `${fontSize}pt`, color: accentColor, fontWeight: 500 }}>
                <InlineEditField
                  value={exp.company}
                  placeholder="Company"
                  editable={editable}
                  onChange={(val) => {
                    const updated = [...resume.experience];
                    updated[idx] = { ...updated[idx], company: val };
                    onUpdate?.({ experience: updated });
                  }}
                />
                {exp.location ? ` • ${exp.location}` : ''}
              </div>
              {exp.description && (
                <div style={{ ...sty, whiteSpace: 'pre-wrap', marginTop: 4 }}>
                  <InlineEditField
                    value={exp.description}
                    tag="div"
                    editable={editable}
                    onChange={(val) => {
                      const updated = [...resume.experience];
                      updated[idx] = { ...updated[idx], description: val };
                      onUpdate?.({ experience: updated });
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case 'education':
      if (!resume.education?.length) return null;
      return (
        <div>
          {resume.education.map((edu, idx) => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: `${fontSize + 1}pt`, color: resume.customization?.headingColor }}>
                  <InlineEditField
                    value={edu.institution}
                    placeholder="Institution"
                    editable={editable}
                    onChange={(val) => {
                      const updated = [...resume.education];
                      updated[idx] = { ...updated[idx], institution: val };
                      onUpdate?.({ education: updated });
                    }}
                  />
                </strong>
                <span style={{ fontSize: `${fontSize - 1}pt`, color: '#6b7280' }}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <div style={{ fontSize: `${fontSize}pt` }}>
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
              </div>
              {edu.description && (
                <div style={{ ...sty, marginTop: 3, color: '#6b7280' }}>{edu.description}</div>
              )}
            </div>
          ))}
        </div>
      );

    case 'skills':
      if (!resume.skills?.length) return null;
      return (
        <div>
          {resume.skills.map((skill, idx) => (
            <div key={skill.id} style={{ marginBottom: 6, fontSize: `${fontSize}pt` }}>
              <strong style={{ color: resume.customization?.headingColor }}>{skill.category}: </strong>
              <InlineEditField
                value={skill.items}
                placeholder="Skills separated by commas"
                editable={editable}
                onChange={(val) => {
                  const updated = [...resume.skills];
                  updated[idx] = { ...updated[idx], items: val };
                  onUpdate?.({ skills: updated });
                }}
              />
            </div>
          ))}
        </div>
      );

    case 'projects':
      if (!resume.projects?.length) return null;
      return (
        <div>
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <strong style={{ fontSize: `${fontSize + 1}pt`, color: resume.customization?.headingColor }}>{proj.name}</strong>
                {proj.url && <span style={{ fontSize: `${fontSize - 1}pt`, color: accentColor }}>{proj.url}</span>}
              </div>
              {proj.description && <div style={{ ...sty, marginTop: 2 }}>{proj.description}</div>}
              {proj.technologies && (
                <div style={{ fontSize: `${fontSize - 1}pt`, color: '#6b7280', marginTop: 2 }}>
                  Tech: {proj.technologies}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case 'certifications':
      if (!resume.certifications?.length) return null;
      return (
        <div>
          {resume.certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: 6, fontSize: `${fontSize}pt` }}>
              <strong>{cert.name}</strong>
              {cert.issuer && <span> — {cert.issuer}</span>}
              {cert.date && <span style={{ color: '#6b7280' }}> ({formatDate(cert.date)})</span>}
            </div>
          ))}
        </div>
      );

    case 'languages':
      if (!resume.languages?.length) return null;
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
          {resume.languages.map((lang) => (
            <div key={lang.id} style={{ fontSize: `${fontSize}pt` }}>
              <strong>{lang.language}</strong>
              {lang.proficiency && <span style={{ color: '#6b7280' }}> — {lang.proficiency}</span>}
            </div>
          ))}
        </div>
      );

    case 'awards':
      if (!resume.awards?.length) return null;
      return (
        <div>
          {resume.awards.map((award) => (
            <div key={award.id} style={{ marginBottom: 6, fontSize: `${fontSize}pt` }}>
              <strong>{award.title}</strong>
              {award.issuer && <span> — {award.issuer}</span>}
              {award.date && <span style={{ color: '#6b7280' }}> ({award.date})</span>}
              {award.description && <div style={{ color: '#6b7280', marginTop: 2 }}>{award.description}</div>}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

function SectionBlock({ sectionKey, resume, accentColor, textColor, fontSize, sectionSpacing, template, editable, onUpdate }) {
  const content = SectionContent({ sectionKey, resume, accentColor, textColor, fontSize, editable, onUpdate });
  if (!content) return null;

  let label = SECTION_LABELS[sectionKey];
  if (!label && sectionKey.startsWith('custom_')) {
    const customId = sectionKey.replace('custom_', '');
    const customSec = (resume.customSections || []).find((c) => c.id === customId);
    label = customSec?.title || 'Custom Section';
  }
  if (!label) label = sectionKey;

  const headingColor = resume.customization?.headingColor || '#0f172a';

  // Section heading styling varies by template category
  const category = template?.category || 'modern';
  let headingStyle = {};
  let dividerStyle = {};

  switch (category) {
    case 'classic':
      headingStyle = {
        fontSize: `${fontSize + 2}pt`, fontWeight: 700, color: headingColor,
        textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: 4,
        borderBottom: `2px solid ${accentColor}`, marginBottom: 8,
      };
      break;
    case 'minimal':
      headingStyle = {
        fontSize: `${fontSize + 1}pt`, fontWeight: 600, color: accentColor,
        textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 6,
      };
      dividerStyle = { height: 1, background: '#e5e7eb', marginBottom: 8 };
      break;
    case 'creative':
      headingStyle = {
        fontSize: `${fontSize + 2}pt`, fontWeight: 700, color: '#fff',
        background: accentColor, padding: '3px 10px', borderRadius: 3,
        display: 'inline-block', marginBottom: 8,
      };
      break;
    case 'executive':
      headingStyle = {
        fontSize: `${fontSize + 2}pt`, fontWeight: 600, color: headingColor,
        borderBottom: `3px double ${accentColor}`, paddingBottom: 4, marginBottom: 8,
        textTransform: 'uppercase', letterSpacing: '1.5px',
      };
      break;
    case 'tech':
      headingStyle = {
        fontSize: `${fontSize + 1}pt`, fontWeight: 700, color: accentColor,
        fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px',
        paddingLeft: 10, borderLeft: `3px solid ${accentColor}`, marginBottom: 8,
      };
      break;
    default: // modern
      headingStyle = {
        fontSize: `${fontSize + 2}pt`, fontWeight: 700, color: accentColor,
        textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6,
      };
      dividerStyle = { height: 2, background: `linear-gradient(to right, ${accentColor}, transparent)`, marginBottom: 8 };
      break;
  }

  return (
    <div style={{ marginBottom: sectionSpacing }}>
      <div style={headingStyle}>{label}</div>
      {dividerStyle.height > 0 && <div style={dividerStyle} />}
      {content}
    </div>
  );
}

// Contact info display
function ContactBar({ contact, accentColor, fontSize }) {
  const items = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
    contact.website,
    contact.github,
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '4px 16px',
      fontSize: `${fontSize - 1}pt`, color: '#6b7280',
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

// Main template renderers
function SingleColumnTemplate({ resume, template, editable, onUpdate }) {
  const { accentColor, backgroundColor, textColor, fontFamily, fontSize, sectionSpacing, lineHeight, headingColor } = resume.customization;
  const isClassic = template.category === 'classic';
  const isMinimal = template.category === 'minimal';
  const isTech = template.category === 'tech';

  return (
    <div style={{
      fontFamily, color: textColor, lineHeight, background: backgroundColor,
      padding: 0, minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{
        background: isClassic
          ? '#f8fafc'
          : template.category === 'executive'
          ? `linear-gradient(135deg, #0f172a, ${accentColor})`
          : template.category === 'creative'
          ? `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`
          : isMinimal
          ? backgroundColor
          : isTech
          ? '#0f172a'
          : accentColor,
        color: isClassic || isMinimal ? headingColor : '#ffffff',
        borderBottom: isClassic ? `3px solid ${accentColor}` : isTech ? `3px solid ${accentColor}` : 'none',
        padding: isMinimal ? '28px 36px 18px' : '28px 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        {resume.hasPhoto && (
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            overflow: 'hidden', border: `3px solid ${isMinimal || isClassic ? accentColor : 'rgba(255,255,255,0.5)'}`,
            flexShrink: 0,
            background: resume.photoData ? 'transparent' : (isMinimal || isClassic ? '#e2e8f0' : 'rgba(255,255,255,0.2)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {resume.photoData ? (
              <img src={resume.photoData} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={isMinimal || isClassic ? accentColor : 'rgba(255,255,255,0.85)'} strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            )}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: `${fontSize + 12}pt`, fontWeight: 700,
            marginBottom: 2, letterSpacing: isMinimal ? '0px' : '0.5px',
            borderBottom: isMinimal ? `2px solid ${accentColor}` : 'none',
            paddingBottom: isMinimal ? 6 : 0,
          }}>
            <InlineEditField
              value={resume.contact.fullName}
              placeholder="Your Full Name"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, fullName: val } })}
            />
          </div>
          <div style={{
            fontSize: `${fontSize + 2}pt`,
            opacity: isMinimal || isClassic ? 1 : 0.9,
            color: isMinimal || isClassic ? accentColor : isTech ? '#38bdf8' : undefined,
            fontWeight: 500, marginTop: 2,
          }}>
            <InlineEditField
              value={resume.contact.jobTitle}
              placeholder="Job Title / Professional Headline"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, jobTitle: val } })}
            />
          </div>
          {isMinimal || isClassic ? (
            <div style={{ marginTop: 8 }}>
              <ContactBar contact={resume.contact} accentColor={accentColor} fontSize={fontSize} />
            </div>
          ) : (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '2px 14px',
              fontSize: `${fontSize - 1}pt`, marginTop: 6, opacity: 0.85,
            }}>
              {[resume.contact.email, resume.contact.phone, resume.contact.location,
                resume.contact.linkedin, resume.contact.website, resume.contact.github
              ].filter(Boolean).map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 36px 30px' }}>
        {(resume.sectionOrder || []).map((key) => (
          <SectionBlock
            key={key}
            sectionKey={key}
            resume={resume}
            accentColor={accentColor}
            textColor={textColor}
            fontSize={fontSize}
            sectionSpacing={sectionSpacing}
            template={template}
            editable={editable}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarTemplate({ resume, template, editable, onUpdate }) {
  const { accentColor, backgroundColor, textColor, fontFamily, fontSize, sectionSpacing, lineHeight } = resume.customization;

  const sidebarSections = ['skills', 'languages', 'certifications', 'awards'];
  const mainSections = (resume.sectionOrder || []).filter((s) => !sidebarSections.includes(s));
  const sidebarOrder = (resume.sectionOrder || []).filter((s) => sidebarSections.includes(s));

  return (
    <div style={{ fontFamily, color: textColor, lineHeight, background: backgroundColor, display: 'flex', minHeight: '100%' }}>
      {/* Sidebar */}
      <div style={{
        width: '33%', background: accentColor, color: '#ffffff',
        padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {resume.hasPhoto && (
          <div style={{
            width: 84, height: 84, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.5)', margin: '0 auto 8px', flexShrink: 0,
            background: resume.photoData ? 'transparent' : 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {resume.photoData ? (
              <img src={resume.photoData} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: `${fontSize + 6}pt`, fontWeight: 700, marginBottom: 2 }}>
            <InlineEditField
              value={resume.contact.fullName}
              placeholder="Your Full Name"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, fullName: val } })}
            />
          </div>
          <div style={{ fontSize: `${fontSize}pt`, opacity: 0.88, fontWeight: 500 }}>
            <InlineEditField
              value={resume.contact.jobTitle}
              placeholder="Job Title"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, jobTitle: val } })}
            />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />

        {/* Contact */}
        <div>
          <div style={{ fontSize: `${fontSize}pt`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
            Contact
          </div>
          {[resume.contact.email, resume.contact.phone, resume.contact.location,
            resume.contact.linkedin, resume.contact.website, resume.contact.github
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ fontSize: `${fontSize - 1}pt`, opacity: 0.88, marginBottom: 3 }}>{item}</div>
          ))}
        </div>

        {/* Sidebar sections */}
        {sidebarOrder.map((key) => {
          const data = resume[key];
          if (!data || (Array.isArray(data) && data.length === 0)) return null;
          return (
            <div key={key}>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 10 }} />
              <div style={{ fontSize: `${fontSize}pt`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {SECTION_LABELS[key]}
              </div>
              {key === 'skills' && data.map((s) => (
                <div key={s.id} style={{ marginBottom: 6, fontSize: `${fontSize - 1}pt` }}>
                  <div style={{ fontWeight: 600 }}>{s.category}</div>
                  <div style={{ opacity: 0.85 }}>{s.items}</div>
                </div>
              ))}
              {key === 'languages' && data.map((l) => (
                <div key={l.id} style={{ fontSize: `${fontSize - 1}pt`, marginBottom: 3 }}>
                  {l.language} {l.proficiency && <span style={{ opacity: 0.75 }}>— {l.proficiency}</span>}
                </div>
              ))}
              {key === 'certifications' && data.map((c) => (
                <div key={c.id} style={{ fontSize: `${fontSize - 1}pt`, marginBottom: 4 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  {c.issuer && <div style={{ opacity: 0.75 }}>{c.issuer}</div>}
                </div>
              ))}
              {key === 'awards' && data.map((a) => (
                <div key={a.id} style={{ fontSize: `${fontSize - 1}pt`, marginBottom: 4 }}>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  {a.issuer && <div style={{ opacity: 0.75 }}>{a.issuer}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '28px 30px' }}>
        {mainSections.map((key) => (
          <SectionBlock
            key={key}
            sectionKey={key}
            resume={resume}
            accentColor={accentColor}
            textColor={textColor}
            fontSize={fontSize}
            sectionSpacing={sectionSpacing}
            template={template}
            editable={editable}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

function TwoColumnTemplate({ resume, template, editable, onUpdate }) {
  const { accentColor, backgroundColor, textColor, fontFamily, fontSize, sectionSpacing, lineHeight } = resume.customization;
  const allSections = resume.sectionOrder || [];
  const mid = Math.ceil(allSections.length / 2);
  const leftSections = allSections.slice(0, mid);
  const rightSections = allSections.slice(mid);

  return (
    <div style={{ fontFamily, color: textColor, lineHeight, background: backgroundColor, minHeight: '100%' }}>
      {/* Header */}
      <div style={{
        background: accentColor, color: '#fff', padding: '24px 36px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {resume.hasPhoto && (
          <div style={{
            width: 70, height: 70, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0,
            background: resume.photoData ? 'transparent' : 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {resume.photoData ? (
              <img src={resume.photoData} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            )}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${fontSize + 10}pt`, fontWeight: 700 }}>
            <InlineEditField
              value={resume.contact.fullName}
              placeholder="Your Full Name"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, fullName: val } })}
            />
          </div>
          <div style={{ fontSize: `${fontSize + 1}pt`, opacity: 0.9, fontWeight: 500 }}>
            <InlineEditField
              value={resume.contact.jobTitle}
              placeholder="Job Title"
              editable={editable}
              onChange={(val) => onUpdate?.({ contact: { ...resume.contact, jobTitle: val } })}
            />
          </div>
        </div>
      </div>
      {/* Contact bar */}
      <div style={{
        background: `${accentColor}11`, padding: '8px 36px',
        borderBottom: `2px solid ${accentColor}22`,
      }}>
        <ContactBar contact={resume.contact} accentColor={accentColor} fontSize={fontSize} />
      </div>
      {/* Two columns */}
      <div style={{ display: 'flex', gap: 24, padding: '24px 36px' }}>
        <div style={{ flex: 1 }}>
          {leftSections.map((key) => (
            <SectionBlock key={key} sectionKey={key} resume={resume} accentColor={accentColor}
              textColor={textColor} fontSize={fontSize} sectionSpacing={sectionSpacing} template={template}
              editable={editable} onUpdate={onUpdate} />
          ))}
        </div>
        <div style={{ width: 1, background: '#e5e7eb' }} />
        <div style={{ flex: 1 }}>
          {rightSections.map((key) => (
            <SectionBlock key={key} sectionKey={key} resume={resume} accentColor={accentColor}
              textColor={textColor} fontSize={fontSize} sectionSpacing={sectionSpacing} template={template}
              editable={editable} onUpdate={onUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResumePreview({ resume, onUpdate, inlineEditMode }) {
  const template = useMemo(() => getTemplate(resume?.templateId), [resume?.templateId]);

  if (!resume) return null;

  const layout = template?.layout || 'single-column';

  return (
    <>
      {layout === 'sidebar-left' && (
        <SidebarTemplate resume={resume} template={template} editable={inlineEditMode} onUpdate={onUpdate} />
      )}
      {layout === 'two-column' && (
        <TwoColumnTemplate resume={resume} template={template} editable={inlineEditMode} onUpdate={onUpdate} />
      )}
      {layout === 'single-column' && (
        <SingleColumnTemplate resume={resume} template={template} editable={inlineEditMode} onUpdate={onUpdate} />
      )}
    </>
  );
}
