import {
  AngleDownIcon,
  Button,
  CheckIcon,
  Modal,
  SecondaryPage,
  styled,
  Typography,
} from '@rango-dev/ui';
import React, { useState } from 'react';

interface PropTypes {
  onChange: (name: string, value: string) => void;
  label: string;
  value: string;
  modalTitle: string;
  name: string;
  list: Array<{
    name: string;
    logo?: string;
  }>;
}
const filterList = (list, searchedFor: string) =>
  list.filter((item) => item.nam.toLowerCase().includes(searchedFor.toLowerCase()));
const Image = styled('img', {
  width: '24px',
  height: '24px',
  marginRight: '$4',
  borderRadius: '12px',
});

export function Select({ label, value, onChange, modalTitle, list, name }: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  const search = list.find((item) => item.name === value);

  return (
    <div>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>

      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        prefix={search?.logo && <Image src={search.logo} />}
        suffix={<AngleDownIcon />}
        fullWidth
        align="start"
        size="large">
        {value}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen((prev) => !prev)}
        content={
          <SecondaryPage
            textField={true}
            hasHeader={false}
            textFieldPlaceholder={`Search ${modalTitle} By Name`}
            Content={({ searchedFor }) =>
              filterList(list, searchedFor).map((item, index) => (
                <>
                  <Button
                    variant="ghost"
                    size="large"
                    prefix={item.logo && <Image src={item.logo} />}
                    suffix={item.name === value ? <CheckIcon size={20} /> : undefined}
                    align="start"
                    onClick={() => onChange(name, item.name)}
                    key={index}>
                    <Typography variant="body2">{item.name}</Typography>
                  </Button>
                  <hr />
                </>
              ))
            }
          />
        }
        title={modalTitle}
        containerStyle={{ width: '560px', height: '655px' }}></Modal>
    </div>
  );
}
