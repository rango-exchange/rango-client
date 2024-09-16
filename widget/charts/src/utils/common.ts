export const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getDayOfMonth(dateString: string) {
  const date = new Date(dateString);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNumber = date.getDate();

  return `${dayNumber} ${monthName}`;
}
