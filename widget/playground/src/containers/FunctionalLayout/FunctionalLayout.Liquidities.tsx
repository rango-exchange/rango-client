import type { LiquidityType } from './FunctionalLayout.types';

import { ChainsIcon, Checkbox, Divider, Typography } from '@rango-dev/ui';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { removeDuplicates } from '../../utils/common';

import { filterByType, getLiquidityValue } from './FunctionalLayout.helpers';
import { IncludeSourceText } from './FunctionalLayout.styles';

export function LiquiditiesSection() {
  const {
    onChangeSources,
    onChangeBooleansConfig,
    config: { liquiditySources, includeNewLiquiditySources },
  } = useConfigStore();

  const {
    meta: { swappers },
  } = useMetaStore();

  const excludedMode = includeNewLiquiditySources ?? true;
  const uniqueSwappersGroup = removeDuplicates(swappers, 'swapperGroup');

  const defaultSelectedItems = (type: LiquidityType) =>
    liquiditySources?.filter((l) =>
      uniqueSwappersGroup.find(
        (swapper) => swapper.swapperGroup === l && filterByType(type, swapper)
      )
    );

  const liquiditiesList = (type: LiquidityType) =>
    uniqueSwappersGroup
      .filter((swapper) => filterByType(type, swapper))
      .map(({ title, logo, swapperGroup }) => ({
        logo,
        title,
        name: swapperGroup,
      }));

  const selectedDexs = defaultSelectedItems('DEX');
  const selectedBridges = defaultSelectedItems('BRIDGE');
  const allDexs = liquiditiesList('DEX');
  const allBridges = liquiditiesList('BRIDGE');
  const allDexsNames = allDexs.map((dex) => dex.name);
  const allBridgeNames = allBridges.map((bridge) => bridge.name);
  const isAllSelected = !liquiditySources;

  const isJustAllBridgeSelected =
    !isAllSelected && selectedBridges?.length === allBridges.length;
  const isJustAllDexSelected =
    !isAllSelected && selectedDexs?.length === allDexs.length;

  const handleChange = (
    categories: string[],
    otherCategoryList: string[],
    currentSelection?: string[],
    previousSelection?: string[]
  ) => {
    const currentConfig = removeDuplicates([
      ...(liquiditySources || (excludedMode ? [] : otherCategoryList)),
      ...categories,
    ]);

    let sources;
    if (currentSelection) {
      sources = removeDuplicates([
        ...(previousSelection || (excludedMode ? [] : otherCategoryList)),
        ...currentSelection,
      ]);
    } else if (currentConfig.length === uniqueSwappersGroup.length) {
      sources = excludedMode
        ? removeDuplicates([...categories, ...currentConfig])
        : undefined;
    } else {
      sources = currentConfig;
    }

    onChangeSources(sources);
  };

  const handleCheckChange = (checked: boolean) => {
    onChangeBooleansConfig('includeNewLiquiditySources', checked);
    onChangeSources(undefined);
  };

  return (
    <>
      <MultiSelect
        label={`${excludedMode ? 'Excluded' : 'Supported'} DEXs`}
        icon={<ChainsIcon size={24} />}
        type="DEXs"
        value={getLiquidityValue(
          isAllSelected,
          excludedMode,
          isJustAllDexSelected,
          selectedDexs
        )}
        defaultSelectedItems={
          selectedDexs || (excludedMode ? [] : allDexsNames)
        }
        list={allDexs}
        onChange={(items) =>
          handleChange(allDexsNames, allBridgeNames, items, selectedBridges)
        }
      />
      <Divider size={12} />
      <MultiSelect
        label={`${excludedMode ? 'Excluded' : 'Supported'} Bridges`}
        icon={<ChainsIcon size={24} />}
        type="Bridges"
        value={getLiquidityValue(
          isAllSelected,
          excludedMode,
          isJustAllBridgeSelected,
          selectedBridges
        )}
        defaultSelectedItems={
          selectedBridges || (excludedMode ? [] : allBridgeNames)
        }
        list={allBridges}
        onChange={(items) =>
          handleChange(allBridgeNames, allDexsNames, items, selectedDexs)
        }
      />
      <Divider size={24} />
      <Checkbox
        id="new-source"
        onCheckedChange={handleCheckChange}
        checked={excludedMode}
        label={
          <Typography size="medium" variant="body">
            Include New Sources
          </Typography>
        }
      />
      <Divider size={4} />
      <IncludeSourceText>
        <Typography size="small" variant="body" color="neutral900">
          If we add a new liquidity source, it will be added to your list as
          well.
        </Typography>
      </IncludeSourceText>
    </>
  );
}
