import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  Space,
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import {
  createSubject,
  deleteSubject,
  listClasses,
  listStudents,
  listSubjects,
} from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clazz, setClazz] = useState<any | null>(null);
  const [loadingClass, setLoadingClass] = useState(true);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const [subjectForm] = Form.useForm();

  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Load class details (from list, then find by id)
  useEffect(() => {
    (async () => {
      setLoadingClass(true);
      try {
        const res = await listClasses();
        const found = (res.classes || []).find((c: any) => c._id === id);
        setClazz(found || null);
      } catch (e: any) {
        message.error(e?.response?.data?.message || 'Failed to load class');
      } finally {
        setLoadingClass(false);
      }
    })();
  }, [id]);

  const classId = id!;
  const classCode = useMemo(() => clazz?.classCode, [clazz]);

  // Subjects for class (client-side filtered)
  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const res = await listSubjects();
      const items = (res.subjects || []).filter((s: any) => {
        // assume subject.class is the object id or populated object
        const subjClassId =
          typeof s.class === 'string' ? s.class : s.class?._id;
        return subjClassId === classId;
      });
      setSubjects(items);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Students for class (server-side filtered via classCode)
  const fetchStudents = async () => {
    if (!classCode) return;
    setLoadingStudents(true);
    try {
      const res = await listStudents({ classCode });
      setStudents(res.students || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (classId) fetchSubjects();
  }, [classId]);
  useEffect(() => {
    if (classCode) fetchStudents();
  }, [classCode]);

  const onCreateSubject = () => {
    subjectForm.resetFields();
    if (clazz?.classCode) {
      subjectForm.setFieldsValue({ classCode: clazz.classCode });
    }
    setSubjectModal(true);
  };
  const onSubmitSubject = async () => {
    try {
      const values = await subjectForm.validateFields();
      // create with explicit codes per requirements
      await createSubject(values);
      message.success('Subject created');
      setSubjectModal(false);
      fetchSubjects();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || 'Save failed');
    }
  };
  const onDeleteSubject = async (record: any) => {
    try {
      await deleteSubject(record._id);
      message.success('Deleted');
      fetchSubjects();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <BackButton />
      <Typography.Title level={4} style={{ marginBottom: 0 }}>
        {loadingClass
          ? 'Loading…'
          : clazz
          ? `${clazz.name} (${clazz.classCode})`
          : 'Class not found'}
      </Typography.Title>
      <Tabs
        items={[
          {
            key: 'subjects',
            label: 'Subjects',
            children: (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <Typography.Text strong>
                    Subjects in this class
                  </Typography.Text>
                  <Button type="primary" onClick={onCreateSubject}>
                    Add Subject
                  </Button>
                </Space>
                <Table
                  rowKey="_id"
                  loading={loadingSubjects}
                  dataSource={subjects}
                  scroll={{ x: true }}
                  columns={[
                    { title: 'Name', dataIndex: 'name' },
                    {
                      title: 'Subject Code',
                      dataIndex: 'subjectCode',
                      render: (_: any, r: any) => r.subjectCode || r.code,
                    },
                    {
                      title: 'Actions',
                      render: (_: any, record: any) => (
                        <Button danger onClick={() => onDeleteSubject(record)}>
                          Delete
                        </Button>
                      ),
                    },
                  ]}
                />
                <Modal
                  title="Create Subject"
                  open={subjectModal}
                  onOk={onSubmitSubject}
                  onCancel={() => setSubjectModal(false)}
                  destroyOnClose
                >
                  <Form form={subjectForm} layout="vertical">
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="subjectCode"
                      label="Subject Code"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="classCode"
                      label="Class Code"
                      rules={[{ required: true }]}
                    >
                      <Input disabled={!!clazz?.code} />
                    </Form.Item>
                  </Form>
                </Modal>
              </Space>
            ),
          },
          {
            key: 'students',
            label: 'Students',
            children: (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>Students in this class</Typography.Text>
                <Table
                  rowKey="_id"
                  loading={loadingStudents}
                  dataSource={students}
                  scroll={{ x: true }}
                  columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'Roll No', dataIndex: 'rollNo' },
                    {
                      title: 'Email',
                      dataIndex: ['user', 'email'],
                      render: (_: any, r: any) => r.user?.email || r.email,
                    },
                  ]}
                />
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );
}
