import React from 'react';
import { render } from '@testing-library/react';
import Preview from '../Preview';
import AppProvider from '../../../AppProvider';

describe('<Preview /> spec', () => {
  it('renders the component', () => {
    const { container } = render(
      <AppProvider>
        <Preview />
      </AppProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
