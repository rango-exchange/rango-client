import type { MapSupportedList } from '../MultiSelect/MultiSelect.types';

// Determines if all items in the category list are selected.
export const selectDeselectHandler = (
  selectedItems: string[],
  categoryList: MapSupportedList[]
): boolean =>
  categoryList.every((category) => selectedItems.includes(category.name));
