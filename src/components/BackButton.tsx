import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function BackButton({
  children = 'Back',
  onClick,
  style,
}: BackButtonProps) {
  const navigate = useNavigate();
  const handle = () => {
    if (onClick) return onClick();
    navigate(-1);
  };

  return (
    <Button
      icon={<LeftOutlined />}
      onClick={handle}
      style={{ marginBottom: 8, ...style }}
    >
      {children}
    </Button>
  );
}
