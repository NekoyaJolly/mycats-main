// Mantine 7 compatibility: Box component replacement
import React from 'react';

interface BoxProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  w?: number | string;
  h?: number | string;
  bg?: string;
  p?: number | string;
  m?: number | string;
  mb?: string | number;
  mt?: string | number;
  ml?: string | number;
  mr?: string | number;
  className?: string;
  onClick?: () => void;
}

export function Box({
  children,
  style = {},
  w,
  h,
  bg,
  p,
  m,
  mb,
  mt,
  ml,
  mr,
  className,
  onClick,
  ...props
}: BoxProps) {
  const boxStyle: React.CSSProperties = {
    ...style,
    width: w,
    height: h,
    backgroundColor: bg,
    padding: p,
    margin: m,
    marginBottom: mb,
    marginTop: mt,
    marginLeft: ml,
    marginRight: mr,
  };

  return (
    <div style={boxStyle} className={className} onClick={onClick} {...props}>
      {children}
    </div>
  );
}
