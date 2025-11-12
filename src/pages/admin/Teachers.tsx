import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  Space,
  message,
  Select,
} from 'antd';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import {
  createTeacher,
  deleteTeacher,
  listClasses,
  listSubjects,
  listTeachers,
  updateTeacher,
} from '../../api/admin';

export default function Teachers() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [subjectOptions, setSubjectOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listTeachers();
      setData(res.teachers || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Load selectable options for subjects and classes
  useEffect(() => {
    (async () => {
      try {
        const [s, c] = await Promise.all([listSubjects(), listClasses()]);
        const sOpts = (s.subjects || []).map((it: any) => ({
          label: `${it.name} (${it.subjectCode || it.code})`,
          value: it.subjectCode || it.code,
        }));
        const cOpts = (c.classes || []).map((it: any) => ({
          label: `${it.name} (${it.classCode || it.code})`,
          value: it.classCode || it.code,
        }));
        setSubjectOptions(sOpts);
        setClassOptions(cOpts);
      } catch (e: any) {
        // Non-blocking
      }
    })();
  }, []);

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const onEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      username: record.user?.username || record.username,
      email: record.user?.email || record.email,
      teacherID: record.teacherID,
      name: record.name,
      subjectCodes: (record.subjects || [])
        .map((s: any) => s?.subjectCode || s?.code)
        .filter(Boolean),
      classCodes: (record.assignedClasses || [])
        .map((c: any) => c?.classCode || c?.code)
        .filter(Boolean),
    });
    setModalOpen(true);
  };
  const onDelete = async (record: any) => {
    try {
      await deleteTeacher(record._id);
      message.success('Deleted');
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const subjectCodesArr: string[] = Array.isArray(values.subjectCodes)
        ? values.subjectCodes
        : [];
      const classCodesArr: string[] = Array.isArray(values.classCodes)
        ? values.classCodes
        : [];

      const createPayload = {
        username: values.username,
        email: values.email,
        password: values.password || 'Password@123',
        teacherID: values.teacherID,
        name: values.name,
        subjects: subjectCodesArr,
        assignedClasses: classCodesArr,
      };

      const updatePayload: any = {
        username: values.username,
        email: values.email,
        teacherID: values.teacherID,
        name: values.name,
        // Preferred keys for edit per backend service
        subjectCodes: subjectCodesArr,
        classCodes: classCodesArr,
        // Also include legacy keys for compatibility
        subjects: subjectCodesArr,
        assignedClasses: classCodesArr,
      };
      if (values.password) updatePayload.password = values.password;

      if (editing) {
        await updateTeacher(editing._id, updatePayload);
        message.success('Updated');
      } else {
        await createTeacher(createPayload);
        message.success('Created');
      }
      setModalOpen(false);
      fetchData();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || 'Save failed');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <BackButton />
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <h3>Teachers</h3>
        <Button type="primary" onClick={onCreate}>
          Add Teacher
        </Button>
      </Space>
      <Search
        placeholder="Search by name, teacher ID, or email"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 420 }}
      />
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={
          search
            ? data.filter((t) => {
                const name = (t.name || '').toLowerCase();
                const tid = (t.teacherID || '').toLowerCase();
                const email = (t.user?.email || t.email || '').toLowerCase();
                const q = search.toLowerCase();
                return name.includes(q) || tid.includes(q) || email.includes(q);
              })
            : data
        }
        scroll={{ x: true }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Teacher ID', dataIndex: 'teacherID' },
          {
            title: 'Email',
            dataIndex: ['user', 'email'],
            render: (_: any, r: any) => r.user?.email || r.email,
          },
          {
            title: 'Actions',
            render: (_: any, record: any) => (
              <Space>
                <Button onClick={() => onEdit(record)}>Edit</Button>
                <Button danger onClick={() => onDelete(record)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? 'Edit Teacher' : 'Create Teacher'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => {
            if (changed.teacherID !== undefined) {
              const tid = changed.teacherID;
              const current = form.getFieldValue('username');
              if (!current || current === form.__lastAutoUsername) {
                form.setFieldsValue({ username: tid });
                // @ts-ignore
                form.__lastAutoUsername = tid;
              }
            }
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="teacherID"
            label="Teacher ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const tid = getFieldValue('teacherID');
                  if (!tid || !value || tid === value) return Promise.resolve();
                  return Promise.reject(
                    new Error('Username must match Teacher ID')
                  );
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            tooltip={
              editing ? 'Leave blank to keep current password' : undefined
            }
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="subjectCodes" label="Subjects">
            <Select
              mode="multiple"
              options={subjectOptions}
              placeholder="Select subjects"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="classCodes" label="Assigned Classes">
            <Select
              mode="multiple"
              options={classOptions}
              placeholder="Select classes"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
