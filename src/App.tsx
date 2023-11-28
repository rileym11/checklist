import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import React from 'react';
import cx from 'classnames';

type Item = { name: string; value: boolean; label: string };

const skewerCase = (text: string) =>
  text.trim().split(' ').join('-').toLowerCase();

type CheckboxProps = {
  onChange: (checkboxName: string) => void;
  name: string;
  value: boolean;
};

const Checkbox = ({ name, onChange, value }: CheckboxProps) => {
  return (
    <div className="checkbox">
      <label className={cx({ checked: value })} htmlFor={name}>
        {name}
      </label>
      <input
        id={name}
        name={name}
        checked={!!value}
        onChange={() => onChange(name)}
        type="checkbox"
      ></input>
    </div>
  );
};

function App({ storage }: { storage?: Item[] }) {
  const [items, setItems] = useState<Item[]>(storage || []);
  const [newItemInput, setNewItemInput] = useState('');

  useEffect(() => {
    localStorage.setItem('storage', JSON.stringify(items));
  }, [items]);

  const updateCheckbox = (checkboxName: string) => {
    setItems((items) =>
      items.map((item) => {
        if (item.name === checkboxName) {
          return { ...item, value: !item.value };
        }
        return item;
      })
    );
  };

  const onAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = skewerCase(newItemInput);
    if (!newItemInput || items.some((item) => name === item.name)) {
      return;
    }

    setItems((items) => [
      ...items,
      { name, label: newItemInput, value: false },
    ]);
  };

  return (
    <div className="App">
      <header>
        <button
          className="emoji"
          type="button"
          onClick={() =>
            setItems((items) => {
              const oldItems = [...items];
              // @ts-expect-error
              oldItems.sort((a, b) => a.value - b.value);
              return oldItems;
            })
          }
        >
          🔀
        </button>
        Grocery Checklist&nbsp;
        <button className="emoji" type="button" onClick={() => setItems([])}>
          🔄
        </button>
      </header>
      <div className="items-list">
        {items.map(({ name, value }) => {
          return (
            <Checkbox
              key={name}
              name={name}
              value={value}
              onChange={updateCheckbox}
            />
          );
        })}
        {!items.length && <p>No items</p>}
      </div>
      <form onSubmit={onAddItem}>
        <input
          onChange={(e) => {
            setNewItemInput(e.target.value);
          }}
          name="add-item"
          value={newItemInput}
          type="text"
        />
        <button type="submit">ADD</button>
      </form>
    </div>
  );
}

export default App;
