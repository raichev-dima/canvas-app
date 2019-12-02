import React, { useRef, useEffect, useReducer, useState } from 'react';

import SrOnly from '../SrOnly/SrOnly';
import styles from './DataFileInput.module.scss';
import { useAppDispatch, useAppState, AppActions } from '../../AppProvider';
import WebWorker from '../../processFile.worker';
import ProgressBar from '../ProgressBar/ProgressBar';

export const FILE_INPUT_ID = 'file-input';
export const LABEL_TEXT = 'Drag your input file here or click in this area';

const dragEvents = [
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'dragexit',
  'drop',
];

const isEnterDragEvent = eventType => /dragover|dragenter/.test(eventType);
const isLeaveDragEvent = eventType => /dragleave|dragexit|drop/.test(eventType);

export const DataFileInputActions = {
  DRAG_ENTER: 'DRAG_ENTER',
  DRAG_LEAVE: 'DRAG_LEAVE',
};

function dataFileInputReducer(state, action) {
  switch (action.type) {
    case DataFileInputActions.DRAG_LEAVE:
      return { ...state, active: false };
    case DataFileInputActions.DRAG_ENTER:
      return { ...state, active: true };
    default:
      return state;
  }
}

const useDragEventHandler = () => {
  const [state, dispatch] = useReducer(dataFileInputReducer, { active: false });
  const handler = e => {
    e.preventDefault();
    e.stopPropagation();

    const { type } = e;

    switch (true) {
      case isEnterDragEvent(type):
        dispatch({ type: DataFileInputActions.DRAG_ENTER });
        break;
      case isLeaveDragEvent(type):
        dispatch({ type: DataFileInputActions.DRAG_LEAVE });
        break;
      default:
    }
  };

  return [state, handler];
};

function DataFileInput() {
  const ref = useRef(document.createElement('div'));
  const workerRef = useRef(new WebWorker());

  const [file, setFile] = useState();

  const [state, dragEventHandler] = useDragEventHandler();

  const appDispatch = useAppDispatch();
  const appState = useAppState();

  useEffect(() => {
    const thisWorker = workerRef.current;
    const messageHandler = ({ data }) => {
      const { error, progress, ...payload } = data;

      if (!error && !progress) {
        appDispatch({
          type: AppActions.PROCESS_FILE_SUCCESS,
          payload,
        });
      } else if (progress) {
        appDispatch({
          type: AppActions.PROGRESS_CHANGE,
          payload: progress,
        });
      } else {
        appDispatch({
          type: AppActions.PROCESS_FILE_ERROR,
          payload: error,
        });
      }
    };

    const errorHandler = error => {
      error.preventDefault();
      thisWorker.terminate();
    };

    thisWorker.addEventListener('message', messageHandler);
    thisWorker.addEventListener('error', errorHandler);
    return () => {
      thisWorker.terminate();
    };
  }, [appDispatch]);

  useEffect(() => {
    const node = ref.current;

    const handleDrop = e => {
      if (appState.loading) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      appDispatch({ type: AppActions.RESET });

      const [file] = e.dataTransfer.files;

      if (file) {
        setFile(file);
      }

      e.target.blur();
    };

    dragEvents.forEach(eventType =>
      node.addEventListener(eventType, dragEventHandler)
    );

    node.addEventListener('drop', handleDrop);

    return () => {
      dragEvents.forEach(eventType =>
        node.removeEventListener(eventType, dragEventHandler)
      );
      node.removeEventListener('drop', handleDrop);
    };
  }, [appDispatch, appState.loading, dragEventHandler]);

  useEffect(() => {
    if (file) {
      appDispatch({ type: AppActions.LOADING, payload: true });

      workerRef.current.postMessage([file]);
    }
  }, [file, appDispatch]);

  const [loading, setLoading] = useState(false);

  // Delay a loading indicator by a half a sec
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(appState.loading);
    }, 500);
    return () => clearTimeout(timeout);
  }, [appState.loading]);

  const handleInputChange = e => {
    appDispatch({ type: AppActions.RESET });
    const [file] = e.target.files;

    if (file) {
      setFile(file);
    }

    e.target.blur();
  };

  const labelClass = `${styles.inputDataField__label} ${
    state.active && !loading ? 'active' : ''
  }`;

  const labelStyle = loading
    ? {
        cursor: 'not-allowed',
        opacity: 0.7,
      }
    : {};

  return (
    <div ref={ref} className={styles.inputDataField}>
      <SrOnly
        is="input"
        type="file"
        id={FILE_INPUT_ID}
        accept=".txt"
        onChange={handleInputChange}
        className={styles.inputDataField__input}
        disabled={appState.loading} // disable input right after loading event without any delay
      />
      <label className={labelClass} htmlFor={FILE_INPUT_ID} style={labelStyle}>
        <span>{LABEL_TEXT}</span>
        <div className={styles.inputDataField__overlay} />
        {loading && <ProgressBar progress={appState.progress} />}
      </label>
    </div>
  );
}

export default DataFileInput;
