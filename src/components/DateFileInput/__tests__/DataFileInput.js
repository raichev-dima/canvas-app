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
import AppProvider, { useAppState, AppActions } from '../../../AppProvider';
import FileManager from '../../../utils/FileManager';

describe('<DataFileInput /> spec', () => {
  describe('render', () => {
    let rendered;
    afterEach(cleanup);
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

  it('should handle change event', async done => {
    const successFile = new File(['C 12 12'], 'input.txt', {
      type: 'text/plain',
    });

    const [successResultRaw] = await FileManager.processInputString('C 12 12');

    const successResult = successResultRaw.replace(/\s+/g, ' ').trimEnd();

    const errorFile = new File(['wrong!'], 'input.txt', {
      type: 'text/plain',
    });

    URL.createObjectURL = jest.fn();

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

    const { container } = render(
      <AppProvider>
        <DataFileInput />
        <Component />
      </AppProvider>
    );

    const fileInput = getByLabelText(container, LABEL_TEXT);
    fileInput.blur = jest.fn();

    Object.defineProperty(fileInput, 'files', {
      value: [successFile],
      writable: true,
    });

    fireEvent.change(fileInput);
    expect(fileInput.blur).toHaveBeenCalled();

    const errorStateContainer = getByTestId(
      container,
      AppActions.PROCESS_FILE_ERROR
    );

    const resultStateContainer = getByTestId(
      container,
      AppActions.PROCESS_FILE_SUCCESS
    );

    const loadingStateContainer = getByTestId(container, AppActions.LOADING);
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
        "Couldn't read the file: Couldn't process the input: Couldn't perform unknown action on canvas"
      );
      expect(loadingStateContainer).toHaveTextContent('false');
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });

    done();
  });
});
