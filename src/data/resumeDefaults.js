// Default resume data structure with sample data
export const createEmptyResume = () => ({
  id: crypto.randomUUID(),
  name: 'Untitled Resume',
  templateId: 'modern-clean',
  hasPhoto: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customization: {
    accentColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    headingColor: '#0f172a',
    fontFamily: 'Inter',
    fontSize: 10,
    sectionSpacing: 16,
    lineHeight: 1.4,
  },
  photoData: null,
  photoCrop: { x: 0, y: 0, zoom: 1 },
  sectionOrder: [
    'summary', 'experience', 'education', 'skills',
    'projects', 'certifications', 'languages', 'awards',
  ],
  contact: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  customSections: [],
});

export const createSampleResume = () => {
  const resume = createEmptyResume();
  resume.name = 'My Resume';
  resume.contact = {
    fullName: 'Alexandra Chen',
    jobTitle: 'Senior Software Engineer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.dev',
    github: 'github.com/alexchen',
  };
  resume.summary = 'Results-driven senior software engineer with 7+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean architecture, performance optimization, and mentoring junior developers. Track record of delivering high-impact products used by millions.';
  resume.experience = [
    {
      id: crypto.randomUUID(),
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led a team of 6 engineers to redesign the core payment platform, reducing transaction failures by 40%\n• Architected a microservices migration that improved system reliability to 99.97% uptime\n• Mentored 4 junior developers through structured code reviews and pair programming sessions\n• Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
    },
    {
      id: crypto.randomUUID(),
      company: 'StartupXYZ',
      position: 'Software Engineer',
      location: 'New York, NY',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Built a real-time analytics dashboard serving 50K+ daily active users\n• Developed RESTful APIs handling 10M+ requests per day with sub-100ms response times\n• Reduced application load time by 60% through code splitting and lazy loading strategies',
    },
    {
      id: crypto.randomUUID(),
      company: 'Digital Agency Co.',
      position: 'Junior Developer',
      location: 'Boston, MA',
      startDate: '2016-09',
      endDate: '2018-05',
      current: false,
      description: '• Developed responsive web applications for 15+ enterprise clients\n• Collaborated with UX designers to implement pixel-perfect interfaces\n• Wrote comprehensive unit and integration tests achieving 90%+ code coverage',
    },
  ];
  resume.education = [
    {
      id: crypto.randomUUID(),
      institution: 'Massachusetts Institute of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      gpa: '3.8/4.0',
      description: 'Relevant coursework: Data Structures, Algorithms, Distributed Systems, Machine Learning',
    },
  ];
  resume.skills = [
    { id: crypto.randomUUID(), category: 'Languages', items: 'JavaScript, TypeScript, Python, Go, SQL' },
    { id: crypto.randomUUID(), category: 'Frameworks', items: 'React, Node.js, Next.js, Express, Django' },
    { id: crypto.randomUUID(), category: 'Tools & Cloud', items: 'AWS, Docker, Kubernetes, PostgreSQL, Redis, Git' },
  ];
  resume.projects = [
    {
      id: crypto.randomUUID(),
      name: 'OpenTrack',
      url: 'github.com/alexchen/opentrack',
      description: 'Open-source project management tool built with React and Node.js. 2,500+ GitHub stars.',
      technologies: 'React, Node.js, PostgreSQL, Docker',
    },
  ];
  resume.certifications = [
    { id: crypto.randomUUID(), name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2022-08' },
    { id: crypto.randomUUID(), name: 'Google Cloud Professional Developer', issuer: 'Google Cloud', date: '2021-11' },
  ];
  resume.languages = [
    { id: crypto.randomUUID(), language: 'English', proficiency: 'Native' },
    { id: crypto.randomUUID(), language: 'Mandarin', proficiency: 'Professional' },
    { id: crypto.randomUUID(), language: 'Spanish', proficiency: 'Conversational' },
  ];
  resume.awards = [
    { id: crypto.randomUUID(), title: 'Hackathon Grand Prize', issuer: 'TechCrunch Disrupt', date: '2023', description: 'Won first place among 200+ teams for building an AI-powered accessibility tool' },
  ];
  return resume;
};

export const SECTION_LABELS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards & Achievements',
};
