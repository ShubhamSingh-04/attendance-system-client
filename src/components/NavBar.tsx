import { useState, useEffect } from 'react';
import { Space, Tooltip, Grid, Segmented, theme } from 'antd';
import { useThemeMode } from '../theme/ThemeProvider';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

export default function NavBar() {
  const { mode, setMode } = useThemeMode();
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const showLabels = screens.md;
  
  return (
    <Space align="center" size="middle">
      <Segmented
        value={mode}
        onChange={(value) => setMode(value as 'light' | 'dark')}
        options={[
          {
            label: (
              <Tooltip title="Light Mode">
                <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SunOutlined style={{ fontSize: 16 }} />
                  {showLabels && <span>Light</span>}
                </div>
              </Tooltip>
            ),
            value: 'light',
          },
          {
            label: (
              <Tooltip title="Dark Mode">
                <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MoonOutlined style={{ fontSize: 16 }} />
                  {showLabels && <span>Dark</span>}
                </div>
              </Tooltip>
            ),
            value: 'dark',
          },
        ]}
        style={{
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorder}`,
          padding: 2,
        }}
      />
    </Space>
  );
}
