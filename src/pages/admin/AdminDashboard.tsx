import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, Alert, Grid, theme } from 'antd';
import {
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { getAdminStats } from '../../api/admin';
import PageHeader from '../../components/PageHeader';
import AnimatedStatistic from '../../components/AnimatedStatistic';

const { useBreakpoint } = Grid;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || 'Failed to load stats'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (err) {
    return (
      <Alert
        type="error"
        message={err}
        style={{ borderRadius: 16 }}
        className="animate-fade-in"
      />
    );
  }

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];

  const icons = [
    <TeamOutlined />,
    <UserOutlined />,
    <ApartmentOutlined />,
    <RocketOutlined />,
  ];

  const entries =
    stats && typeof stats === 'object' ? Object.entries(stats) : [];

  return (
    <div>
      <BackButton />

      {entries.length === 0 ? (
        <Alert
          type="info"
          message="No statistics available"
          style={{ borderRadius: 16 }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {entries.map(([key, value], index) => {
            const Icon = icons[index % icons.length];
            const gradient = gradients[index % gradients.length];

            return (
              <Col xs={24} sm={12} lg={6} key={key}>
                <AnimatedStatistic
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={String(value)}
                  gradient={gradient}
                  icon={Icon}
                  delay={index * 100}
                />
              </Col>
            );
          })}
        </Row>
      )}

      <div style={{ marginTop: 48 }}>
        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          Quick Actions
        </Typography.Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/stream')}
              style={{
                background: 'var(--gradient-primary)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <ApartmentOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Room Stream
              </Typography.Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/teachers')}
              style={{
                background: 'var(--gradient-secondary)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <TeamOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Teachers
              </Typography.Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/students')}
              style={{
                background: 'var(--gradient-accent)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <UserOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Students
              </Typography.Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/subjects')}
              style={{
                background: 'var(--gradient-success)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <RocketOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Subjects
              </Typography.Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/rooms')}
              style={{
                background: 'var(--gradient-warm)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <ApartmentOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Rooms
              </Typography.Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/admin/classes')}
              style={{
                background: 'var(--gradient-cool)',
                color: 'white',
                border: 'none',
                textAlign: 'center',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              className="animate-scale-in card-gradient"
            >
              <TeamOutlined style={{ fontSize: 40, marginBottom: 16 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                Classes
              </Typography.Title>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
