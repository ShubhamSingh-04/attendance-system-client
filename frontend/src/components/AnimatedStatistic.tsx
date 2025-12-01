import { Statistic, Card } from 'antd';
import { CSSProperties, ReactNode } from 'react';

interface AnimatedStatisticProps {
  title: string | ReactNode;
  value: string | number;
  suffix?: string;
  prefix?: ReactNode;
  gradient?: string;
  icon?: ReactNode;
  delay?: number;
}

export default function AnimatedStatistic({
  title,
  value,
  suffix,
  prefix,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  icon,
  delay = 0,
}: AnimatedStatisticProps) {
  const cardStyle: CSSProperties = {
    background: gradient,
    color: 'white',
    border: 'none',
    animationDelay: `${delay}ms`,
  };

  return (
    <Card style={cardStyle} className="animate-scale-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && (
          <div style={{ fontSize: 32, opacity: 0.9 }} className="animate-float">
            {icon}
          </div>
        )}
        <Statistic
          title={
            typeof title === 'string' ? (
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                {title}
              </span>
            ) : (
              title
            )
          }
          value={value}
          suffix={suffix}
          prefix={prefix}
          valueStyle={{ color: 'white', fontWeight: 700 }}
        />
      </div>
    </Card>
  );
}
