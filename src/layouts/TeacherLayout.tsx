import { useState } from 'react';
import { Layout, Menu, Grid, Drawer, Button, theme } from 'antd';
import {
  MenuOutlined,
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BookOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function TeacherLayout() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = (() => {
    if (location.pathname.startsWith('/teacher/my-classes'))
      return 'my-classes';
    if (location.pathname.startsWith('/teacher/my-subjects'))
      return 'my-subjects';
    if (location.pathname.startsWith('/teacher/mark-attendance')) return 'mark';
    if (location.pathname.startsWith('/teacher/records')) return 'records';
    if (location.pathname.startsWith('/teacher/summary')) return 'summary';
    return 'dashboard';
  })();

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={({ key }) => {
        if (key === 'logout') {
          localStorage.removeItem('token');
          navigate('/login?role=Teacher', { replace: true });
          return;
        }
        const pathMap: Record<string, string> = {
          dashboard: '/teacher',
          'my-classes': '/teacher/my-classes',
          'my-subjects': '/teacher/my-subjects',
          mark: '/teacher/mark-attendance',
          records: '/teacher/records',
          summary: '/teacher/summary',
        };
        navigate(pathMap[key as string] || '/teacher');
        setDrawerOpen(false);
      }}
      items={[
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'my-classes', icon: <TeamOutlined />, label: 'My Classes' },
        { key: 'my-subjects', icon: <BookOutlined />, label: 'My Subjects' },
        {
          key: 'mark',
          icon: <VideoCameraOutlined />,
          label: 'Mark Attendance',
        },
        { key: 'records', icon: <AppstoreOutlined />, label: 'Records' },
        { key: 'summary', icon: <AppstoreOutlined />, label: 'Summary' },
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
