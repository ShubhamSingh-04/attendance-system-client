import { Link } from 'react-router-dom';
import { Button, Card, Space, Typography } from 'antd';
import {
  RobotOutlined,
  CloudOutlined,
  ClusterOutlined,
  CrownOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';

export default function Landing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background:
          'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent), radial-gradient(900px 500px at 90% 20%, rgba(139,92,246,0.16), transparent), radial-gradient(800px 500px at 30% 90%, rgba(20,184,166,0.14), transparent)',
      }}
    >
      {/* Floating AI-themed icons */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '10%',
            animation: 'float 8s ease-in-out infinite',
          }}
        >
          <RobotOutlined
            style={{ fontSize: 56, color: 'rgba(99,102,241,0.65)' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '28%',
            right: '12%',
            animation: 'float 9s ease-in-out -2s infinite',
          }}
        >
          <CloudOutlined
            style={{ fontSize: 52, color: 'rgba(139,92,246,0.6)' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '14%',
            left: '18%',
            animation: 'float 10s ease-in-out -4s infinite',
          }}
        >
          <ClusterOutlined
            style={{ fontSize: 60, color: 'rgba(20,184,166,0.6)' }}
          />
        </div>
      </div>

      {/* Keyframes for simple float */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-16px); }
        }
        .glow {
          text-shadow: 0 2px 16px rgba(99,102,241,0.55);
        }
        `}
      </style>

      <Card
        style={{
          maxWidth: 720,
          width: '100%',
          textAlign: 'center',
          backdropFilter: 'blur(6px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: '0 12px 45px rgba(0,0,0,0.08)',
        }}
      >
        <Typography.Title
          level={2}
          className="glow"
          style={{ marginBottom: 8, letterSpacing: 0.4 }}
        >
          AI Attendance System
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          style={{ marginBottom: 24, fontSize: 16 }}
        >
          Face-powered attendance with modern analytics and real-time monitoring
        </Typography.Paragraph>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Link to="/login?role=Admin">
            <Button
              type="primary"
              block
              style={{ height: 44 }}
              icon={<CrownOutlined />}
            >
              Enter Admin Portal
            </Button>
          </Link>
          <Link to="/login?role=Teacher">
            <Button block style={{ height: 44 }} icon={<SolutionOutlined />}>
              Enter Teacher Portal
            </Button>
          </Link>
          <Link to="/login?role=Student">
            <Button block style={{ height: 44 }} icon={<UserOutlined />}>
              Enter Student Portal
            </Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
}
