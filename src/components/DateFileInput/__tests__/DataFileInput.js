import React from 'react';
import { render } from '@testing-library/react';
import DataFileInput from '../DataFileInput';

describe('<DataFileInput /> spec', () => {
  it('renders the component', () => {
    const { container } = render(<DataFileInput />);
    expect(container).toMatchSnapshot();
  });
});
