import React from 'react';
import {
  render,
  fireEvent,
  getByLabelText,
  getByTestId,
  cleanup,
  wait,
} from '@testing-library/react';
import DataFileInput, { FILE_INPUT_ID, LABEL_TEXT } from '../DataFileInput';
import AppProvider, {
  useAppState,
  AppActions,
  initialAppState,
} from '../../../AppProvider';
import FileManager from '../../../utils/FileManager';

jest.mock('../../../processFile.worker.js');

describe('<DataFileInput /> spec', () => {
  afterEach(cleanup);
  describe('render', () => {
    let rendered;
    beforeEach(() => {
      rendered = render(
        <AppProvider>
          <DataFileInput />
        </AppProvider>
      );
    });

    it('should render the component', done => {
      const { container } = rendered;
      expect(container).toMatchSnapshot();
      done();
    });

    it('should throw an error when there is no context', done => {
      // eslint-disable-next-line
      console.error = jest.fn();
      expect(() => render(<DataFileInput />)).toThrow();
      done();
    });
  });

  it('should handle drag events', done => {
    const { container } = render(
      <AppProvider>
        <DataFileInput />
      </AppProvider>
    );
    const label = container.querySelector(`label[for=${FILE_INPUT_ID}]`);

    fireEvent.dragEnter(label);
    expect(/active/.test(label.className)).toBe(true);

    fireEvent.dragLeave(label);
    expect(/active/.test(label.className)).toBe(false);

    done();
  });

  describe('change events handlers', () => {
    const successFile = new File(['C 12 12'], 'input.txt', {
      type: 'text/plain',
    });

    let successResult;

    const Component = () => {
      const state = useAppState();

      return (
        <>
          <span data-testid={AppActions.LOADING}>
            {state.loading.toString()}
          </span>
          <span data-testid={AppActions.PROCESS_FILE_ERROR}>{state.error}</span>
          <span data-testid={AppActions.PROCESS_FILE_SUCCESS}>
            {state.result}
          </span>
        </>
      );
    };

    let container,
      errorStateContainer,
      resultStateContainer,
      loadingStateContainer,
      fileInput;

    beforeEach(async () => {
      const [successResultRaw] = await FileManager.processInputString(
        'C 12 12'
      );
      successResult = successResultRaw.replace(/\s+/g, ' ').trimEnd();

      const result = render(
        <AppProvider>
          <DataFileInput data-testid={'data-file-input'} />
          <Component />
        </AppProvider>
      );

      container = result.container;

      errorStateContainer = getByTestId(
        container,
        AppActions.PROCESS_FILE_ERROR
      );

      resultStateContainer = getByTestId(
        container,
        AppActions.PROCESS_FILE_SUCCESS
      );

      loadingStateContainer = getByTestId(container, AppActions.LOADING);

      fileInput = getByLabelText(container, LABEL_TEXT);
      fileInput.blur = jest.fn();
      URL.createObjectURL = jest.fn();
    });

    const errorFile = new File(['wrong!'], 'input.txt', {
      type: 'text/plain',
    });

    it('should handle change event', async done => {
      const fileInput = getByLabelText(container, LABEL_TEXT);
      fileInput.blur = jest.fn();

      Object.defineProperty(fileInput, 'files', {
        value: [successFile],
        writable: true,
      });

      fireEvent.change(fileInput);
      expect(fileInput.blur).toHaveBeenCalled();

      expect(loadingStateContainer).toHaveTextContent('true');

      await wait(() => {
        expect(resultStateContainer).toHaveTextContent(successResult);
        expect(loadingStateContainer).toHaveTextContent('false');
        expect(URL.createObjectURL).toHaveBeenCalled();
      });

      fileInput.files = [errorFile];

      fireEvent.change(fileInput);
      expect(loadingStateContainer).toHaveTextContent('true');

      await wait(() => {
        expect(errorStateContainer).toHaveTextContent(
          "Couldn't read the file: Couldn't process the input: Couldn't paint on non-existent canvas"
        );
        expect(loadingStateContainer).toHaveTextContent('false');
        expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      });

      done();
    });

    it('should handle drop event', async done => {
      const mockDropEvent = new Event('drop');
      Object.defineProperty(mockDropEvent, 'dataTransfer', {
        value: {
          files: [successFile],
        },
      });

      const dataFileInput = getByTestId(container, 'data-file-input');

      fireEvent(dataFileInput, mockDropEvent);

      expect(loadingStateContainer).toHaveTextContent('true');

      await wait(() => {
        expect(resultStateContainer).toHaveTextContent(successResult);
        expect(loadingStateContainer).toHaveTextContent('false');
        expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      });

      done();
    });

    it('should not handle drop event while loading', async done => {
      const mockDropEvent = new Event('drop');
      Object.defineProperty(mockDropEvent, 'dataTransfer', {
        value: {
          files: [successFile],
        },
      });

      Object.defineProperty(mockDropEvent, 'preventDefault', {
        value: jest.fn(),
      });

      Object.defineProperty(mockDropEvent, 'stopPropagation', {
        value: jest.fn(),
      });

      const result = render(
        <AppProvider state={{ loading: true }}>
          <DataFileInput data-testid={'data-file-input'} />
          <Component />
        </AppProvider>
      );

      let container = result.container;

      resultStateContainer = getByTestId(
        container,
        AppActions.PROCESS_FILE_SUCCESS
      );

      loadingStateContainer = getByTestId(container, AppActions.LOADING);

      const dataFileInput = getByTestId(container, 'data-file-input');
      fireEvent(dataFileInput, mockDropEvent);

      await wait(() => {
        expect(mockDropEvent.preventDefault).toHaveBeenCalled();
        expect(mockDropEvent.stopPropagation).toHaveBeenCalled();
        expect(resultStateContainer).toHaveTextContent('');
        expect(loadingStateContainer).toHaveTextContent('true');
        expect(URL.createObjectURL).not.toHaveBeenCalledTimes(1);
      });

      done();
    });
  });

  it('should reset state after change event', async done => {
    const Component = () => {
      const state = useAppState();

      return (
        <>
          <span data-testid={AppActions.RESET}>
            {`${state.loading.toString()}${state.progress.toString()}`}
          </span>
        </>
      );
    };

    const { container } = render(
      <AppProvider state={{ loading: true, progress: 1234 }}>
        <DataFileInput />
        <Component />
      </AppProvider>
    );

    const fileInput = getByLabelText(container, LABEL_TEXT);

    fireEvent.change(fileInput);

    const resetStateContainer = getByTestId(container, AppActions.RESET);

    await wait(() => {
      expect(resetStateContainer).toHaveTextContent(
        `${initialAppState.loading.toString()}${initialAppState.progress.toString()}`
      );
    });
    done();
  });

  it('should handle progress change', async done => {
    URL.createObjectURL = jest.fn();
    const dispatchProgress = jest.fn();

    const { container } = render(
      <AppProvider>
        <DataFileInput dispatchProgress={dispatchProgress} />
      </AppProvider>
    );

    const fileInput = getByLabelText(container, LABEL_TEXT);

    const file = new File(['C 7 7\nL 1 3 1 6'], 'input.txt', {
      type: 'text/plain',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: true,
    });

    fireEvent.change(fileInput);

    await wait(() => {
      expect(dispatchProgress).toHaveBeenCalledTimes(4);
    });

    done();
  });
});
