import React, { useReducer, useContext, createContext } from 'react';

const noop = () => {};

const StateContext = createContext(noop);
const DispatchContext = createContext(noop);

export const AppActions = {
  PROCESS_FILE_SUCCESS: 'PROCESS_FILE_SUCCESS',
  PROCESS_FILE_ERROR: 'PROCESS_FILE_ERROR',
  LOADING: 'LOADING',
};

function appReducer(state, action) {
  switch (action.type) {
    case AppActions.PROCESS_FILE_SUCCESS:
      const { result, url } = action.payload;
      return { result, url, loading: false };
    case AppActions.PROCESS_FILE_ERROR:
      return { error: action.payload, loading: false };
    case AppActions.LOADING:
      return { loading: action.payload };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, { loading: false });

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
