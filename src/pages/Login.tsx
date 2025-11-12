import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Typography, Alert } from 'antd';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';

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

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Card style={{ maxWidth: 420, width: '100%' }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          {desiredRole ? `${desiredRole} Login` : 'Login'}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 16 }}>
          Use your email/username and password
        </Typography.Paragraph>
        {err && <Alert type="error" message={err} style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Identifier"
            name="identifier"
            rules={[{ required: true, message: 'Please enter email or username' }]}
          >
            <Input placeholder="Email or username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign In
          </Button>
        </Form>
        <Button style={{ marginTop: 12 }} block onClick={() => navigate('/')}>
          ← Go to Home
        </Button>
      </Card>
    </div>
  );
}


