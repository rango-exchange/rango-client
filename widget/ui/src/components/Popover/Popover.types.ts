import type { CSS } from '../../theme';
import type { ReactNode } from 'react';

export type Ref =
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

type Side = 'top' | 'right' | 'bottom' | 'left';

export interface ContentType {
  side?: Side;
  sideOffset?: number;
  alignOffset?: number;
  align?: 'center' | 'start' | 'end';
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<Side, number>>;
  container?: HTMLElement;
  styles?: {
    arrowStyles?: CSS;
  };
}

export type PropTypes = ContentType & {
  content: ReactNode;
};
