import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { storage } from '../data/storage';
import { createEmptyResume, createSampleResume } from '../data/resumeDefaults';
import { getTemplateDefaults } from '../data/templates';

const ResumeContext = createContext(null);

const MAX_HISTORY = 50;

const initialState = {
  // Current view: 'dashboard' | 'templates' | 'editor'
  view: 'dashboard',
  // Current resume being edited
  resume: null,
  // All saved resume metas
  savedResumes: [],
  // Undo/redo history
  history: [],
  historyIndex: -1,
  // Save status: 'idle' | 'saving' | 'saved' | 'error'
  saveStatus: 'idle',
  // Loading state
  loading: true,
  // Template selection (for switching)
  showTemplateSelector: false,
  // Error
  error: null,
};

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_SAVED_RESUMES':
      return { ...state, savedResumes: action.payload, loading: false };

    case 'LOAD_RESUME': {
      const resume = action.payload;
      return {
        ...state,
        resume,
        view: 'editor',
        history: [JSON.stringify(resume)],
        historyIndex: 0,
        saveStatus: 'saved',
      };
    }

    case 'UPDATE_RESUME': {
      const updated = { ...state.resume, ...action.payload, updatedAt: new Date().toISOString() };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(updated));
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        ...state,
        resume: updated,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        saveStatus: 'idle',
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      return {
        ...state,
        resume: JSON.parse(state.history[idx]),
        historyIndex: idx,
        saveStatus: 'idle',
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      return {
        ...state,
        resume: JSON.parse(state.history[idx]),
        historyIndex: idx,
        saveStatus: 'idle',
      };
    }

    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.payload };

    case 'TOGGLE_TEMPLATE_SELECTOR':
      return { ...state, showTemplateSelector: !state.showTemplateSelector };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLOSE_EDITOR':
      return {
        ...state,
        resume: null,
        view: 'dashboard',
        history: [],
        historyIndex: -1,
      };

    default:
      return state;
  }
}

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const saveTimeoutRef = useRef(null);

  // Load saved resumes on mount
  useEffect(() => {
    (async () => {
      try {
        const metas = await storage.getAllResumeMetas();
        dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved resumes' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  // Autosave debounce
  useEffect(() => {
    if (!state.resume || state.saveStatus === 'saved' || state.saveStatus === 'saving') return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      dispatch({ type: 'SET_SAVE_STATUS', payload: 'saving' });
      try {
        await storage.saveResume(state.resume);
        const metas = await storage.getAllResumeMetas();
        dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
        dispatch({ type: 'SET_SAVE_STATUS', payload: 'saved' });
      } catch (e) {
        dispatch({ type: 'SET_SAVE_STATUS', payload: 'error' });
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state.resume, state.saveStatus]);

  const actions = {
    createNewResume: useCallback(async (useSample = false) => {
      const resume = useSample ? createSampleResume() : createEmptyResume();
      await storage.saveResume(resume);
      const metas = await storage.getAllResumeMetas();
      dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
      dispatch({ type: 'LOAD_RESUME', payload: resume });
    }, []),

    openResume: useCallback(async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const resume = await storage.getResume(id);
        if (resume) {
          dispatch({ type: 'LOAD_RESUME', payload: resume });
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Resume not found' });
        }
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load resume' });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }, []),

    updateResume: useCallback((updates) => {
      dispatch({ type: 'UPDATE_RESUME', payload: updates });
    }, []),

    deleteResume: useCallback(async (id) => {
      await storage.deleteResume(id);
      const metas = await storage.getAllResumeMetas();
      dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
    }, []),

    duplicateResume: useCallback(async (id) => {
      await storage.duplicateResume(id);
      const metas = await storage.getAllResumeMetas();
      dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
    }, []),

    renameResume: useCallback(async (id, name) => {
      await storage.renameResume(id, name);
      const metas = await storage.getAllResumeMetas();
      dispatch({ type: 'SET_SAVED_RESUMES', payload: metas });
    }, []),

    undo: useCallback(() => dispatch({ type: 'UNDO' }), []),
    redo: useCallback(() => dispatch({ type: 'REDO' }), []),

    setView: useCallback((v) => dispatch({ type: 'SET_VIEW', payload: v }), []),
    closeEditor: useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), []),
    toggleTemplateSelector: useCallback(() => dispatch({ type: 'TOGGLE_TEMPLATE_SELECTOR' }), []),

    changeTemplate: useCallback((templateId, hasPhoto) => {
      const defaults = getTemplateDefaults(templateId);
      dispatch({
        type: 'UPDATE_RESUME',
        payload: {
          templateId,
          hasPhoto: hasPhoto !== undefined ? hasPhoto : (state.resume?.hasPhoto ?? false),
          customization: {
            ...defaults,
            backgroundColor: state.resume?.customization?.backgroundColor || '#ffffff',
            textColor: state.resume?.customization?.textColor || '#1e293b',
            headingColor: state.resume?.customization?.headingColor || '#0f172a',
            sectionSpacing: state.resume?.customization?.sectionSpacing || 16,
            lineHeight: state.resume?.customization?.lineHeight || 1.4,
          },
        },
      });
    }, [state.resume]),

    resetCustomization: useCallback((templateId) => {
      const defaults = getTemplateDefaults(templateId);
      dispatch({
        type: 'UPDATE_RESUME',
        payload: {
          customization: {
            ...defaults,
            backgroundColor: '#ffffff',
            textColor: '#1e293b',
            headingColor: '#0f172a',
            sectionSpacing: 16,
            lineHeight: 1.4,
          },
        },
      });
    }, []),

    clearError: useCallback(() => dispatch({ type: 'SET_ERROR', payload: null }), []),
  };

  return (
    <ResumeContext.Provider value={{ state, actions }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
