import type { SelectPropTypes } from './Select.types.js';

import * as Select from '@radix-ui/react-select';
import React, { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon, DoneIcon } from '../../icons/index.js';
import { Typography } from '../Typography/index.js';

import { SelectContent, SelectItem, SelectTrigger } from './Select.styles.js';

export function SelectComponent<T extends string>(props: SelectPropTypes<T>) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { options, value, container, handleItemClick, variant, id, styles } =
    props;
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  const wrapPortal = (children: React.ReactNode) => {
    if (container) {
      return <Select.Portal container={container}>{children}</Select.Portal>;
    }

    return <>{children}</>;
  };

  return (
    <div ref={selectRef}>
      <Select.Root value={value} open={open}>
        <SelectTrigger
          id={id}
          variant={variant}
          onKeyDown={(event) => event.key === 'Enter' && handleToggle()}
          onClick={handleToggle}
          open={open}
          aria-label={selectedLabel}
          css={styles?.trigger}>
          <Select.Value>
            <Typography variant="body" size="small">
              {selectedLabel}
            </Typography>
          </Select.Value>

          <Select.Icon className="SelectIcon">
            <ChevronDownIcon size={12} color="black" />
          </Select.Icon>
        </SelectTrigger>
        {wrapPortal(
          <SelectContent position="popper" sideOffset={5}>
            <Select.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="SelectViewport">
              <Select.Group>
                {options.map((option) => (
                  <SelectItem
                    onClick={() => {
                      handleItemClick?.(option);
                      handleToggle();
                    }}
                    key={option.value}
                    value={option.value}>
                    <Select.ItemText>
                      <Typography variant="body" size="small" className="_text">
                        {option.label}
                      </Typography>
                    </Select.ItemText>
                    {option.value === value && (
                      <DoneIcon size={14} color="secondary" />
                    )}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="SelectScrollButton">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </SelectContent>
        )}
      </Select.Root>
    </div>
  );
}
