import { useState } from 'react';
import {
  Layout,
  Menu,
  Grid,
  Drawer,
  Button,
  theme,
  Typography,
  Space,
} from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function StudentLayout() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = (() => {
    if (location.pathname.startsWith('/student/records')) return 'records';
    return 'dashboard';
  })();

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={({ key }) => {
        if (key === 'logout') {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SET_AUTH_TOKEN',
              token: null,
            });
          }
          navigate('/login?role=Student', { replace: true });
          return;
        }
        navigate(`/student${key === 'dashboard' ? '' : `/${key}`}`);
        setDrawerOpen(false);
      }}
      items={[
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'records', icon: <FileTextOutlined />, label: 'Records' },
        { type: 'divider' as any },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgBase }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={260}
          collapsedWidth={80}
          style={{
            background: token.colorBgContainer,
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: `1px solid ${token.colorBorder}`,
              marginBottom: 16,
            }}
          >
            {!collapsed ? (
              <Space>
                <UserOutlined
                  style={{ fontSize: 24, color: token.colorPrimary }}
                />
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Student Portal
                </Typography.Title>
              </Space>
            ) : (
              <UserOutlined
                style={{ fontSize: 28, color: token.colorPrimary }}
              />
            )}
          </div>
          {menu}
        </Sider>
      )}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
          transition: 'margin 0.2s',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: token.colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 999,
            boxShadow: token.boxShadow,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isMobile && (
              <Button
                type="text"
                size="large"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            )}
            {!isMobile && (
              <Typography.Text strong style={{ fontSize: 18 }}>
                AI Attendance System{' '}
                <span style={{ color: token.colorPrimary, fontWeight: 700 }}>
                  | Student Dashboard
                </span>
              </Typography.Text>
            )}
          </div>
          {isMobile && (
            <Drawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              placement="left"
              bodyStyle={{ padding: 0 }}
              width={280}
            >
              <div
                style={{
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: `1px solid ${token.colorBorder}`,
                  marginBottom: 16,
                  background: 'var(--gradient-accent)',
                }}
              >
                <Space>
                  <UserOutlined style={{ fontSize: 24, color: 'white' }} />
                  <Typography.Title
                    level={4}
                    style={{ margin: 0, color: 'white' }}
                  >
                    AI Attendance System{' '}
                    <span style={{ fontWeight: 700 }}>| Student Dashboard</span>
                  </Typography.Title>
                </Space>
              </div>
              {menu}
            </Drawer>
          )}
        </Header>
        <Content
          style={{
            margin: '24px',
            minHeight: 'calc(100vh - 112px)',
          }}
          className="animate-fade-in"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
