import React, { useRef, useEffect, useReducer, useState } from 'react';

import SrOnly from '../SrOnly/SrOnly';
import styles from './DataFileInput.module.scss';
import { useAppDispatch, AppActions } from '../../AppProvider';
import WebWorker from '../../processFile.worker';

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

  useEffect(() => {
    const thisWorker = workerRef.current;
    const messageHandler = ({ data }) => {
      const { error, ...payload } = data;

      if (!error) {
        appDispatch({
          type: AppActions.PROCESS_FILE_SUCCESS,
          payload,
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
      e.preventDefault();
      e.stopPropagation();

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
  }, [dragEventHandler]);

  useEffect(() => {
    if (file) {
      appDispatch({ type: AppActions.LOADING, payload: true });

      workerRef.current.postMessage([file]);
    }
  }, [file, appDispatch]);

  const handleInputChange = e => {
    const [file] = e.target.files;

    if (file) {
      setFile(file);
    }

    e.target.blur();
  };

  const labelClass = `${styles.inputDataField__label} ${
    state.active ? 'active' : ''
  }`;

  return (
    <div ref={ref} className={styles.inputDataField}>
      <SrOnly
        is="input"
        type="file"
        id={FILE_INPUT_ID}
        accept=".txt"
        onChange={handleInputChange}
        className={styles.inputDataField__input}
      />
      <label className={labelClass} htmlFor={FILE_INPUT_ID}>
        <span>{LABEL_TEXT}</span>
        <div className={styles.inputDataField__overlay} />
      </label>
    </div>
  );
}

export default DataFileInput;
