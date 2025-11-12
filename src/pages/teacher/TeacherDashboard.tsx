import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Select,
  Space,
  Statistic,
  Progress,
  Divider,
  Empty,
  Spin,
  Alert,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { getMyClasses, getMySubjects, getSummary } from '../../api/teacher';

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
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [dashboardSort, setDashboardSort] = useState<'asc' | 'desc'>('desc'); // desc = highest attendance first
  const [dashboardFilter, setDashboardFilter] = useState<string | null>(null); // 'high' (>=75), 'med' (50-74), 'low' (<50)

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([getMyClasses(), getMySubjects()]);
        setClasses(c.classes || []);
        setSubjects(s.subjects || []);
        // default to first available
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
    // fetch summary when class/subject selected
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

  // Filter and sort dashboard summary data
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

  return (
    <div>
      <BackButton />
      <Typography.Title level={3}>Teacher Dashboard</Typography.Title>

      {initialLoading ? (
        <Spin />
      ) : err ? (
        <Alert type="error" message={err} style={{ marginBottom: 16 }} />
      ) : (
        <>
          {/* SUMMARY PANEL - visual charts and colors on dashboard landing */}
          <Card style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Space>
                  <Select
                    placeholder="Class"
                    style={{ minWidth: 200 }}
                    options={(classes || []).map((c) => ({
                      label: c.name,
                      value: c._id,
                    }))}
                    value={classId || undefined}
                    onChange={(v) => setClassId(v)}
                  />
                  <Select
                    placeholder="Subject"
                    style={{ minWidth: 200 }}
                    options={(subjects || []).map((s) => ({
                      label: s.name,
                      value: s._id,
                    }))}
                    value={subjectId || undefined}
                    onChange={(v) => setSubjectId(v)}
                  />
                </Space>

                <Space>
                  <Statistic title="Students" value={summary.length} />
                </Space>
              </Space>

              <Divider />

              {loading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Spin />
                </div>
              ) : summary.length === 0 ? (
                <Empty description="No summary available for selected class/subject" />
              ) : (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    {/* Overall average attendance */}
                    <Card>
                      <Typography.Text type="secondary">
                        Average Attendance
                      </Typography.Text>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          marginTop: 8,
                        }}
                      >
                        {(() => {
                          const sum = summary.reduce(
                            (s, r) => s + (Number(r.presentPercentage) || 0),
                            0
                          );
                          const avg = summary.length
                            ? Math.round(sum / summary.length)
                            : 0;
                          return (
                            <>
                              <Progress
                                type="circle"
                                percent={avg}
                                width={120}
                              />
                              <div>
                                <Statistic
                                  title="Avg Present %"
                                  value={avg}
                                  suffix="%"
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} md={16}>
                    {/* Per-student bars - colored */}
                    <Card>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space
                          style={{
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <Typography.Text type="secondary">
                            Students (Present %)
                          </Typography.Text>
                          <Space>
                            <Select
                              placeholder="Sort"
                              style={{ minWidth: 140 }}
                              value={dashboardSort}
                              onChange={(v) => setDashboardSort(v)}
                              options={[
                                { label: 'Highest First', value: 'desc' },
                                { label: 'Lowest First', value: 'asc' },
                              ]}
                            />
                            <Select
                              placeholder="Filter"
                              style={{ minWidth: 140 }}
                              allowClear
                              value={dashboardFilter || undefined}
                              onChange={(v) => setDashboardFilter(v)}
                              options={[
                                { label: 'All', value: null },
                                { label: 'High (≥75%)', value: 'high' },
                                { label: 'Medium (50-74%)', value: 'med' },
                                { label: 'Low (<50%)', value: 'low' },
                              ]}
                            />
                          </Space>
                        </Space>
                        <div
                          style={{ marginTop: 12, display: 'grid', gap: 12 }}
                        >
                          {processedSummary.map((s) => (
                            <div
                              key={s._id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                              }}
                            >
                              <div style={{ width: 160, fontSize: 13 }}>
                                {s.name} ({s.rollNo})
                              </div>
                              <div style={{ flex: 1 }}>
                                <Progress
                                  percent={Math.round(s.presentPercentage)}
                                  showInfo={false}
                                  strokeColor={
                                    s.presentPercentage >= 75
                                      ? '#22c55e'
                                      : s.presentPercentage >= 50
                                      ? '#f59e0b'
                                      : '#ef4444'
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  width: 60,
                                  textAlign: 'right',
                                  fontWeight: 600,
                                }}
                              >
                                {Math.round(s.presentPercentage)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              )}
            </Space>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card hoverable onClick={() => navigate('/teacher/my-classes')}>
                My Classes
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card hoverable onClick={() => navigate('/teacher/my-subjects')}>
                My Subjects
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => navigate('/teacher/mark-attendance')}
              >
                Mark Attendance
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card hoverable onClick={() => navigate('/teacher/records')}>
                Records
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
