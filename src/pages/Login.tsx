import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import FloatingIcon from '../components/FloatingIcon';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const desiredRole = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('role') || undefined;
  }, [location.search]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setErr(null);
  }, [desiredRole]);

  const onFinish = async (values: { identifier: string; password: string }) => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await http.post('/auth/login', values);
      const token = data?.token;
      const role = data?.role;
      if (!token || !role) throw new Error('Invalid login response.');

      localStorage.setItem('token', token);
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SET_AUTH_TOKEN', token });
      }
      setUser({ token, role, ...data });

      if (desiredRole && desiredRole !== role) {
        setErr(`Your account role is ${role}. Please use the ${role} portal.`);
        return;
      }
      if (role === 'Admin') navigate('/admin', { replace: true });
      else if (role === 'Teacher') navigate('/teacher', { replace: true });
      else if (role === 'Student') navigate('/student', { replace: true });
      else navigate('/', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roleGradient = desiredRole === 'Admin' 
    ? 'var(--gradient-primary)' 
    : desiredRole === 'Teacher' 
    ? 'var(--gradient-secondary)' 
    : 'var(--gradient-accent)';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(139,92,246,0.1) 0%, transparent 50%), var(--bg)',
        padding: 24,
      }}
    >
      <FloatingIcon color="rgba(99,102,241,0.3)" size={56} delay={0} top="10%" left="8%">
        <UserOutlined />
      </FloatingIcon>
      <FloatingIcon color="rgba(139,92,246,0.3)" size={48} delay={2} bottom="15%" right="10%">
        <LockOutlined />
      </FloatingIcon>

      <Card
        style={{
          maxWidth: 480,
          width: '100%',
          background: 'var(--card)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--box-shadow-lg)',
          border: `1px solid var(--border)`,
          overflow: 'hidden',
        }}
        className="animate-scale-in"
      >
        <div
          style={{
            background: roleGradient,
            margin: '-24px -24px 24px -24px',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <Typography.Title
            level={2}
            style={{
              color: 'white',
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            {desiredRole ? `${desiredRole} Login` : 'Login'}
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
            Enter your credentials to continue
          </Typography.Text>
        </div>

        {err && (
          <Alert
            type="error"
            message={err}
            style={{ marginBottom: 24, borderRadius: 12 }}
            showIcon
            className="animate-fade-in"
          />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Email or Username</span>}
            name="identifier"
            rules={[{ required: true, message: 'Please enter your email or username' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--muted)' }} />}
              placeholder="Enter your email or username"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--muted)' }} />}
              placeholder="Enter your password"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            icon={<LoginOutlined />}
            style={{
              height: 52,
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              background: roleGradient,
              border: 'none',
              marginTop: 8,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            Sign In
          </Button>
        </Form>

        <Button
          block
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{
            marginTop: 16,
            borderRadius: 12,
            fontWeight: 600,
            height: 48,
          }}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
}
