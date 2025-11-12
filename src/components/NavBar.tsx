import { Space, Tooltip, Button, Typography, theme } from 'antd';
import { useThemeMode } from '../theme/ThemeProvider';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

export default function NavBar() {
  const { mode, setMode } = useThemeMode();
  const { token } = theme.useToken();
  return (
    <Space align="center">
      <Tooltip title="Light">
        <Button
          type={mode === 'light' ? 'primary' : 'text'}
          icon={<SunOutlined />}
          onClick={() => setMode('light')}
        />
      </Tooltip>
      <Tooltip title="Dark">
        <Button
          type={mode === 'dark' ? 'primary' : 'text'}
          icon={<MoonOutlined />}
          onClick={() => setMode('dark')}
        />
      </Tooltip>
      <Typography.Text style={{ color: token.colorText, marginLeft: 8 }}>
        Theme
      </Typography.Text>
    </Space>
  );
}
