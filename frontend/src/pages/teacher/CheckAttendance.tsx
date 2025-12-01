import { useEffect, useState } from 'react';
import {
  Select,
  Button,
  Space,
  Table,
  message,
  Spin,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Input,
} from 'antd';
import {
  getMyClasses,
  getMySubjects,
  checkAttendance,
  markAttendance,
} from '../../api/teacher';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '../../context/LoadingContext';

export default function CheckAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [date, setDate] = useState<any>(moment());
  const [time, setTime] = useState<any>(moment());
  const [searchParams] = useSearchParams();
  const loadingCtx = useGlobalLoading();

  useEffect(() => {
    (async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          getMyClasses(),
          getMySubjects(),
        ]);
        setClasses(cRes.classes || []);
        setSubjects(sRes.subjects || []);
        const preClass = searchParams.get('classId');
        if (preClass) setClassId(preClass);
      } catch (e: any) {
        message.error('Failed to load data');
      }
    })();
  }, []);

  const onCheck = async () => {
    if (!classId || !subjectId || !roomId) {
      message.error('Select class, subject and enter room id');
      return;
    }
    setLoading(true);
    loadingCtx.show();
    try {
      const data = await checkAttendance(classId, subjectId, roomId);
      setAttendance(data.attendanceList || []);
      setStats(data.stats || null);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Check failed');
    } finally {
      setLoading(false);
      loadingCtx.hide();
    }
  };

  const onMark = async () => {
    if (!classId || !subjectId || !roomId) {
      message.error('Missing selection');
      return;
    }
    if (!attendance || attendance.length === 0) {
      message.error('Nothing to save');
      return;
    }
    const payload = {
      attendanceList: attendance.map((a) => ({ _id: a._id, status: a.status })),
      subjectId,
      date: date.format('YYYY-MM-DD'),
      time: time.format('HH:mm:ss'),
    };
    setLoading(true);
    loadingCtx.show();
    try {
      await markAttendance(classId, subjectId, roomId, payload);
      message.success('Attendance saved');
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Save failed');
    } finally {
      setLoading(false);
      loadingCtx.hide();
    }
  };

  const toggleStatus = (record: any) => {
    setAttendance((prev) =>
      prev.map((r) =>
        r._id === record._id
          ? { ...r, status: r.status === 'Present' ? 'Absent' : 'Present' }
          : r
      )
    );
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Roll No', dataIndex: 'rollNo' },
    {
      title: 'Status',
      render: (_: any, r: any) => (
        <Button
          onClick={() => toggleStatus(r)}
          type={r.status === 'Present' ? 'primary' : 'default'}
        >
          {r.status}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h3>Check Attendance</h3>
      <Card style={{ marginBottom: 12 }}>
        <Row gutter={12}>
          <Col>
            <Select
              style={{ minWidth: 220 }}
              placeholder="Select class"
              value={classId || undefined}
              onChange={(v) => setClassId(v)}
              options={(classes || []).map((c) => ({
                label: c.name + ' (' + (c.classCode || '') + ')',
                value: c._id,
              }))}
            />
          </Col>
          <Col>
            <Select
              style={{ minWidth: 220 }}
              placeholder="Select subject"
              value={subjectId || undefined}
              onChange={(v) => setSubjectId(v)}
              options={(subjects || []).map((s) => ({
                label: s.name + ' (' + (s.subjectCode || '') + ')',
                value: s._id,
              }))}
            />
          </Col>
          <Col>
            <Input
              placeholder="Room Id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </Col>
          <Col>
            <DatePicker value={date} onChange={(d) => setDate(d)} />
          </Col>
          <Col>
            <TimePicker value={time} onChange={(t) => setTime(t)} />
          </Col>
          <Col>
            <Space>
              <Button onClick={onCheck} type="primary" loading={loading}>
                Check
              </Button>
              <Button
                onClick={onMark}
                disabled={!attendance || attendance.length === 0}
                loading={loading}
              >
                Mark Attendance
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Spin />
      ) : (
        <>
          {stats && (
            <Card style={{ marginBottom: 12 }}>
              <div>Faces detected: {stats.faces_detected}</div>
              <div>Unrecognized faces: {stats.unrecognized_faces}</div>
              <div>Present: {stats.students_present}</div>
              <div>Absent: {stats.students_absent}</div>
            </Card>
          )}

          <Table rowKey="_id" dataSource={attendance} columns={columns} />
        </>
      )}
    </div>
  );
}
