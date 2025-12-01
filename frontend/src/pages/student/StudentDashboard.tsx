import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Typography,
  Space,
  Progress,
  Divider,
  Spin,
  Alert,
  Select,
  Grid,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FileTextOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/PageHeader';
import GradientCard from '../../components/GradientCard';
import AnimatedStatistic from '../../components/AnimatedStatistic';
import {
  getStudentProfile,
  getMyAttendanceSummary,
  getMyAttendanceRecords,
} from '../../api/student';

const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (err) {
    return (
      <Alert
        type="error"
        message={err}
        style={{ marginBottom: 16, borderRadius: 16 }}
      />
    );
  }

  const totalClasses = records.length;
  const totalPresent = records.filter((r) => r.status === 'Present').length;
  const totalAbsent = totalClasses - totalPresent;
  const overallAvg =
    totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div>
      <BackButton />

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={8}>
          <Card
            style={{
              textAlign: 'center',
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              minHeight: 240,
            }}
            className="animate-scale-in card-gradient"
          >
            <UserOutlined
              style={{ fontSize: 64, marginBottom: 16, opacity: 0.9 }}
            />
            <Typography.Title
              level={3}
              style={{ color: 'white', margin: '8px 0' }}
            >
              {profile?.name || 'Student'}
            </Typography.Title>
            <Typography.Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              {profile?.email}
            </Typography.Text>
            <Divider
              style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '16px 0' }}
            />
            <Typography.Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                display: 'block',
                fontSize: 16,
              }}
            >
              Roll No: <strong>{profile?.rollNo}</strong>
            </Typography.Text>
            <Typography.Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                display: 'block',
                fontSize: 16,
              }}
            >
              Class: <strong>{classInfo?.name || 'N/A'}</strong>
            </Typography.Text>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <AnimatedStatistic
                title="Total Classes"
                value={totalClasses}
                gradient="var(--gradient-primary)"
                icon={<BarChartOutlined />}
                delay={0}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AnimatedStatistic
                title="Overall Attendance"
                value={overallAvg}
                suffix="%"
                gradient="var(--gradient-secondary)"
                icon={<TrophyOutlined />}
                delay={100}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AnimatedStatistic
                title="Present"
                value={totalPresent}
                gradient="var(--gradient-success)"
                icon={<CheckCircleOutlined />}
                delay={200}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AnimatedStatistic
                title="Absent"
                value={totalAbsent}
                gradient="var(--gradient-warm)"
                icon={<CloseCircleOutlined />}
                delay={300}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }} className="animate-fade-in">
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
          <Typography.Title level={3} style={{ margin: 0 }}>
            Attendance by Subject
          </Typography.Title>
          <Space wrap>
            <Select
              value={sortOrder}
              onChange={(v) => setSortOrder(v as 'asc' | 'desc')}
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
              value={filterLevel || undefined}
              onChange={(v) => setFilterLevel(v)}
              size="large"
              style={{ minWidth: 150 }}
              options={[
                { label: 'All Subjects', value: null },
                { label: 'High (≥75%)', value: 'high' },
                { label: 'Medium (50-74%)', value: 'med' },
                { label: 'Low (<50%)', value: 'low' },
              ]}
            />
          </Space>
        </div>

        {processedSummary.length === 0 ? (
          <Typography.Text type="secondary">
            No subject data available
          </Typography.Text>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {processedSummary.map((s, idx) => {
              const pct = Math.round(
                Number(s.attendancePercentage || s.presentPercentage) || 0
              );
              const color =
                pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <Card
                  key={idx}
                  style={{
                    background: 'var(--bg)',
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{ minWidth: 180, fontWeight: 700, fontSize: 16 }}
                    >
                      {s.name || s.subject}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <Progress
                        percent={pct}
                        showInfo={false}
                        strokeColor={color}
                        strokeWidth={12}
                        trailColor="rgba(0,0,0,0.08)"
                      />
                    </div>
                    <div
                      style={{
                        minWidth: 70,
                        padding: '8px 16px',
                        borderRadius: 999,
                        background: color,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                    >
                      {pct}%
                    </div>
                    <div
                      style={{
                        minWidth: 120,
                        textAlign: 'right',
                        color: 'var(--muted)',
                        fontSize: 14,
                      }}
                    >
                      {s.present || s.presentCount || 0} / {s.totalClasses || 0}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      <div>
        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          Quick Actions
        </Typography.Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => navigate('/student/records')}
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
              <FileTextOutlined style={{ fontSize: 40, marginBottom: 12 }} />
              <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
                View All Records
              </Typography.Title>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
