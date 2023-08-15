export interface SvgIconProps {
  size?: number;
  color:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'info'
    | 'progressing'
    | 'disable'
    | 'active';
}
export type SvgIconPropsWithChildren = SvgIconProps & {
  children?: React.ReactElement;
};
