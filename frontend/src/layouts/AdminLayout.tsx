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
  VideoCameraOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BookOutlined,
  ApartmentOutlined,
  LogoutOutlined,
  MenuOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function AdminLayout() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = (() => {
    if (location.pathname.startsWith('/admin/stream')) return 'stream';
    if (location.pathname.startsWith('/admin/teachers')) return 'teachers';
    if (location.pathname.startsWith('/admin/rooms')) return 'rooms';
    if (location.pathname.startsWith('/admin/subjects')) return 'subjects';
    if (location.pathname.startsWith('/admin/classes')) return 'classes';
    if (location.pathname.startsWith('/admin/students')) return 'students';
    return 'dashboard';
  })();

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={({ key }) => {
        if (key === 'logout') {
          localStorage.removeItem('token');
          if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SET_AUTH_TOKEN',
              token: null,
            });
          }
          navigate('/login?role=Admin', { replace: true });
          return;
        }
        navigate(`/admin${key === 'dashboard' ? '' : `/${key}`}`);
        setDrawerOpen(false);
      }}
      items={[
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'stream', icon: <VideoCameraOutlined />, label: 'Stream' },
        { key: 'teachers', icon: <TeamOutlined />, label: 'Teachers' },
        { key: 'subjects', icon: <BookOutlined />, label: 'Subjects' },
        { key: 'rooms', icon: <ApartmentOutlined />, label: 'Rooms' },
        { key: 'classes', icon: <AppstoreOutlined />, label: 'Classes' },
        { key: 'students', icon: <TeamOutlined />, label: 'Students' },
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
                <CrownOutlined
                  style={{ fontSize: 24, color: token.colorPrimary }}
                />
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Admin Panel
                </Typography.Title>
              </Space>
            ) : (
              <CrownOutlined
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
                  | Admin Dashboard
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
                  background: 'var(--gradient-primary)',
                }}
              >
                <Space>
                  <CrownOutlined style={{ fontSize: 24, color: 'white' }} />
                  <Typography.Title
                    level={4}
                    style={{ margin: 0, color: 'white' }}
                  >
                    AI Attendance System{' '}
                    <span style={{ fontWeight: 700 }}>| Admin Dashboard</span>
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
