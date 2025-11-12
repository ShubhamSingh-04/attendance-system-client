import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Space,
  Statistic,
  Progress,
  Divider,
  Spin,
  Alert,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import {
  getStudentProfile,
  getMyClass,
  getMyAttendanceSummary,
  getMyAttendanceRecords,
} from '../../api/student';

type SummaryRow = {
  _id?: string;
  name?: string;
  subject?: string;
  subjectCode?: string;
  presentCount?: number;
  present?: number;
  absentCount?: number;
  absent?: number;
  totalClasses: number;
  attendancePercentage: number | string;
  presentPercentage?: number | string;
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [classInfo, setClassInfo] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch profile, summary and full records so totals reflect actual records
        const [prof, summ, recs] = await Promise.all([
          getStudentProfile(),
          getMyAttendanceSummary(),
          getMyAttendanceRecords({ subjectId: '', date: '' }),
        ]);

        const profileData = prof.profile || prof;
        setProfile(profileData);
        setClassInfo(profileData?.class || null);
        setSummary(summ.summary || []);

        const allRecords = recs.records || [];
        setRecords(allRecords);

        setErr(null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || 'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter and sort summary data
  const processedSummary = summary
    .filter((s) => {
      if (!filterLevel) return true;
      const pct = Number(s.attendancePercentage) || 0;
      if (filterLevel === 'high') return pct >= 75;
      if (filterLevel === 'med') return pct >= 50 && pct < 75;
      if (filterLevel === 'low') return pct < 50;
      return true;
    })
    .sort((a, b) => {
      const pctA = Number(a.attendancePercentage) || 0;
      const pctB = Number(b.attendancePercentage) || 0;
      return sortOrder === 'asc' ? pctA - pctB : pctB - pctA;
    });

  if (loading) return <Spin />;
  if (err)
    return <Alert type="error" message={err} style={{ marginBottom: 16 }} />;

  // Calculate overall stats from actual attendance records (more reliable)
  const totalClasses = records.length;
  const totalPresent = records.filter((r) => r.status === 'Present').length;
  const totalAbsent = totalClasses - totalPresent;
  const overallAvg =
    totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div>
      <BackButton />
      <Typography.Title level={3}>Student Dashboard</Typography.Title>

      {/* PROFILE & STATS SECTION */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Profile Card */}
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Typography.Title level={4} style={{ margin: '8px 0' }}>
              {profile?.name || 'Student'}
            </Typography.Title>
            <Typography.Text
              type="secondary"
              style={{ display: 'block', marginBottom: 4 }}
            >
              {profile?.email}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ display: 'block', marginBottom: 8 }}
            >
              Roll No: {profile?.rollNo}
            </Typography.Text>
            <Divider />
            <Typography.Text
              type="secondary"
              style={{ display: 'block', marginBottom: 4 }}
            >
              Class: {classInfo?.name || 'N/A'}
            </Typography.Text>
          </Card>
        </Col>

        {/* Overall Stats */}
        <Col xs={24} md={16}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#fff' }}>Total Classes</span>}
                    value={totalClasses}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background:
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                  }}
                >
                  <Statistic
                    title={
                      <span style={{ color: '#fff' }}>Overall Attendance</span>
                    }
                    value={overallAvg}
                    suffix="%"
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background:
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: '#fff',
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#fff' }}>Present</span>}
                    value={totalPresent}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background:
                      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: '#fff',
                  }}
                >
                  <Statistic
                    title={<span style={{ color: '#fff' }}>Absent</span>}
                    value={totalAbsent}
                    valueStyle={{ color: '#fff' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* ATTENDANCE BY SUBJECT */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Attendance by Subject
            </Typography.Title>
            <Space>
              <select
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
              <select
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                value={filterLevel || ''}
                onChange={(e) => setFilterLevel(e.target.value || null)}
              >
                <option value="">All</option>
                <option value="high">High (≥75%)</option>
                <option value="med">Medium (50-74%)</option>
                <option value="low">Low (&lt;50%)</option>
              </select>
            </Space>
          </Space>

          <Divider />

          {processedSummary.length === 0 ? (
            <Typography.Text type="secondary">
              No subject data available
            </Typography.Text>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {processedSummary.map((s, idx) => {
                const pct =
                  Number(s.attendancePercentage || s.presentPercentage) || 0;
                const color =
                  pct >= 75 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <Card key={idx} style={{ padding: 12 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                    >
                      <div
                        style={{ width: 200, fontSize: 14, fontWeight: 700 }}
                      >
                        {s.name || s.subject}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <Progress
                            percent={Math.round(pct)}
                            showInfo={false}
                            strokeColor={color}
                            strokeWidth={8}
                            trailColor={'rgba(0,0,0,0.06)'}
                          />
                        </div>

                        <div
                          style={{
                            minWidth: 56,
                            textAlign: 'center',
                            padding: '6px 8px',
                            borderRadius: 999,
                            background: color,
                            color: '#fff',
                            fontWeight: 700,
                            boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
                          }}
                        >
                          {Math.round(pct)}%
                        </div>
                      </div>

                      <div
                        style={{
                          width: 140,
                          textAlign: 'right',
                          fontSize: 13,
                          color: 'var(--muted)',
                        }}
                      >
                        {s.present || s.presentCount || 0} present •{' '}
                        {s.totalClasses || 0}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Space>
      </Card>

      {/* QUICK ACTION CARDS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/student/records')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography.Title level={5} style={{ color: '#fff', margin: 0 }}>
              📋 View All Records
            </Typography.Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
