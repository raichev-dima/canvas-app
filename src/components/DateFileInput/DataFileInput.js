import React, { useRef, useEffect, useReducer } from 'react';

import processInputFile from '../../utils/processInputFile';
import SrOnly from '../SrOnly/SrOnly';
import styles from './DataFileInput.module.scss';

const FILE_INPUT_ID = 'file-input';

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

const Actions = {
  DRAG_ENTER: 'DRAG_ENTER',
  DRAG_LEAVE: 'DRAG_LEAVE',
  PROCESS_FILE_SUCCESS: 'PROCESS_FILE_SUCCESS',
  PROCESS_FILE_ERROR: 'PROCESS_FILE_ERROR',
  LOADING: 'LOADING',
};

async function readFile(file, dispatch) {
  dispatch({ type: Actions.LOADING, payload: true });
  try {
    const result = await processInputFile(file);
    const blob = new File([result], 'output.txt');

    const dataUrl = URL.createObjectURL(blob);
    dispatch({
      type: Actions.PROCESS_FILE_SUCCESS,
      payload: { result, url: dataUrl },
    });
  } catch (e) {
    dispatch({ type: Actions.PROCESS_FILE_ERROR, payload: e.message });
  } finally {
    dispatch({ type: Actions.LOADING, payload: false });
  }
}

const createDragEventHandler = dispatch => async e => {
  e.preventDefault();
  e.stopPropagation();

  const { type } = e;

  switch (true) {
    case isEnterDragEvent(type):
      dispatch({ type: Actions.DRAG_ENTER });
      break;
    case isLeaveDragEvent(type):
      dispatch({ type: Actions.DRAG_LEAVE });
      break;
    case type === 'drop':
      const [file] = e.dataTransfer.files;
      await readFile(file, dispatch);
      break;
    default:
  }
};

function reducer(state, action) {
  switch (action.type) {
    case Actions.DRAG_LEAVE:
      return { ...state, activeClass: '' };
    case Actions.DRAG_ENTER:
      return { ...state, activeClass: '' };
    case Actions.PROCESS_FILE_SUCCESS:
      const { result, url } = action.payload;
      return { ...state, result, url };
    case Actions.PROCESS_FILE_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function DataFileInput() {
  const ref = useRef(document.createElement('div'));

  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    const node = ref.current;
    const handler = createDragEventHandler(dispatch);
    dragEvents.forEach(eventType => node.addEventListener(eventType, handler));
    return () =>
      dragEvents.forEach(eventType =>
        node.removeEventListener(eventType, handler)
      );
  }, []);

  const handleInputChange = async e => {
    const [file] = e.target.files;

    await readFile(file, dispatch);
  };

  return (
    <>
      <a href={state.url} download="output">
        Link to the file output
      </a>
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
    </>
  );
}

export default DataFileInput;
