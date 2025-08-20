declare module '@mantine/core' {
  import { FC, ReactNode } from 'react';

  // Card component fix
  export interface CardProps {
    children?: ReactNode;
    p?: string;
    style?: React.CSSProperties;
    component?: string;
    [key: string]: any;
  }

  export const Card: FC<CardProps>;

  // Text component fix
  export interface TextProps {
    children?: ReactNode;
    c?: string;
    ta?: string;
    mt?: string;
    fw?: number | string;
    size?: string;
    lineClamp?: number;
    mb?: string;
    [key: string]: any;
  }

  export const Text: FC<TextProps>;

  // Badge component fix
  export interface BadgeProps {
    children?: ReactNode;
    size?: string;
    color?: string;
    variant?: string;
    [key: string]: any;
  }

  export const Badge: FC<BadgeProps>;

  // Stack component fix
  export interface StackProps {
    children?: ReactNode;
    gap?: string;
    [key: string]: any;
  }

  export const Stack: FC<StackProps>;

  // Group component fix
  export interface GroupProps {
    children?: ReactNode;
    justify?: string;
    align?: string;
    [key: string]: any;
  }

  export const Group: FC<GroupProps>;

  // Grid component fix
  export interface GridProps {
    children?: ReactNode;
    gutter?: string;
    mb?: string;
    [key: string]: any;
  }

  export const Grid: FC<GridProps> & {
    Col: FC<{ children?: ReactNode; span?: number; [key: string]: any }>;
  };

  // Keep other existing exports
  export * from '@mantine/core/lib';
}
