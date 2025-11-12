import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, message, Button } from 'antd';
import { getMySubjects } from '../../api/teacher';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export default function MySubjects() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMySubjects();
      setData(res.subjects || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load subjects');
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
      <h3>My Subjects</h3>
      <Row gutter={[16, 16]}>
        {data.map((s) => (
          <Col xs={24} sm={12} md={8} lg={6} key={s._id}>
            <Card hoverable>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: '#666' }}>{s.subjectCode}</div>
              <div style={{ color: '#999', marginTop: 8 }}>
                {s.class?.name || ''}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
