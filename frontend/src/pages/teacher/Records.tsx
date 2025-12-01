import { useEffect, useState } from 'react';
import { Select, Button, Table, DatePicker, message, Space, Spin } from 'antd';
import {
  getMyClasses,
  getMySubjects,
  listRecords,
  updateRecord,
} from '../../api/teacher';
import moment from 'moment';
import { useGlobalLoading } from '../../context/LoadingContext';

export default function Records() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [date, setDate] = useState<any>(moment());
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // desc = highest first
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'Present', 'Absent', or null for all
  const loadingCtx = useGlobalLoading();

  useEffect(() => {
    (async () => {
      try {
        const [c, s] = await Promise.all([getMyClasses(), getMySubjects()]);
        setClasses(c.classes || []);
        setSubjects(s.subjects || []);
      } catch (e) {}
    })();
  }, []);

  const onFetch = async () => {
    if (!classId || !subjectId || !date) {
      message.error('Select class, subject and date');
      return;
    }
    setLoading(true);
    loadingCtx.show();
    try {
      const res = await listRecords({
        classId,
        subjectId,
        date: date.format('YYYY-MM-DD'),
      });
      setRecords(res.records || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Fetch failed');
    } finally {
      setLoading(false);
      loadingCtx.hide();
    }
  };

  const onToggle = async (rec: any) => {
    const newStatus = rec.status === 'Present' ? 'Absent' : 'Present';
    loadingCtx.show();
    try {
      const res = await updateRecord(rec._id, { status: newStatus });
      message.success('Updated');
      setRecords((r) => r.map((it) => (it._id === rec._id ? res.record : it)));
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || e?.message || 'Update failed'
      );
    } finally {
      loadingCtx.hide();
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['student', 'name'],
      render: (_: any, r: any) => r.student?.name,
    },
    {
      title: 'Roll No',
      dataIndex: ['student', 'rollNo'],
      render: (_: any, r: any) => r.student?.rollNo,
    },
    { title: 'Status', dataIndex: 'status' },
    {
      title: 'Actions',
      render: (_: any, r: any) => (
        <Space>
          <Button onClick={() => onToggle(r)}>Toggle</Button>
        </Space>
      ),
    },
  ];

  // Apply filtering and sorting
  const filteredRecords = records
    .filter((r) => !statusFilter || r.status === statusFilter)
    .sort((a, b) => {
      // For attendance records, we can sort by status (Present/Absent) alphabetically, or by student name
      // This is a simple alphabetical sort by student name
      const nameA = a.student?.name || '';
      const nameB = b.student?.name || '';
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    <div>
      <h3>Attendance Records</h3>
      <div style={{ marginBottom: 12 }}>
        <Select
          placeholder="Class"
          style={{ minWidth: 200, marginRight: 8 }}
          options={(classes || []).map((c) => ({
            label: c.name,
            value: c._id,
          }))}
          value={classId || undefined}
          onChange={(v) => setClassId(v)}
        />
        <Select
          placeholder="Subject"
          style={{ minWidth: 200, marginRight: 8 }}
          options={(subjects || []).map((s) => ({
            label: s.name,
            value: s._id,
          }))}
          value={subjectId || undefined}
          onChange={(v) => setSubjectId(v)}
        />
        <DatePicker
          value={date}
          onChange={(d) => setDate(d)}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" onClick={onFetch} loading={loading}>
          Fetch
        </Button>
      </div>

      {records.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Select
            placeholder="Sort By"
            style={{ minWidth: 150 }}
            value={sortOrder}
            onChange={(v) => setSortOrder(v)}
            options={[
              { label: 'Name (A-Z)', value: 'asc' },
              { label: 'Name (Z-A)', value: 'desc' },
            ]}
          />
          <Select
            placeholder="Filter by Status"
            style={{ minWidth: 150 }}
            allowClear
            value={statusFilter || undefined}
            onChange={(v) => setStatusFilter(v)}
            options={[
              { label: 'All', value: null },
              { label: 'Present', value: 'Present' },
              { label: 'Absent', value: 'Absent' },
            ]}
          />
        </div>
      )}

      {loading ? (
        <Spin />
      ) : (
        <Table rowKey="_id" dataSource={filteredRecords} columns={columns} />
      )}
    </div>
  );
}
