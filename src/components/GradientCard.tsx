import { Card, CardProps } from 'antd';
import { CSSProperties, ReactNode } from 'react';

interface GradientCardProps extends CardProps {
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warm' | 'cool';
  children: ReactNode;
  animate?: boolean;
}

const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
};

export default function GradientCard({
  gradient = 'primary',
  children,
  animate = true,
  style,
  ...rest
}: GradientCardProps) {
  const cardStyle: CSSProperties = {
    background: gradients[gradient],
    color: 'white',
    border: 'none',
    ...style,
  };

  const className = animate ? 'animate-scale-in' : '';

  return (
    <Card {...rest} style={cardStyle} className={className}>
      {children}
    </Card>
  );
}
