import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, Alert, Button, theme } from 'antd';
import {
  RobotOutlined,
  TeamOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { getAdminStats } from '../../api/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();
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

  if (loading) return <Spin />;
  if (err) return <Alert type="error" message={err} />;

  const entries =
    stats && typeof stats === 'object' ? Object.entries(stats) : [];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(99,102,241,0.0); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.25); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        `}
      </style>
      <BackButton />
      <Typography.Title level={3} style={{ letterSpacing: 0.4 }}>
        Admin Dashboard
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {entries.map(([key, value]) => {
          const lower = key.toLowerCase();
          const Icon = lower.includes('teacher')
            ? TeamOutlined
            : lower.includes('room')
            ? ApartmentOutlined
            : RobotOutlined;
          const bg = token.colorBgContainer;
          const border = `1px solid ${token.colorBorderSecondary}`;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={key}>
              <Card
                style={{
                  background: bg,
                  border,
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  animation: 'pulseGlow 3.5s ease-in-out infinite',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(0px)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 4,
                  }}
                >
                  <Icon
                    style={{
                      fontSize: 26,
                      color: 'rgba(99,102,241,0.85)',
                      animation: 'float 6s ease-in-out infinite',
                    }}
                  />
                  <Typography.Text
                    type="secondary"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {key}
                  </Typography.Text>
                </div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  {String(value)}
                </Typography.Title>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
