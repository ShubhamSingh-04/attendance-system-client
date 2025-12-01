import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Select,
  Space,
  Progress,
  Divider,
  Empty,
  Spin,
  Alert,
  Grid,
  Statistic,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/PageHeader';
import { getMyClasses, getMySubjects, getSummary } from '../../api/teacher';

const { useBreakpoint } = Grid;

type SummaryRow = {
  _id: string;
  name: string;
  rollNo: string | number;
  present: number;
  absent: number;
  totalClasses: number;
  presentPercentage: number;
};

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [dashboardSort, setDashboardSort] = useState<'asc' | 'desc'>('desc');
  const [dashboardFilter, setDashboardFilter] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([getMyClasses(), getMySubjects()]);
        setClasses(c.classes || []);
        setSubjects(s.subjects || []);
        if ((c.classes || []).length > 0) setClassId(c.classes[0]._id);
        if ((s.subjects || []).length > 0) setSubjectId(s.subjects[0]._id);
        setErr(null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ||
            e?.message ||
            'Failed to load classes/subjects'
        );
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!classId || !subjectId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getSummary({ classId, subjectId });
        setSummary(res.summary || []);
      } catch (e) {
        setSummary([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId, subjectId]);

  const processedSummary = summary
    .filter((s) => {
      if (!dashboardFilter) return true;
      const pct = Number(s.presentPercentage) || 0;
      if (dashboardFilter === 'high') return pct >= 75;
      if (dashboardFilter === 'med') return pct >= 50 && pct < 75;
      if (dashboardFilter === 'low') return pct < 50;
      return true;
    })
    .sort((a, b) => {
      const pctA = Number(a.presentPercentage) || 0;
      const pctB = Number(b.presentPercentage) || 0;
      return dashboardSort === 'asc' ? pctA - pctB : pctB - pctA;
    });

  const avgAttendance = summary.length
    ? Math.round(
        summary.reduce((s, r) => s + (Number(r.presentPercentage) || 0), 0) /
          summary.length
      )
    : 0;

  return (
    <div>
      <BackButton />

      {initialLoading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : err ? (
        <Alert
          type="error"
          message={err}
          style={{ marginBottom: 16, borderRadius: 16 }}
        />
      ) : (
        <>
          <Card style={{ marginBottom: 24 }} className="animate-fade-in">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <label
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  Select Class
                </label>
                <Select
                  placeholder="Choose a class"
                  style={{ width: '100%' }}
                  size="large"
                  options={(classes || []).map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                  value={classId || undefined}
                  onChange={(v) => setClassId(v)}
                />
              </Col>
              <Col xs={24} md={8}>
                <label
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  Select Subject
                </label>
                <Select
                  placeholder="Choose a subject"
                  style={{ width: '100%' }}
                  size="large"
                  options={(subjects || []).map((s) => ({
                    label: s.name,
                    value: s._id,
                  }))}
                  value={subjectId || undefined}
                  onChange={(v) => setSubjectId(v)}
                />
              </Col>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: 'white', fontWeight: 600 }}>
                        Total Students
                      </span>
                    }
                    value={summary.length}
                    valueStyle={{ color: 'white', fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : summary.length === 0 ? (
            <Empty description="No attendance data available for this class and subject" />
          ) : (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card
                  style={{
                    background: 'var(--gradient-accent)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    minHeight: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                  className="animate-scale-in"
                >
                  <Typography.Title
                    level={4}
                    style={{ color: 'white', marginBottom: 16 }}
                  >
                    Average Attendance
                  </Typography.Title>
                  <Progress
                    type="circle"
                    percent={avgAttendance}
                    size={140}
                    strokeColor="white"
                    trailColor="rgba(255,255,255,0.3)"
                    strokeWidth={8}
                    format={(percent) => (
                      <span
                        style={{
                          color: 'white',
                          fontSize: 32,
                          fontWeight: 700,
                        }}
                      >
                        {percent}%
                      </span>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={16}>
                <Card style={{ minHeight: 240 }} className="animate-fade-in">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      Student Attendance
                    </Typography.Title>
                    <Space wrap>
                      <Select
                        value={dashboardSort}
                        onChange={(v) => setDashboardSort(v)}
                        size="large"
                        style={{ minWidth: 150 }}
                        options={[
                          { label: 'Highest First', value: 'desc' },
                          { label: 'Lowest First', value: 'asc' },
                        ]}
                      />
                      <Select
                        allowClear
                        placeholder="Filter"
                        value={dashboardFilter || undefined}
                        onChange={(v) => setDashboardFilter(v)}
                        size="large"
                        style={{ minWidth: 150 }}
                        options={[
                          { label: 'All Students', value: null },
                          { label: 'High (≥75%)', value: 'high' },
                          { label: 'Medium (50-74%)', value: 'med' },
                          { label: 'Low (<50%)', value: 'low' },
                        ]}
                      />
                    </Space>
                  </div>
                  <div
                    style={{
                      maxHeight: 400,
                      overflowY: 'auto',
                      display: 'grid',
                      gap: 12,
                    }}
                  >
                    {processedSummary.map((s, idx) => {
                      const pct = Math.round(s.presentPercentage);
                      const color =
                        pct >= 75
                          ? '#10b981'
                          : pct >= 50
                          ? '#f59e0b'
                          : '#ef4444';
                      return (
                        <div
                          key={s._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: 12,
                            background: 'var(--bg)',
                            borderRadius: 12,
                          }}
                        >
                          <div
                            style={{
                              minWidth: 140,
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {s.name}
                          </div>
                          <div style={{ flex: 1 }}>
                            <Progress
                              percent={pct}
                              showInfo={false}
                              strokeColor={color}
                              strokeWidth={10}
                            />
                          </div>
                          <div
                            style={{
                              minWidth: 60,
                              padding: '6px 12px',
                              borderRadius: 999,
                              background: color,
                              color: 'white',
                              fontWeight: 700,
                              textAlign: 'center',
                            }}
                          >
                            {pct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          <div style={{ marginTop: 32 }}>
            <Typography.Title level={3} style={{ marginBottom: 24 }}>
              Quick Actions
            </Typography.Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => navigate('/teacher/my-classes')}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                  className="animate-scale-in card-gradient"
                >
                  <TeamOutlined style={{ fontSize: 36, marginBottom: 12 }} />
                  <Typography.Title
                    level={5}
                    style={{ color: 'white', margin: 0 }}
                  >
                    My Classes
                  </Typography.Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => navigate('/teacher/my-subjects')}
                  style={{
                    background: 'var(--gradient-secondary)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                  className="animate-scale-in card-gradient"
                >
                  <BookOutlined style={{ fontSize: 36, marginBottom: 12 }} />
                  <Typography.Title
                    level={5}
                    style={{ color: 'white', margin: 0 }}
                  >
                    My Subjects
                  </Typography.Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => navigate('/teacher/mark-attendance')}
                  style={{
                    background: 'var(--gradient-accent)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                  className="animate-scale-in card-gradient"
                >
                  <CheckCircleOutlined
                    style={{ fontSize: 36, marginBottom: 12 }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ color: 'white', margin: 0 }}
                  >
                    Mark Attendance
                  </Typography.Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => navigate('/teacher/records')}
                  style={{
                    background: 'var(--gradient-success)',
                    color: 'white',
                    border: 'none',
                    textAlign: 'center',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                  className="animate-scale-in card-gradient"
                >
                  <FileDoneOutlined
                    style={{ fontSize: 36, marginBottom: 12 }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ color: 'white', margin: 0 }}
                  >
                    Records
                  </Typography.Title>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  );
}
