import { CSSProperties, ReactNode } from 'react';

interface FloatingIconProps {
  children: ReactNode;
  color?: string;
  size?: number;
  delay?: number;
  duration?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export default function FloatingIcon({
  children,
  color = 'rgba(99, 102, 241, 0.6)',
  size = 56,
  delay = 0,
  duration = 6,
  top,
  left,
  right,
  bottom,
}: FloatingIconProps) {
  const style: CSSProperties = {
    position: 'absolute',
    fontSize: size,
    color,
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    top,
    left,
    right,
    bottom,
  };

  return <div style={style}>{children}</div>;
}
