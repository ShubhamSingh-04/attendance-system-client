import { useEffect, useState } from 'react';
import {
  Select,
  Button,
  Space,
  Table,
  message,
  Spin,
  Card,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  getMyClasses,
  getMySubjects,
  getAllRooms,
  checkAttendance,
  markAttendance,
} from '../../api/teacher';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '../../context/LoadingContext';

type FilterType = 'all' | 'present' | 'absent';

export default function MarkAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchParams] = useSearchParams();
  const loadingCtx = useGlobalLoading();

  useEffect(() => {
    (async () => {
      try {
        const [cRes, sRes, rRes] = await Promise.all([
          getMyClasses(),
          getMySubjects(),
          getAllRooms(),
        ]);
        setClasses(cRes.classes || []);
        setSubjects(sRes.subjects || []);
        setRooms(rRes.rooms || []);
        const preClass = searchParams.get('classId');
        if (preClass) setClassId(preClass);
      } catch (e: any) {
        message.error('Failed to load data');
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = attendance;
    if (filter === 'present')
      filtered = attendance.filter((a) => a.status === 'Present');
    else if (filter === 'absent')
      filtered = attendance.filter((a) => a.status === 'Absent');
    setFilteredAttendance(filtered);
  }, [attendance, filter]);

  const onCheck = async () => {
    if (!classId || !subjectId || !roomId) {
      message.error('Select class, subject and room');
      return;
    }
    setLoading(true);
    loadingCtx.show();
    try {
      const data = await checkAttendance(classId, subjectId, roomId);
      setAttendance(data.attendanceList || []);
      setStats(data.stats || null);
      setFilter('all');
      message.success('Attendance data loaded successfully');
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Check failed');
    } finally {
      setLoading(false);
      loadingCtx.hide();
    }
  };

  const onSave = async () => {
    if (!classId || !subjectId || !roomId) {
      message.error('Missing selection');
      return;
    }
    if (!attendance || attendance.length === 0) {
      message.error('Nothing to save');
      return;
    }
    const today = moment();
    const payload = {
      attendanceList: attendance.map((a) => ({ _id: a._id, status: a.status })),
      subjectId,
      date: today.format('YYYY-MM-DD'),
      time: today.format('HH:mm:ss'),
    };
    setSaving(true);
    loadingCtx.show();
    try {
      await markAttendance(classId, subjectId, roomId, payload);
      message.success('Attendance saved successfully');
      setAttendance([]);
      setStats(null);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || 'Save failed');
    } finally {
      setSaving(false);
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

  const markAllPresent = () => {
    setAttendance((prev) => prev.map((r) => ({ ...r, status: 'Present' })));
    message.info('All marked as Present');
  };

  const markAllAbsent = () => {
    setAttendance((prev) => prev.map((r) => ({ ...r, status: 'Absent' })));
    message.info('All marked as Absent');
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, r: any) => (
        <Button
          onClick={() => toggleStatus(r)}
          type={r.status === 'Present' ? 'primary' : 'default'}
          danger={r.status === 'Absent'}
        >
          {r.status}
        </Button>
      ),
    },
  ];

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  return (
    <div>
      <h3>Mark Attendance</h3>

      {/* Selection Card */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={12} wrap>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select class"
              value={classId || undefined}
              onChange={(v) => setClassId(v)}
              options={(classes || []).map((c) => ({
                label: c.name + ' (' + (c.classCode || '') + ')',
                value: c._id,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select subject"
              value={subjectId || undefined}
              onChange={(v) => setSubjectId(v)}
              options={(subjects || []).map((s) => ({
                label: s.name + ' (' + (s.subjectCode || '') + ')',
                value: s._id,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select room"
              value={roomId || undefined}
              onChange={(v) => setRoomId(v)}
              options={(rooms || []).map((r) => ({
                label:
                  r.name + ' (' + (r._id?.toString().slice(-4) || '') + ')',
                value: r._id,
              }))}
            />
          </Col>
        </Row>
        <Row gutter={12} style={{ marginTop: 12 }}>
          <Col>
            <Button onClick={onCheck} type="primary" loading={loading}>
              Check Attendance
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Card */}
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <div>
                <strong>Faces Detected:</strong> {stats.faces_detected}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <strong>Unrecognized Faces:</strong> {stats.unrecognized_faces}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <strong>Present:</strong>{' '}
                <Tag color="green">{stats.students_present}</Tag>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div>
                <strong>Absent:</strong>{' '}
                <Tag color="red">{stats.students_absent}</Tag>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Attendance Edit Card */}
      {attendance.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle" wrap>
            <Col>
              <strong>Filter:</strong>
            </Col>
            <Col>
              <Select
                style={{ minWidth: 120 }}
                value={filter}
                onChange={(v) => setFilter(v)}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Present', value: 'present' },
                  { label: 'Absent', value: 'absent' },
                ]}
              />
            </Col>
            <Col>
              <span>
                Showing {filteredAttendance.length} of {attendance.length}{' '}
                students
              </span>
            </Col>
            <Col style={{ marginLeft: 'auto' }}>
              <Space>
                <Button onClick={markAllPresent} type="primary">
                  Mark All Present
                </Button>
                <Button onClick={markAllAbsent} danger>
                  Mark All Absent
                </Button>
              </Space>
            </Col>
          </Row>

          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <div style={{ marginBottom: 12 }}>
                <Tag color="green">Present: {presentCount}</Tag>
                <Tag color="red">Absent: {absentCount}</Tag>
              </div>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Row gutter={12}>
            <Col>
              <Button
                type="primary"
                size="large"
                onClick={onSave}
                loading={saving}
                disabled={attendance.length === 0}
              >
                Save Attendance
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Table */}
      {loading ? (
        <Spin />
      ) : (
        attendance.length > 0 && (
          <Card>
            <Table
              rowKey="_id"
              dataSource={filteredAttendance}
              columns={columns}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 600 }}
            />
          </Card>
        )
      )}
    </div>
  );
}
