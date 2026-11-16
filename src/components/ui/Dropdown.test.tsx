import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { Dropdown } from './Dropdown';

const options = [
  { value: 'created_at:desc', label: 'Najnowsze' },
  { value: 'created_at:asc', label: 'Najstarsze' },
  { value: 'title:asc', label: 'Tytuł A–Z' }
];

// Kontrolowany jak w prawdziwym użyciu — wartość żyje w stanie rodzica
const Harness = ({ onChange }: { onChange?: (value: string) => void }) => {
  const [value, setValue] = useState(options[0].value);

  return (
    <Dropdown
      aria-label="Sortowanie"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

describe('Dropdown', () => {
  it('opens on click, marks the selected option and picks another one', () => {
    render(<Harness />);
    const combobox = screen.getByRole('combobox', { name: 'Sortowanie' });

    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'Najnowsze' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    fireEvent.click(screen.getByRole('option', { name: 'Tytuł A–Z' }));

    expect(combobox).toHaveTextContent('Tytuł A–Z');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('works from the keyboard like a native select', () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);
    const combobox = screen.getByRole('combobox', { name: 'Sortowanie' });

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Najstarsze' }).id
    );

    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('created_at:asc');

    // Esc zamyka bez zmiany wyboru
    fireEvent.keyDown(combobox, { key: 'Enter' });
    fireEvent.keyDown(combobox, { key: 'End' });
    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveTextContent('Najstarsze');

    // pisanie liter na zamkniętym polu wybiera pasującą opcję
    fireEvent.keyDown(combobox, { key: 't' });
    expect(onChange).toHaveBeenLastCalledWith('title:asc');
  });

  it('closes when clicking outside', () => {
    render(
      <>
        <Harness />
        <button type="button">poza</button>
      </>
    );
    const combobox = screen.getByRole('combobox', { name: 'Sortowanie' });

    fireEvent.click(combobox);
    fireEvent.mouseDown(screen.getByRole('button', { name: 'poza' }));

    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });
});
