import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  Space,
  message,
  Upload,
  Select,
} from 'antd';
import Search from 'antd/es/input/Search';
import { UploadOutlined } from '@ant-design/icons';
import {
  createStudent,
  deleteStudent,
  listClasses,
  listStudents,
  updateStudent,
} from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export default function Students() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listStudents();
      setData(res.students || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Load classes for dropdown
  useEffect(() => {
    (async () => {
      try {
        const c = await listClasses();
        const cOpts = (c.classes || []).map((it: any) => ({
          label: `${it.name} (${it.classCode || it.code})`,
          value: it.classCode || it.code,
        }));
        setClassOptions(cOpts);
      } catch (e: any) {
        // ignore
      }
    })();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setFile(null);
    form.resetFields();
    setModalOpen(true);
  };

  const onEdit = (record: any) => {
    setEditing(record);
    setFile(null);
    form.setFieldsValue({
      name: record.name,
      classCode: record.class?.classCode || record.classCode,
      rollNo: record.rollNo,
      semester: record.class?.semester || record.semester,
      username: record.user?.username || record.username,
      email: record.user?.email || record.email,
      phoneNumber: record.phoneNumber,
      password: '', // Clear password field on edit
    });
    setModalOpen(true);
  };

  const onDeleteRow = async (record: any) => {
    try {
      await deleteStudent(record._id);
      message.success('Deleted');
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      if (file) fd.append('studentImage', file);

      if (editing) {
        await updateStudent(editing._id, fd);
        message.success('Updated');
      } else {
        if (!file) {
          message.error('Student image is required.');
          return;
        }
        await createStudent(fd);
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
        <h3>Students</h3>
        <Button type="primary" onClick={onCreate}>
          Add Student
        </Button>
      </Space>
      <Search
        placeholder="Search by name, roll no, or email"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 420 }}
      />
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={
          search
            ? data.filter((s) => {
                const name = (s.name || '').toLowerCase();
                const roll = (s.rollNo || '').toLowerCase();
                const email = (s.user?.email || s.email || '').toLowerCase();
                const q = search.toLowerCase();
                return (
                  name.includes(q) || roll.includes(q) || email.includes(q)
                );
              })
            : data
        }
        scroll={{ x: true }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Roll No', dataIndex: 'rollNo' },
          {
            title: 'Class',
            dataIndex: ['class', 'classCode'],
            render: (_: any, r: any) => r.class?.classCode || r.classCode,
          },
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
                <Button danger onClick={() => onDeleteRow(record)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? 'Edit Student' : 'Create Student'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => {
            if (changed.rollNo !== undefined) {
              const rn = changed.rollNo;
              form.setFieldsValue({ username: rn });
            }
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="classCode"
            label="Class"
            rules={[{ required: true }]}
          >
            <Select
              options={classOptions}
              placeholder="Select class"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="rollNo"
            label="Roll No"
            rules={[{ required: !editing }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="semester"
            label="Semester"
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
                  const rn = getFieldValue('rollNo');
                  if (!rn || !value || rn === value) return Promise.resolve();
                  return Promise.reject(
                    new Error('Username must match Roll No')
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
            rules={[{ type: 'email', required: !editing }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editing }]}
          >
            <Input.Password
              placeholder={
                editing ? '(Leave blank to keep current password)' : ''
              }
            />
          </Form.Item>
          <Form.Item label="Student Image">
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                return false;
              }}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
