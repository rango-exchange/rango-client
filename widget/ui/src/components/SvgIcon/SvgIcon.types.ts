export interface SvgIconProps {
  size?: number;
  color: string;
}
export type SvgIconPropsWithChildren = SvgIconProps & {
  children: React.ReactElement;
};
