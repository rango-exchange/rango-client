import React, { forwardRef, useEffect, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import './style.css';
import Chip from '../Chip/Chip';
import VirtualizedList from '../VirtualizedList/VirtualizedList';
import TextField from '../TextField/TextField';
import { darkTheme, styled } from '../../theme';
import ListItem from '../ListItem';
import { CommonProps } from 'react-window';

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

interface SingleSelect {
  multiple: false;
  defaultValue: { value: string; label: string };
}

interface MultipleSelect {
  multiple: true;
  defaultValue: { value: string; label: string }[];
}
export type PropTypes = (SingleSelect | MultipleSelect) & {
  useVirualizedList?: boolean;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  SelectedOptionComp?: React.ReactNode;
  OptionComp?: React.ReactNode;
  clearButton?: boolean;
  disabled?: boolean;
};

const ComboBoxContainer = styled('div', {
  maxHeight: 'fit-content',
  position: 'relative',
  border: '1px solid $borderColor',
  borderRadius: '$s',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  transition: 'border-color ease .3s',
  padding: '$0 $4',
  '&:focus-within': {
    borderColor: '$info',
  },
  variants: {
    disabled: {
      true: {
        backgroundColor: '$backgroundColorDisabled',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
      },
    },
    multiple: {
      true: {
        minHeight: '3rem',
        height: 'auto',
        paddingTop: '$2',
      },
    },
  },
  '& input': {
    border: 'none',
    flexGrow: 1,
    backgroundColor: 'transparent',
    outline: 'none',
    marginBottom: '$2',
  },
});

const SelectedValues = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
});

const CloseIcon = styled(Cross2Icon, {
  color: '$error',
  cursor: 'pointer',
  marginLeft: '$2',
  '&:hover': {
    opacity: '0.5',
  },
});

const DropDownContainer = styled('div', {
  backgroundColor: '$neutral-100',
  boxShadow:
    '0px 3px 5px -1px #f0f2f5, 0px 6px 10px 0px #f0f2f5, 0px 1px 18px 0px #f0f2f5',
  padding: '$1 $2',
  // height: 'auto',
  height: '50vh',
  position: 'absolute',
  top: '102%',
  width: '100%',
  left: 0,
  boxSizing: 'border-box',
  overflowX: 'hidden',
});

function ComboBox(props: PropTypes) {
  const {
    multiple,
    disabled,
    defaultValue,
    options,
    onChange,
    useVirualizedList,
  } = props;

  const [filteredOptions, setFilterdOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >(options);
  const [open, setOpen] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [searchedText, setSearchedText] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<
    {
      value: string;
      label: string;
    }[]
  >(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);

  const PAGE_SIZE = 5;

  const loadNextPage = () => {
    setIsNextPageLoading(true);
    setTimeout(() => {
      setIsNextPageLoading(false);
      setFilterdOptions(options.slice(0, filteredOptions.length + PAGE_SIZE));
    }, 0);
  };
  useEffect(() => {
    setHasNextPage(options.length > filteredOptions.length);
  }, [options.length, filteredOptions.length]);

  useEffect(() => {
    if (open) {
      setSearchedText('');
      if (filteredOptions.length > PAGE_SIZE)
        setFilterdOptions(options.slice(0, PAGE_SIZE));
    }
  }, [open]);

  useEffect(() => {
    console.log(searchedText);
    setFilterdOptions(options.filter((pr) => pr.label.includes(searchedText)));
  }, [searchedText]);
  console.log(filteredOptions);

  useEffect(() => {
    setFilterdOptions(options.slice(0, PAGE_SIZE));
  }, [options.length]);

  const handleSelect = (value: string, label: string) => {
    console.log('handle select');
    if (!multiple) {
      if (!selectedValue.find((v) => v.value === value))
        setSelectedValue([{ value, label }]);
    } else {
      if (!selectedValue.find((v) => v.value === value))
        setSelectedValue((prev) => [...prev, { value, label }]);
      else setSelectedValue((prev) => prev.filter((v) => v.value != value));
    }
  };

  const innerElementType: React.FC<CommonProps> = forwardRef(
    ({ style, ...rest }, ref) => {
      console.log(`${parseFloat(style?.height as string) + 8 * 2}px`);
      return (
        <div
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          style={{
            ...style,
            // eslint-disable-next-line react/prop-types
            height: `${parseFloat(style?.height as string) + 8 * 2}px`,
          }}
          {...rest}
        />
      );
    }
  );

  console.log(filteredOptions, open);
  return (
    <ComboBoxContainer
      multiple={multiple}
      disabled={disabled}
      onClick={setOpen.bind(null, true)}
      onBlur={(e) => {
        setOpen(false);
      }}
    >
      <SelectedValues>
        {multiple
          ? selectedValue.map((v) => (
              <Chip
                style={{ marginBottom: '0.5rem' }}
                onClick={() => {
                  handleSelect(v.value, v.label);
                }}
                variant="contained"
                label={v.label}
                suffix={<CloseIcon />}
              />
            ))
          : selectedValue[0].label}
        {open && (
          <input
            value={searchedText}
            onChange={(e) => setSearchedText(e.target.value)}
          />
        )}
      </SelectedValues>
      {open && (
        <DropDownContainer onMouseDown={(e) => e.preventDefault()}>
          {!useVirualizedList ? (
            filteredOptions.map((option) => (
              <ListItem
                style={{
                  margin: '0.5rem 0',
                  display: 'flex',
                  alignItems: 'center',
                }}
                // value={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(option.value, option.label);
                }}
                isSelected={
                  !!selectedValue.find((v) => v.value === option.value)
                }
              >
                {option.label}
              </ListItem>
            ))
          ) : (
            <VirtualizedList
              innerElementType={innerElementType}
              itemCount={filteredOptions.length}
              focus={1}
              Item={({ style, index }) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    ...style,
                    height: '3.5rem',
                    top: `${parseFloat(style?.top as string) + 8}px`,
                  }}
                >
                  <ListItem
                    // value={option.value}
                    onClick={() => {
                      handleSelect(
                        filteredOptions[index].value,
                        filteredOptions[index].label
                      );
                    }}
                    isSelected={
                      !!selectedValue.find(
                        (v) => v.value === filteredOptions[index].value
                      )
                    }
                    style={{
                      width: '100%',
                      height: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {filteredOptions[index].label}
                  </ListItem>
                </div>
              )}
              isNextPageLoading={isNextPageLoading}
              loadNextPage={loadNextPage}
              hasNextPage={hasNextPage}
            />
          )}
        </DropDownContainer>
      )}
    </ComboBoxContainer>
  );
}

export default ComboBox;
