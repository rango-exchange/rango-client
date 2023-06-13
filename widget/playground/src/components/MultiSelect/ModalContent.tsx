import React from 'react';
import {
  Button,
  FilledCircle,
  NotFoundAlert,
  SecondaryPage,
  styled,
  Typography,
} from '@rango-dev/ui';
import { WalletType } from '@rango-dev/wallets-shared';
import { Source, Wallets } from '../../types';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  maxHeight: 480,
  overflow: 'auto',
});

const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

type PropTypes =
  | {
      type: 'Wallets';
      selectedList?: WalletType[];
      list: Wallets;
      onChange: (wallet: {
        title: string;
        logo: string;
        type: WalletType;
      }) => void;
    }
  | {
      type: 'Sources';
      selectedList?: string[];
      list: LiquiditySource[];
      onChange: (sources: Source) => void;
    };

const filterList = (list: Wallets | LiquiditySource[], searchedFor: string) =>
  list.filter((item: { title: string }) =>
    item.title.toLowerCase().includes(searchedFor.toLowerCase())
  );

const getIndex = (list: string[], v: string, type: 'Wallets' | 'Sources') => {
  switch (type) {
    case 'Wallets':
      return list.findIndex((item) => item === v);
    case 'Sources':
      return list.findIndex((item) => item === v);
  }
};

export default function ModalContent({
  type,
  list,
  selectedList,
  onChange,
}: PropTypes) {
  const isSelect = (name: string) => {
    return !selectedList || getIndex(selectedList, name, type) > -1;
  };

  return (
    <SecondaryPage
      textField={true}
      hasHeader={false}
      textFieldPlaceholder={`Search ${type} By Name`}>
      {(searchedFor) => {
        const filteredList = filterList(list, searchedFor);
        return (
          <>
            {!!filteredList.length && (
              <ListContainer>
                {filteredList.map((item, index) => (
                  <Button
                    type={
                      isSelect(type === 'Wallets' ? item.type : item.title)
                        ? 'primary'
                        : undefined
                    }
                    variant="outlined"
                    size="large"
                    prefix={<Image src={item.logo} />}
                    suffix={
                      isSelect(type === 'Wallets' ? item.type : item.title) ? (
                        <FilledCircle />
                      ) : undefined
                    }
                    align="start"
                    onClick={onChange.bind(null, item)}
                    key={index}>
                    <Typography variant="body2">{item.title}</Typography>
                  </Button>
                ))}
              </ListContainer>
            )}
            {!filteredList.length && (
              <NotFoundAlert
                catergory={
                  type.endsWith('s') ? type.substring(0, type.length - 1) : type
                }
                searchedFor={searchedFor}
              />
            )}
          </>
        );
      }}
    </SecondaryPage>
  );
}
