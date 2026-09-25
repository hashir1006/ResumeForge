import { ResumeProvider, useResume } from './context/ResumeContext';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';

function AppContent() {
  const { state } = useResume();

  if (state.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (state.view === 'editor' && state.resume) {
    return <Editor />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
