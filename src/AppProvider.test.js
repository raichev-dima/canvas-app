import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import AppProvider, {
  useAppState,
  useAppDispatch,
  AppActions,
} from './AppProvider';

const error = 'This was an error while processing your file';
const result = 'This is an awesome result';
const url = 'https://www.some-awesome-url.com';

function Component() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const handleClick = ({ target: { id } }) => {
    switch (id) {
      case AppActions.LOADING:
        dispatch({ type: AppActions.LOADING, payload: true });
        break;
      case AppActions.PROCESS_FILE_ERROR:
        dispatch({ type: AppActions.PROCESS_FILE_ERROR, payload: error });
        break;
      case AppActions.PROCESS_FILE_SUCCESS:
        dispatch({
          type: AppActions.PROCESS_FILE_SUCCESS,
          payload: { result, url },
        });
        break;
      default:
    }
  };

  return (
    <>
      <span data-testid={AppActions.LOADING}>{`${state.loading}`}</span>
      <span data-testid={AppActions.PROCESS_FILE_SUCCESS}>
        {`${state.result || ''} ${state.url || ''}`.trim()}
      </span>
      <span data-testid={AppActions.PROCESS_FILE_ERROR}>{`${state.error ||
        ''}`}</span>
      <button id={AppActions.PROCESS_FILE_SUCCESS} onClick={handleClick} />
      <button id={AppActions.PROCESS_FILE_ERROR} onClick={handleClick} />
      <button id={AppActions.LOADING} onClick={handleClick} />
    </>
  );
}

describe('<AppProvider /> spec', () => {
  describe('useAppState spec', () => {
    it('should throw an error when no context', () => {
      // eslint-disable-next-line
      console.error = jest.fn();
      const StateComponent = () => {
        useAppState();
        return null;
      };

      expect(() => render(<StateComponent />)).toThrow();
    });

    it('should return application state', () => {
      const StateComponent = () => {
        const state = useAppState();
        return <span>{`${state.loading}`}</span>;
      };

      const { container } = render(
        <AppProvider>
          <StateComponent />
        </AppProvider>
      );

      expect(container).toHaveTextContent('false');
    });
  });

  describe('useAppDispatch spec', () => {
    it('should throw an error when no context', () => {
      // eslint-disable-next-line
      console.error = jest.fn();

      const DispatchComponent = () => {
        useAppDispatch();
        return null;
      };

      expect(() => render(<DispatchComponent />)).toThrow();
    });
  });

  it('renders the component', () => {
    const { container } = render(
      <AppProvider>
        <Component />
      </AppProvider>
    );

    const successButton = container.querySelector(
      `#${AppActions.PROCESS_FILE_SUCCESS}`
    );
    const errorButton = container.querySelector(
      `#${AppActions.PROCESS_FILE_ERROR}`
    );

    const loadingButton = container.querySelector(`#${AppActions.LOADING}`);

    const loadingSpan = getByTestId(container, AppActions.LOADING);
    const successSpan = getByTestId(container, AppActions.PROCESS_FILE_SUCCESS);
    const errorSpan = getByTestId(container, AppActions.PROCESS_FILE_ERROR);

    expect(loadingSpan.innerHTML).toBe('false');
    expect(successSpan.innerHTML).toBe('');
    expect(errorSpan.innerHTML).toBe('');

    fireEvent.click(loadingButton);
    expect(loadingSpan.innerHTML).toBe('true');
    expect(successSpan.innerHTML).toBe('');
    expect(errorSpan.innerHTML).toBe('');

    fireEvent.click(errorButton);
    expect(loadingSpan.innerHTML).toBe('false');
    expect(successSpan.innerHTML).toBe('');
    expect(errorSpan.innerHTML).toBe(error);

    fireEvent.click(successButton);
    expect(loadingSpan.innerHTML).toBe('false');
    expect(successSpan.innerHTML).toBe(`${result} ${url}`);
    expect(errorSpan.innerHTML).toBe('');
  });
});
