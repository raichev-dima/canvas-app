import React, { useReducer, useContext, createContext } from 'react';

const StateContext = createContext(undefined);
const DispatchContext = createContext(undefined);

export const AppActions = {
  PROCESS_FILE_SUCCESS: 'PROCESS_FILE_SUCCESS',
  PROCESS_FILE_ERROR: 'PROCESS_FILE_ERROR',
  LOADING: 'LOADING',
  PROGRESS_CHANGE: 'PROGRESS_CHANGE',
  RESET: 'RESET',
};

export const initialAppState = { loading: false, progress: 0 };

function appReducer(state, action) {
  switch (action.type) {
    case AppActions.PROCESS_FILE_SUCCESS:
      const { result, url, snapshot } = action.payload;
      return { result, url, snapshot, loading: false };
    case AppActions.PROCESS_FILE_ERROR:
      return { error: action.payload, loading: false };
    case AppActions.LOADING:
      return { loading: action.payload };
    case AppActions.PROGRESS_CHANGE:
      return { ...state, progress: action.payload };
    case AppActions.RESET:
      return initialAppState;
    default:
      return state;
  }
}

function AppProvider({ children, state: initialState = initialAppState }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }
  return context;
}

export default AppProvider;
