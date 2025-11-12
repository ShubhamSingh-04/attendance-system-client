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
import {
  createSubject,
  deleteSubject,
  listClasses,
  listSubjects,
} from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

export default function Subjects() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [classOptions, setClassOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listSubjects();
      setData(res.subjects || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await listClasses();
        const opts = (res.classes || []).map((c: any) => ({
          label: `${c.name} (${c.classCode || c.code})`,
          value: c.classCode || c.code,
        }));
        setClassOptions(opts);
      } catch (e) {
        // non-blocking
      }
    })();
  }, []);

  const onCreate = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createSubject(values);
      message.success('Created');
      setModalOpen(false);
      fetchData();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || 'Save failed');
    }
  };

  const onDeleteRow = async (record: any) => {
    try {
      await deleteSubject(record._id);
      message.success('Deleted');
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <BackButton />
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <h3>Subjects</h3>
        <Button type="primary" onClick={onCreate}>
          Add Subject
        </Button>
      </Space>
      <Search
        placeholder="Search by name or subject code"
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
                const code = (s.subjectCode || s.code || '').toLowerCase();
                const q = search.toLowerCase();
                return name.includes(q) || code.includes(q);
              })
            : data
        }
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
              <Space>
                <Button danger onClick={() => onDeleteRow(record)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title="Create Subject"
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
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
        </Form>
      </Modal>
    </Space>
  );
}
