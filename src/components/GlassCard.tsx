import { Card, CardProps } from 'antd';
import { CSSProperties, ReactNode } from 'react';

interface GlassCardProps extends CardProps {
  children: ReactNode;
  blur?: number;
}

export default function GlassCard({
  children,
  blur = 12,
  style,
  ...rest
}: GlassCardProps) {
  const cardStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    ...style,
  };

  return (
    <Card {...rest} style={cardStyle} className="glass">
      {children}
    </Card>
  );
}
