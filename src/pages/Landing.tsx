import { Link } from 'react-router-dom';
import { Button, Card, Space, Typography } from 'antd';
import {
  RobotOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  SolutionOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import FloatingIcon from '../components/FloatingIcon';

export default function Landing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at top, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(139,92,246,0.1) 0%, transparent 50%), var(--bg)',
      }}
    >
      <FloatingIcon
        color="rgba(99,102,241,0.4)"
        size={64}
        delay={0}
        top="10%"
        left="8%"
      >
        <RobotOutlined />
      </FloatingIcon>
      <FloatingIcon
        color="rgba(139,92,246,0.4)"
        size={56}
        delay={2}
        top="20%"
        right="10%"
      >
        <CloudOutlined />
      </FloatingIcon>
      <FloatingIcon
        color="rgba(20,184,166,0.4)"
        size={60}
        delay={4}
        bottom="15%"
        left="12%"
      >
        <ThunderboltOutlined />
      </FloatingIcon>
      <FloatingIcon
        color="rgba(245,158,11,0.4)"
        size={52}
        delay={1.5}
        top="60%"
        right="15%"
      >
        <SafetyOutlined />
      </FloatingIcon>
      <FloatingIcon
        color="rgba(236,72,153,0.4)"
        size={48}
        delay={3.5}
        bottom="25%"
        right="8%"
      >
        <RocketOutlined />
      </FloatingIcon>

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '80px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 80,
          }}
          className="animate-fade-in-up"
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'var(--gradient-primary)',
              borderRadius: 999,
              marginBottom: 24,
              color: 'white',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '0.5px',
            }}
            className="animate-pulse"
          >
            ✨ AI-Powered Attendance System
          </div>

          <Typography.Title
            level={1}
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              margin: '0 0 24px 0',
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              letterSpacing: '-1px',
            }}
          >
            Modern Attendance
            <br />
            Management System
          </Typography.Title>

          <Typography.Paragraph
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: 680,
              margin: '0 auto 40px',
              lineHeight: 1.8,
            }}
          >
            Experience the future of attendance tracking with AI-powered face
            recognition, real-time analytics, and seamless monitoring
          </Typography.Paragraph>

          <Space size="large" wrap style={{ justifyContent: 'center' }}>
            <Link to="/login?role=Admin">
              <Button
                type="primary"
                size="large"
                icon={<CrownOutlined />}
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 16,
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                }}
                className="landing-btn animate-scale-in"
              >
                Admin Portal
              </Button>
            </Link>
            <Link to="/login?role=Teacher">
              <Button
                size="large"
                icon={<SolutionOutlined />}
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 16,
                  background: 'var(--gradient-secondary)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(240, 147, 251, 0.4)',
                }}
                className="landing-btn animate-scale-in"
              >
                Teacher Portal
              </Button>
            </Link>
            <Link to="/login?role=Student">
              <Button
                size="large"
                icon={<UserOutlined />}
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 16,
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
                }}
                className="landing-btn animate-scale-in"
              >
                Student Portal
              </Button>
            </Link>
          </Space>
        </div>

        <div style={{ marginTop: 120 }}>
          <Typography.Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: 60,
              fontSize: 'clamp(28px, 4vw, 42px)',
            }}
            className="animate-fade-in"
          >
            Why Choose Our System?
          </Typography.Title>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginBottom: 40,
            }}
          >
            <Card
              style={{
                background: 'var(--gradient-primary)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                padding: 24,
              }}
              className="feature-card animate-fade-in-up card-gradient"
            >
              <CheckCircleOutlined
                style={{ fontSize: 48, marginBottom: 16 }}
                className="feature-icon"
              />
              <Typography.Title
                level={4}
                style={{ color: 'white', margin: '0 0 12px 0' }}
              >
                AI-Powered Recognition
              </Typography.Title>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Advanced facial recognition technology for accurate attendance
                tracking
              </Typography.Text>
            </Card>

            <Card
              style={{
                background: 'var(--gradient-secondary)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                padding: 24,
              }}
              className="feature-card animate-fade-in-up card-gradient"
            >
              <RocketOutlined
                style={{ fontSize: 48, marginBottom: 16 }}
                className="feature-icon"
              />
              <Typography.Title
                level={4}
                style={{ color: 'white', margin: '0 0 12px 0' }}
              >
                Real-Time Analytics
              </Typography.Title>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Get instant insights and analytics on attendance patterns
              </Typography.Text>
            </Card>

            <Card
              style={{
                background: 'var(--gradient-accent)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                padding: 24,
              }}
              className="feature-card animate-fade-in-up card-gradient"
            >
              <SafetyOutlined
                style={{ fontSize: 48, marginBottom: 16 }}
                className="feature-icon"
              />
              <Typography.Title
                level={4}
                style={{ color: 'white', margin: '0 0 12px 0' }}
              >
                Secure & Reliable
              </Typography.Title>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Enterprise-grade security with encrypted data storage
              </Typography.Text>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
