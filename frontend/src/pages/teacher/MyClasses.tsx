import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, message, Button } from 'antd';
import { getMyClasses } from '../../api/teacher';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export default function MyClasses() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyClasses();
      setData(res.classes || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spin />;

  return (
    <div>
      <BackButton />
      <h3>My Classes</h3>
      <Row gutter={[16, 16]}>
        {data.map((c) => (
          <Col xs={24} sm={12} md={8} lg={6} key={c._id}>
            <Card>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: '#666' }}>{c.classCode}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
