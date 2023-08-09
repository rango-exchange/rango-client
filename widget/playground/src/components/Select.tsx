import {
  AngleDownIcon,
  Button,
  CheckIcon,
  Modal,
  SecondaryPage,
  styled,
  Typography,
} from '@rango-dev/ui';
import React, { Fragment, useState } from 'react';

interface PropTypes {
  onChange: (name: string, value: string) => void;
  label: string;
  value: string;
  modalTitle: string;
  name: string;
  list: Array<{
    name: string;
    logo?: string;
    value: string;
  }>;
}
const filterList = (list, searchedFor: string) =>
  list.filter((item) =>
    item.name.toLowerCase().includes(searchedFor.toLowerCase())
  );
const Image = styled('img', {
  width: '24px',
  height: '24px',
  marginRight: '$4',
  borderRadius: '12px',
});

const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  marginBottom: '$4',
  color: '$foreground',
});

export function Select({
  label,
  value,
  onChange,
  modalTitle,
  list,
  name,
}: PropTypes) {
  const [open, setOpen] = useState<boolean>(false);
  const search = list.find((item) => item.value === value);
  return (
    <div>
      <Label>{label}</Label>

      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        prefix={search?.logo && <Image src={search.logo} />}
        suffix={<AngleDownIcon />}
        fullWidth
        align="start"
        size="large">
        {search?.name || value}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen((prev) => !prev)}
        content={
          <SecondaryPage
            textField={true}
            hasHeader={false}
            textFieldPlaceholder={`Search ${modalTitle} By Name`}>
            {(searchedFor) =>
              filterList(list, searchedFor).map((item, index) => (
                <Fragment key={index}>
                  <Button
                    variant="ghost"
                    size="large"
                    prefix={item.logo && <Image src={item.logo} />}
                    suffix={
                      item.value === value ? <CheckIcon size={20} /> : undefined
                    }
                    align="start"
                    onClick={() => {
                      setOpen(false);
                      onChange(name, item.value);
                    }}>
                    <Typography variant="body" size="small">
                      {item.name}
                    </Typography>
                  </Button>
                  <hr />
                </Fragment>
              ))
            }
          </SecondaryPage>
        }
        title={modalTitle}
        containerStyle={{ width: '560px', height: '655px' }}
      />
    </div>
  );
}
