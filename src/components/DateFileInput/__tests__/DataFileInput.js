import React from 'react';
import { render } from '@testing-library/react';
import DataFileInput from '../DataFileInput';
import AppProvider from '../../../AppProvider';

describe('<DataFileInput /> spec', () => {
  it('renders the component', () => {
    const { container } = render(
      <AppProvider>
        <DataFileInput />
      </AppProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
