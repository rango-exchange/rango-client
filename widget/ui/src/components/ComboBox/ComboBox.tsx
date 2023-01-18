import React, { forwardRef, useEffect, useState } from 'react';
import './style.css';
import Chip from '../Chip/Chip';
import VirtualizedList from '../VirtualizedList/VirtualizedList';
import { styled } from '../../theme';
import ListItem from '../ListItem';
import { CommonProps } from 'react-window';
import { AngleDown, Close } from '../Icon';
import CloseIcon from '../Icon/Close';
import { containsText } from '../../helpers';

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
  border: '1px solid $neutrals400',
  borderRadius: '$5',
  height: '$48',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  transition: 'border-color ease .3s',
  paddingLeft: '$16',
  paddingRight: '$16',
  '&:focus-within': {
    borderColor: '$primary500',
  },
  variants: {
    disabled: {
      true: {
        backgroundColor: '$neutrals300',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
      },
    },
    multiple: {
      true: {
        minHeight: '$48',
        height: 'auto',
        paddingTop: '$8',
      },
    },
  },
  '& input': {
    border: 'none',
    flexGrow: 1,
    backgroundColor: 'transparent',
    outline: 'none',
    marginBottom: '$8',
    color: '$foreground',
  },
});

const SelectedValues = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
});

const DropDownContainer = styled('div', {
  boxShadow:
    '0px 3px 5px -1px $neutrals200, 0px 6px 10px 0px $neutrals200, 0px 1px 18px 0px $neutrals200',
  padding: '$4 $8',
  // height: 'auto',
  height: '50vh',
  position: 'absolute',
  top: '102%',
  width: '100%',
  left: 0,
  boxSizing: 'border-box',
  borderRadius: '$10',
  overflowX: 'hidden',
});

const StyledCloseIcon = styled(Close, {
  marginLeft: '$8',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledAngleDown = styled(AngleDown, {
  cursor: 'pointer',
  variants: {
    open: {
      true: {
        transform: 'rotate(180deg)',
        transition: 'transform 200ms',
      },
    },
  },
});

const InputControlls = styled('div', {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '$16',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Line = styled('div', {
  borderBottom: '1px solid $foreground',
  width: '$20',
  transform: 'rotate(90deg)',
});

function ComboBox(props: PropTypes) {
  const {
    multiple,
    disabled,
    defaultValue,
    options,
    onChange,
    useVirualizedList,
    clearButton,
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
    setFilterdOptions(
      options.filter((option) => containsText(option.label, searchedText))
    );
  }, [searchedText]);

  useEffect(() => {
    setFilterdOptions(options.slice(0, PAGE_SIZE));
  }, [options.length]);

  const handleSelect = (value: string, label: string) => {
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
                style={{ marginBottom: '8px', marginRight: '8px' }}
                onClick={() => {
                  handleSelect(v.value, v.label);
                }}
                selected
                label={v.label}
                suffix={<StyledCloseIcon />}
              />
            ))
          : selectedValue[0]?.label}
        {open && (
          <input
            value={searchedText}
            onChange={(e) => setSearchedText(e.target.value)}
            spellCheck="false"
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
                selected={!!selectedValue.find((v) => v.value === option.value)}
              >
                {option.label}
              </ListItem>
            ))
          ) : (
            <VirtualizedList
              innerElementType={innerElementType}
              itemCount={filteredOptions.length}
              focus={1}
              size={48}
              Item={({ style, index }) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    ...style,
                    height: '56px',
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
                    selected={
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
      <InputControlls>
        {clearButton && (
          <>
            <CloseIcon onClick={setSelectedValue.bind(null, [])} />
            <Line />
          </>
        )}
        <StyledAngleDown open={open} />
      </InputControlls>
    </ComboBoxContainer>
  );
}

export default ComboBox;
