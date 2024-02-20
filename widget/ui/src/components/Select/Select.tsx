import type { PropTypes } from './Select.types';

import * as Select from '@radix-ui/react-select';
import React, { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '../../icons';
import { Typography } from '../Typography';

import { SelectContent, SelectItem, SelectTrigger } from './select.styles';

export function SelectComponent(props: PropTypes) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { options, value, container, handleItemClick } = props;
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

  return (
    <div ref={selectRef}>
      <Select.Root value={value.value} open={open}>
        <SelectTrigger
          onKeyDown={(event) => event.key === 'Enter' && handleToggle()}
          onClick={handleToggle}
          open={open}
          aria-label={value.label}>
          <Select.Value>
            <Typography variant="body" size="small">
              {value.label}
            </Typography>
          </Select.Value>

          <Select.Icon className="SelectIcon">
            <ChevronDownIcon size={12} />
          </Select.Icon>
        </SelectTrigger>
        <Select.Portal container={container}>
          <SelectContent>
            <Select.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="SelectViewport">
              <Select.Group>
                {options.map(
                  (option) =>
                    option.value !== value?.value && (
                      <SelectItem
                        onClick={() => {
                          handleItemClick && handleItemClick(option);
                          handleToggle();
                        }}
                        key={option.value}
                        value={option.value}>
                        <Select.ItemText>
                          <Typography variant="body" size="small">
                            {option.label}
                          </Typography>
                        </Select.ItemText>
                      </SelectItem>
                    )
                )}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="SelectScrollButton">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </SelectContent>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
