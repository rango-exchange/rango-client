/*
 * The calculateGroupsSoFar Slices the total groups into the groups which contain the items so far.
 * For example, if you have [10, 10, 10, 10] groups in total,
 * slicing them to 23 will result in [10, 10, 3] :
 * https://virtuoso.dev/grouped-with-load-on-demand/
 */
export function calculateGroupsSoFar(totalGroups: number[], count: number) {
  const groups: number[] = [];
  let index = 0;
  do {
    const group = totalGroups[index];
    groups.push(Math.min(group, count));
    count -= group;
    index++;
  } while (count > 0 && index <= totalGroups.length);
  return groups;
}
