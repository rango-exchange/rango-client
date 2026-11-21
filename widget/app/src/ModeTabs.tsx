import React from 'react';

export type AppMode = 'swap' | 'refuel' | 'stocks';

const MODES: { id: AppMode; title: string }[] = [
  { id: 'swap', title: 'Swap' },
  { id: 'refuel', title: 'Refuel' },
  { id: 'stocks', title: 'Stocks' },
];

type PropTypes = {
  value: AppMode;
  onChange: (mode: AppMode) => void;
};

export function ModeTabs(props: PropTypes) {
  const { value, onChange } = props;

  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        margin: '16px auto',
        width: 'fit-content',
        borderRadius: 12,
        background: '#EEF1F6',
        fontFamily: 'sans-serif',
      }}>
      {MODES.map((mode) => {
        const selected = mode.id === value;
        return (
          // eslint-disable-next-line jsx-id-attribute-enforcement/missing-ids
          <button
            key={mode.id}
            id={`app-mode-tab-${mode.id}`}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(mode.id)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: selected ? '#1C3CF1' : '#5A5A5A',
              background: selected ? '#FFFFFF' : 'transparent',
              boxShadow: selected ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
            }}>
            {mode.title}
          </button>
        );
      })}
    </div>
  );
}
