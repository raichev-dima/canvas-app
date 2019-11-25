import React, { useRef, useEffect, useReducer } from 'react';

import FileManager from '../../utils/FileManager';
import SrOnly from '../SrOnly/SrOnly';
import styles from './DataFileInput.module.scss';
import { useAppDispatch, AppActions } from '../../AppProvider';

export const FILE_INPUT_ID = 'file-input';

const dragEvents = [
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'dragexit',
];

const isEnterDragEvent = eventType => /dragover|dragenter/.test(eventType);
const isLeaveDragEvent = eventType => /dragleave|dragexit/.test(eventType);

function useReadFile(fileHandler) {
  const dispatch = useAppDispatch();

  return async function(file) {
    dispatch({ type: AppActions.LOADING, payload: true });
    try {
      const [result, dataUrl] = await fileHandler(file);
      dispatch({
        type: AppActions.PROCESS_FILE_SUCCESS,
        payload: { result, url: dataUrl },
      });
    } catch (e) {
      dispatch({ type: AppActions.PROCESS_FILE_ERROR, payload: e.message });
    } finally {
      dispatch({ type: AppActions.LOADING, payload: false });
    }
  };
}

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
  const handler = async e => {
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

const useDropEventHandler = prepareOutput => {
  const readFile = useReadFile(prepareOutput);

  return async e => {
    e.preventDefault();
    e.stopPropagation();

    const [file] = e.dataTransfer.files;
    await readFile(file);
  };
};

function DataFileInput() {
  const ref = useRef(document.createElement('div'));
  const readFile = useReadFile(FileManager.prepareOutput);

  const dropEventHandler = useDropEventHandler(FileManager.prepareOutput);
  const [state, dragEventHandler] = useDragEventHandler();

  useEffect(() => {
    const node = ref.current;
    dragEvents.forEach(eventType =>
      node.addEventListener(eventType, dragEventHandler)
    );
    node.addEventListener('drop', dropEventHandler);
    return () => {
      dragEvents.forEach(eventType =>
        node.removeEventListener(eventType, dragEventHandler)
      );
      node.removeEventListener('drop', dropEventHandler);
    };
  }, [dragEventHandler, dropEventHandler]);

  const handleInputChange = async e => {
    const [file] = e.target.files;

    await readFile(file);
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
        <span>Drag your input file here or click in this area</span>
        <div className={styles.inputDataField__overlay} />
      </label>
    </div>
  );
}

export default DataFileInput;
