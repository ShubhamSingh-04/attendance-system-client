import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Table,
  Typography,
  Space,
  Select,
  Divider,
  Spin,
  Alert,
  DatePicker,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { getMyAttendanceRecords, getMyClass } from '../../api/student';

type AttendanceRecord = {
  _id: string;
  date: string;
  status: 'Present' | 'Absent';
  subject?: string | { name: string; subjectCode?: string };
  teacher?: string | { name: string };
  markedBy?: string | { name: string };
  room?: string;
};

export default function StudentRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyAttendanceRecords({ subjectId: '', date: '' });
        const allRecords = data.records || [];
        setRecords(allRecords);

        // Extract unique subjects
        const uniqueSubjects = Array.from(
          new Set(
            allRecords
              .map((r: any) => r.subject?.name || r.subject)
              .filter(Boolean)
          )
        ) as string[];
        setSubjects(uniqueSubjects);

        setErr(null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || 'Failed to load records'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter and sort records
  const processedRecords = records
    .filter((r) => {
      if (selectedSubject) {
        const recordSubject =
          typeof r.subject === 'string' ? r.subject : r.subject?.name;
        if (recordSubject !== selectedSubject) return false;
      }
      if (selectedDate) {
        const recordDate = dayjs(r.date).format('YYYY-MM-DD');
        const filterDate = selectedDate.format('YYYY-MM-DD');
        if (recordDate !== filterDate) return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 100,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 150,
      render: (subject: any) =>
        typeof subject === 'string' ? subject : subject?.name,
    },
    {
      title: 'Teacher',
      dataIndex: 'markedBy',
      key: 'markedBy',
      width: 120,
      render: (teacher: any) =>
        typeof teacher === 'string' ? teacher : teacher?.name,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: status === 'Present' ? '#dcfce7' : '#fee2e2',
            color: status === 'Present' ? '#166534' : '#991b1b',
            fontWeight: 600,
          }}
        >
          {status}
        </span>
      ),
    },
  ];

  if (loading) return <Spin />;
  if (err)
    return <Alert type="error" message={err} style={{ marginBottom: 16 }} />;

  return (
    <div>
      <BackButton />
      <Typography.Title level={3}>Attendance Records</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Typography.Text>
              Total: <strong>{processedRecords.length}</strong> | Present:{' '}
              <strong style={{ color: '#166534' }}>
                {processedRecords.filter((r) => r.status === 'Present').length}
              </strong>{' '}
              | Absent:{' '}
              <strong style={{ color: '#991b1b' }}>
                {processedRecords.filter((r) => r.status === 'Absent').length}
              </strong>
            </Typography.Text>

            <Space wrap>
              <DatePicker
                placeholder="Select Date"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                style={{
                  borderRadius: '4px',
                }}
              />

              <Select
                allowClear
                placeholder="All Subjects"
                style={{ width: 150 }}
                value={selectedSubject}
                onChange={(val) => setSelectedSubject(val)}
                options={subjects.map((s) => ({ label: s, value: s }))}
              />

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
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
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
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </Space>
          </div>

          <Divider />

          <Table
            columns={columns}
            dataSource={processedRecords.map((r, idx) => ({ ...r, key: idx }))}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 600 }}
          />
        </Space>
      </Card>
    </div>
  );
}
