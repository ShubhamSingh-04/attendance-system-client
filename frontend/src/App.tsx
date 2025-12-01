import { Layout, Typography, theme } from 'antd';
import AppRouter from './router/AppRouter';
import NavBar from './components/NavBar';

export default function App() {
  const { token } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: token.colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          boxShadow: 'var(--box-shadow, 0 1px 4px rgba(0,0,0,0.06))',
        }}
      >
        <Typography.Text
          style={{
            color: token.colorText,
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: '0.5px',
            fontFamily: 'inherit',
          }}
        >
          AttendEase
        </Typography.Text>
        <NavBar />
      </Layout.Header>
      <Layout.Content style={{ padding: 16 }}>
        <AppRouter />
      </Layout.Content>
    </Layout>
  );
}
