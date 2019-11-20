import React, { useRef, useEffect } from 'react';

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
  'drop',
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

const useDragEventHandler = prepareOutput => {
  const dispatch = useAppDispatch();
  const readFile = useReadFile(prepareOutput);

  return async e => {
    e.preventDefault();
    e.stopPropagation();

    const { type } = e;

    switch (true) {
      case isEnterDragEvent(type):
        dispatch({ type: AppActions.DRAG_ENTER });
        break;
      case isLeaveDragEvent(type):
        dispatch({ type: AppActions.DRAG_LEAVE });
        break;
      case type === 'drop':
        const [file] = e.dataTransfer.files;
        await readFile(file);
        break;
      default:
    }
  };
};

function DataFileInput() {
  const ref = useRef(document.createElement('div'));
  const readFile = useReadFile(FileManager.prepareOutput);

  const dragEventHandler = useDragEventHandler(FileManager.prepareOutput);

  useEffect(() => {
    const node = ref.current;
    dragEvents.forEach(eventType =>
      node.addEventListener(eventType, dragEventHandler)
    );
    return () =>
      dragEvents.forEach(eventType =>
        node.removeEventListener(eventType, dragEventHandler)
      );
  }, [dragEventHandler]);

  const handleInputChange = async e => {
    const [file] = e.target.files;

    await readFile(file);
  };

  return (
    <div ref={ref} className={styles.inputDataField}>
      <label className={styles.inputDataField__label} htmlFor={FILE_INPUT_ID}>
        <span>Drag your input file here or click in this area</span>
        <div className={styles.inputDataField__overlay} />
      </label>
      <SrOnly>
        <input
          type="file"
          id={FILE_INPUT_ID}
          accept=".txt"
          onChange={handleInputChange}
        />
      </SrOnly>
    </div>
  );
}

export default DataFileInput;
