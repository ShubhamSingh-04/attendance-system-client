import { Typography, Space } from 'antd';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  extra?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon, extra }: PageHeaderProps) {
  return (
    <div
      style={{
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
      className="animate-fade-in-up"
    >
      <Space align="center" size="middle">
        {icon && (
          <div
            style={{ fontSize: 40, color: 'var(--primary)' }}
            className="animate-float"
          >
            {icon}
          </div>
        )}
        <div>
          <Typography.Title
            level={2}
            style={{
              margin: 0,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            className="text-gradient"
          >
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  );
}
