// 20 distinct resume templates with photo and no-photo variants
// Each template defines layout structure, styling rules, and default customization

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'executive', label: 'Executive' },
  { id: 'tech', label: 'Tech' },
];

export const INDUSTRY_FILTERS = [
  { id: 'all', label: 'All Industries' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'design', label: 'Design' },
  { id: 'finance', label: 'Finance' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'general', label: 'General' },
];

const templates = [
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    category: 'modern',
    industries: ['technology', 'general'],
    description: 'Clean lines with a bold header and accent sidebar',
    layout: 'single-column',
    defaults: { accentColor: '#2563eb', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    category: 'classic',
    industries: ['business', 'finance', 'general'],
    description: 'Traditional layout with serif headings and clean sections',
    layout: 'single-column',
    defaults: { accentColor: '#1e3a5f', fontFamily: 'Merriweather', fontSize: 10 },
  },
  {
    id: 'minimal-edge',
    name: 'Minimal Edge',
    category: 'minimal',
    industries: ['technology', 'design'],
    description: 'Ultra-minimal with thin lines and generous spacing',
    layout: 'single-column',
    defaults: { accentColor: '#374151', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    category: 'executive',
    industries: ['business', 'finance'],
    description: 'Commanding presence with dark header and gold accents',
    layout: 'single-column',
    defaults: { accentColor: '#92400e', fontFamily: 'Playfair Display', fontSize: 10 },
  },
  {
    id: 'creative-splash',
    name: 'Creative Splash',
    category: 'creative',
    industries: ['design', 'general'],
    description: 'Vibrant colors with an artistic sidebar layout',
    layout: 'sidebar-left',
    defaults: { accentColor: '#7c3aed', fontFamily: 'Montserrat', fontSize: 10 },
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack',
    category: 'tech',
    industries: ['technology'],
    description: 'Developer-friendly layout with monospace accents and skill bars',
    layout: 'single-column',
    defaults: { accentColor: '#059669', fontFamily: 'Source Sans 3', fontSize: 10 },
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    category: 'modern',
    industries: ['design', 'technology'],
    description: 'Cool tones with frosted glass-style sections',
    layout: 'single-column',
    defaults: { accentColor: '#0891b2', fontFamily: 'Raleway', fontSize: 10 },
  },
  {
    id: 'corporate-edge',
    name: 'Corporate Edge',
    category: 'classic',
    industries: ['business', 'finance'],
    description: 'Bold corporate style with structured sections',
    layout: 'single-column',
    defaults: { accentColor: '#1e40af', fontFamily: 'Open Sans', fontSize: 10 },
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    category: 'classic',
    industries: ['education', 'general'],
    description: 'Refined serif typography with ornamental dividers',
    layout: 'single-column',
    defaults: { accentColor: '#6b21a8', fontFamily: 'Playfair Display', fontSize: 10 },
  },
  {
    id: 'metro-grid',
    name: 'Metro Grid',
    category: 'modern',
    industries: ['technology', 'design'],
    description: 'Grid-based layout inspired by metro design language',
    layout: 'two-column',
    defaults: { accentColor: '#dc2626', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'creative',
    industries: ['general', 'healthcare'],
    description: 'Soft blue gradients with flowing section dividers',
    layout: 'single-column',
    defaults: { accentColor: '#0284c7', fontFamily: 'Nunito', fontSize: 10 },
  },
  {
    id: 'midnight-pro',
    name: 'Midnight Pro',
    category: 'modern',
    industries: ['technology', 'design'],
    description: 'Dark header with crisp white body and neon accents',
    layout: 'single-column',
    defaults: { accentColor: '#6366f1', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'swiss-precision',
    name: 'Swiss Precision',
    category: 'minimal',
    industries: ['design', 'technology'],
    description: 'Swiss-style typography with mathematical precision',
    layout: 'single-column',
    defaults: { accentColor: '#e11d48', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'creative',
    industries: ['education', 'healthcare'],
    description: 'Natural green tones with organic section styling',
    layout: 'sidebar-left',
    defaults: { accentColor: '#166534', fontFamily: 'Lato', fontSize: 10 },
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    category: 'creative',
    industries: ['design', 'general'],
    description: 'Warm gradient header with amber accents',
    layout: 'single-column',
    defaults: { accentColor: '#d97706', fontFamily: 'Montserrat', fontSize: 10 },
  },
  {
    id: 'academic-cv',
    name: 'Academic CV',
    category: 'classic',
    industries: ['education', 'healthcare'],
    description: 'Traditional academic CV format with publication-ready styling',
    layout: 'single-column',
    defaults: { accentColor: '#1e3a5f', fontFamily: 'Merriweather', fontSize: 10 },
  },
  {
    id: 'startup-bold',
    name: 'Startup Bold',
    category: 'modern',
    industries: ['technology', 'business'],
    description: 'Bold, energetic design with large type and color blocks',
    layout: 'single-column',
    defaults: { accentColor: '#ea580c', fontFamily: 'Montserrat', fontSize: 10 },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'minimal',
    industries: ['general', 'business'],
    description: 'Pure black-and-white with strong typographic hierarchy',
    layout: 'single-column',
    defaults: { accentColor: '#171717', fontFamily: 'Inter', fontSize: 10 },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'executive',
    industries: ['business', 'finance'],
    description: 'Luxurious rose gold accents with elegant layout',
    layout: 'single-column',
    defaults: { accentColor: '#be185d', fontFamily: 'Playfair Display', fontSize: 10 },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    category: 'tech',
    industries: ['technology'],
    description: 'Technical blueprint-inspired with grid lines and monospace elements',
    layout: 'two-column',
    defaults: { accentColor: '#1d4ed8', fontFamily: 'Source Sans 3', fontSize: 10 },
  },
];

// Generate photo and no-photo variants
export const TEMPLATES = [];
templates.forEach((t) => {
  TEMPLATES.push({
    ...t,
    variantId: `${t.id}-no-photo`,
    hasPhoto: false,
    displayName: t.name,
  });
  TEMPLATES.push({
    ...t,
    variantId: `${t.id}-photo`,
    hasPhoto: true,
    displayName: `${t.name} (Photo)`,
  });
});

export const getTemplate = (templateId) =>
  templates.find((t) => t.id === templateId) || templates[0];

export const getTemplateDefaults = (templateId) => {
  const t = getTemplate(templateId);
  return t.defaults;
};

export const COLOR_PALETTES = [
  { name: 'Ocean Blue', colors: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa'] },
  { name: 'Forest', colors: ['#166534', '#16a34a', '#22c55e', '#4ade80'] },
  { name: 'Sunset', colors: ['#9a3412', '#ea580c', '#f97316', '#fb923c'] },
  { name: 'Berry', colors: ['#7e22ce', '#9333ea', '#a855f7', '#c084fc'] },
  { name: 'Rose', colors: ['#9f1239', '#e11d48', '#f43f5e', '#fb7185'] },
  { name: 'Slate', colors: ['#1e293b', '#334155', '#475569', '#64748b'] },
  { name: 'Teal', colors: ['#115e59', '#0d9488', '#14b8a6', '#2dd4bf'] },
  { name: 'Amber', colors: ['#92400e', '#d97706', '#f59e0b', '#fbbf24'] },
  { name: 'Indigo', colors: ['#3730a3', '#4f46e5', '#6366f1', '#818cf8'] },
  { name: 'Charcoal', colors: ['#171717', '#262626', '#404040', '#525252'] },
  { name: 'Emerald', colors: ['#065f46', '#059669', '#10b981', '#34d399'] },
  { name: 'Wine', colors: ['#881337', '#be123c', '#e11d48', '#f43f5e'] },
];

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', category: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif' },
  { value: 'Raleway', label: 'Raleway', category: 'sans-serif' },
  { value: 'Nunito', label: 'Nunito', category: 'sans-serif' },
  { value: 'Source Sans 3', label: 'Source Sans 3', category: 'sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif' },
];
