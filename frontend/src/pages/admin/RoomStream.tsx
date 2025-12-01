import { useEffect, useMemo, useState } from 'react';
import {
  Input,
  Button,
  Space,
  Typography,
  Alert,
  Card,
  Row,
  Col,
  message,
} from 'antd';
import Search from 'antd/es/input/Search';
import { listRooms } from '../../api/admin';
import { roomStreamUrl } from '../../api/admin';

export default function RoomStream() {
  const [roomId, setRoomId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await listRooms();
        setRooms(res.rooms || []);
      } catch (e: any) {
        message.error(e?.response?.data?.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleShow = () => {
    if (!roomId.trim()) {
      setError('Please enter a roomId');
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
    setImgLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const buildStreamUrl = (id: string) => {
    // `roomStreamUrl` already returns a fully-qualified URL (`API_HOST` + path).
    // Do not prepend `window.location.origin` or we'll end up with a malformed URL.
    const token = localStorage.getItem('token') || '';
    const q = new URLSearchParams();
    q.set('t', String(Date.now()));
    if (token) q.set('token', token);
    return `${roomStreamUrl(id)}?${q.toString()}`;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Room Stream</Typography.Title>
      <Search
        placeholder="Search rooms by name, id, description, or camera id"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 520 }}
      />
      <Row gutter={[16, 16]}>
        {(search
          ? rooms.filter((r: any) => {
              const name = (r.name || '').toLowerCase();
              const id = (r._id || '').toLowerCase();
              const desc = (r.description || '').toLowerCase();
              const camIds = (r.cameras || [])
                .map((c: any) => c.cameraId || '')
                .join(' ')
                .toLowerCase();
              const q = search.toLowerCase();
              return (
                name.includes(q) ||
                id.includes(q) ||
                desc.includes(q) ||
                camIds.includes(q)
              );
            })
          : rooms
        ).map((r) => {
          const firstCam = (r.cameras || [])[0];
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={r._id}>
              <Card
                hoverable
                onClick={() => {
                  setRoomId(r._id);
                  setError(null);
                  setSubmitted(true);
                  setImgLoading(true);
                  setRefreshKey((k) => k + 1);
                }}
              >
                <Typography.Title level={5} style={{ marginBottom: 4 }}>
                  {r.name}
                </Typography.Title>
                <Typography.Text type="secondary">
                  Room ID: {r._id}
                </Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Typography.Text type="secondary">
                    Camera ID: {firstCam?.cameraId || '—'}
                  </Typography.Text>
                </div>
                <div style={{ marginTop: 6 }}>
                  <Typography.Text type="secondary">
                    Description: {r.description || '—'}
                  </Typography.Text>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      {submitted && (
        <Card title={`Live stream for room: ${roomId}`} bordered>
          {imgLoading && !error && (
            <Typography.Text type="secondary">
              Loading stream...
            </Typography.Text>
          )}
          {error ? (
            <Alert
              type="error"
              message={error}
              description="We couldn’t fetch the live stream. Please verify the roomId, camera configuration, and your permissions."
            />
          ) : (
            <img // <--- Revert back to this
              key={refreshKey}
              src={buildStreamUrl(roomId)}
              alt="Room stream"
              style={{ maxWidth: '100%', border: '1px solid #eee' }}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setImgLoading(false);
                setError('Could not load stream (check roomId/permissions).');
              }}
            />
          )}
        </Card>
      )}
    </Space>
  );
}
