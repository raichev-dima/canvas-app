import React from 'react';
import { render } from '@testing-library/react';
import Preview from '../Preview';

describe('<Preview /> spec', () => {
  it('renders the component', () => {
    const { container } = render(<Preview />);
    expect(container).toMatchSnapshot();
  });
});
