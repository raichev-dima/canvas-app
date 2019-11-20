import React from 'react';
import { render } from '@testing-library/react';
import DownloadButton from '../DownloadButton';

describe('<DataFileInput /> spec', () => {
  it('renders the component', () => {
    const { container } = render(<DownloadButton />);
    expect(container).toMatchSnapshot();
  });
});
