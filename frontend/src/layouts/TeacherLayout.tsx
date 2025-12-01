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
  MenuOutlined,
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  BookOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getTeacherProfile } from '../api/teacher';

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
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    getTeacherProfile()
      .then(setTeacher)
      .catch((err) => console.error(err));
  }, []);

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
                <SolutionOutlined
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
                  Teacher Portal
                </Typography.Title>
              </Space>
            ) : (
              <SolutionOutlined
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
            height: 64,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flex: 1,
              minWidth: 0,
            }}
          >
            {isMobile && (
              <Button
                type="text"
                size="large"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            )}
            {!isMobile && (
              <Typography.Text
                strong
                style={{ fontSize: 18, whiteSpace: 'nowrap' }}
              >
                AI Attendance System{' '}
                <span style={{ color: token.colorPrimary, fontWeight: 700 }}>
                  | Teacher Dashboard
                </span>
              </Typography.Text>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'flex-end',
            }}
          >
            <div style={{ textAlign: 'right', minWidth: 0 }}>
              <Typography.Text
                strong
                style={{
                  fontSize: 13,
                  display: 'block',
                  color: token.colorTextHeading,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {teacher?.profile?.name || 'Teacher'}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: 11,
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                ID: {teacher?.profile?.teacherID || '—'}
              </Typography.Text>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorSuccess})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {(teacher?.profile?.name?.[0] || 'T').toUpperCase()}
            </div>
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
                  background: 'var(--gradient-secondary)',
                }}
              >
                <Space>
                  <SolutionOutlined style={{ fontSize: 24, color: 'white' }} />
                  <Typography.Title
                    level={4}
                    style={{ margin: 0, color: 'white' }}
                  >
                    AI Attendance System{' '}
                    <span style={{ fontWeight: 700 }}>| Teacher Dashboard</span>
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
