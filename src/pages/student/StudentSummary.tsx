import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  Table,
  Divider,
  Spin,
  Alert,
  Progress,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { getMyAttendanceSummary } from '../../api/student';

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
  attendancePercentage?: number | string;
  presentPercentage?: number | string;
};

export default function StudentSummary() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyAttendanceSummary();
        setSummary(data.summary || []);
        setErr(null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || 'Failed to load summary'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'name',
      key: 'subject',
      width: 150,
    },
    {
      title: 'Present',
      dataIndex: 'present',
      key: 'present',
      width: 80,
      align: 'center' as const,
      render: (val: any, record: any) =>
        record.present || record.presentCount || 0,
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      width: 80,
      align: 'center' as const,
      render: (val: any, record: any) =>
        record.absent || record.absentCount || 0,
    },
    {
      title: 'Total',
      dataIndex: 'totalClasses',
      key: 'totalClasses',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Attendance %',
      dataIndex: 'presentPercentage',
      key: 'presentPercentage',
      width: 150,
      align: 'center' as const,
      render: (pct: number | string | undefined, record: any) => {
        const percentage = Math.round(
          Number(pct || record.attendancePercentage || 0)
        );
        const color =
          percentage >= 75
            ? '#22c55e'
            : percentage >= 50
            ? '#f59e0b'
            : '#ef4444';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress
              type="circle"
              percent={percentage}
              size={40}
              strokeColor={color}
            />
            <span style={{ fontWeight: 600 }}>{percentage}%</span>
          </div>
        );
      },
    },
  ];

  const tableData = summary.map((s, idx) => ({ ...s, key: idx }));

  if (loading) return <Spin />;
  if (err)
    return <Alert type="error" message={err} style={{ marginBottom: 16 }} />;

  // Calculate overall
  const totalPresent = summary.reduce(
    (s, r) => s + (r.present || r.presentCount || 0),
    0
  );
  const totalAbsent = summary.reduce(
    (s, r) => s + (r.absent || r.absentCount || 0),
    0
  );
  const totalClasses = summary.reduce((s, r) => s + (r.totalClasses || 0), 0);
  const overallAvg =
    totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <div>
      <BackButton />
      <Typography.Title level={3}>Attendance Summary</Typography.Title>

      {/* OVERALL STATS */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 12,
          }}
        >
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
              {totalClasses}
            </div>
            <div style={{ fontSize: 12 }}>Total Classes</div>
          </Card>

          <Card
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
              {totalPresent}
            </div>
            <div style={{ fontSize: 12 }}>Present</div>
          </Card>

          <Card
            style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: '#fff',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
              {totalAbsent}
            </div>
            <div style={{ fontSize: 12 }}>Absent</div>
          </Card>

          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              textAlign: 'center',
              border: 'none',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>
              {overallAvg}%
            </div>
            <div style={{ fontSize: 12 }}>Attendance</div>
          </Card>
        </div>
      </Card>

      {/* DETAILED TABLE */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Subject-wise Breakdown
          </Typography.Title>
          <Divider />
          {summary.length === 0 ? (
            <Typography.Text type="secondary">
              No summary data available
            </Typography.Text>
          ) : (
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ pageSize: 15 }}
              scroll={{ x: 600 }}
            />
          )}
        </Space>
      </Card>
    </div>
  );
}
