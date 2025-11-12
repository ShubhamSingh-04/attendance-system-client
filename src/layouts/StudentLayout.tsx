import { useState } from 'react';
import { Layout, Menu, Grid, Drawer, Button, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
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
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          style={{ background: token.colorBgContainer }}
        >
          {menu}
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: token.colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: 'var(--box-shadow, 0 1px 4px rgba(0,0,0,0.06))',
          }}
        >
          {isMobile && (
            <>
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: token.colorText }} />}
                onClick={() => setDrawerOpen(true)}
              />
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                placement="left"
                bodyStyle={{ padding: 0 }}
              >
                {menu}
              </Drawer>
            </>
          )}
        </Header>
        <Content style={{ margin: '12px 16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
