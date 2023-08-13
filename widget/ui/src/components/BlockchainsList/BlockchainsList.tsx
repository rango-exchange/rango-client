import type { PropTypes } from './BlockchainsList.types';

import React from 'react';

import { Row } from '../Row';

export function BlockchainsList(props: PropTypes) {
  const { list, onChange } = props;
  // const [selected, setSelected] = useState(props.selected);

  /*
   * const isSelect = (name: string) => {
   *   if (multiSelect && selectedList) {
   *     return (
   *       selectedList === 'all' ||
   *       selectedList.findIndex((item) => name === item.name) > -1
   *     );
   *   }
   *   return name === selected?.name;
   * };
   */

  return (
    <div>
      {list.map((blockchain) => {
        return (
          <Row
            key={blockchain.chainId}
            image={blockchain.logo}
            title={blockchain.name}
            onClick={onChange.bind(null, blockchain)}
          />
        );
      })}
    </div>
  );
}
