import React from 'react';
import { render } from '@testing-library/react';
import DownloadButton from '../DownloadButton';
import AppProvider from '../../../AppProvider';

describe('<DataFileInput /> spec', () => {
  it('renders the component', () => {
    const { container } = render(
      <AppProvider>
        <DownloadButton />
      </AppProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
