import { useEffect, useState } from 'react';
import { Select, Button, Table, message, Space } from 'antd';
import { getMyClasses, getMySubjects, getSummary } from '../../api/teacher';

export default function Summary() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any[]>([]);

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
    if (!classId || !subjectId) {
      message.error('Select class and subject');
      return;
    }
    setLoading(true);
    try {
      const res = await getSummary({ classId, subjectId });
      setSummary(res.summary || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Roll No', dataIndex: 'rollNo' },
    { title: 'Present', dataIndex: 'present' },
    { title: 'Absent', dataIndex: 'absent' },
    { title: 'Total Classes', dataIndex: 'totalClasses' },
    { title: 'Present %', dataIndex: 'presentPercentage' },
  ];

  return (
    <div>
      <h3>Attendance Summary</h3>
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
        <Button type="primary" onClick={onFetch} loading={loading}>
          Fetch
        </Button>
      </div>
      <Table rowKey="_id" dataSource={summary} columns={columns} />
    </div>
  );
}
