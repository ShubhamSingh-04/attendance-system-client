import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Space, message, Row, Col, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createClass, deleteClass, listClasses } from '../../api/admin';

export default function Classes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listClasses();
      setData(res.classes || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const onCreate = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createClass(values);
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
      await deleteClass(record._id);
      message.success('Deleted');
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <h3>Classes</h3>
        <Button type="primary" onClick={onCreate}>Add Class</Button>
      </Space>
      <Row gutter={[16, 16]}>
        {data.map((c) => (
          <Col xs={24} sm={12} md={8} lg={6} key={c._id}>
            <Card
              hoverable
              loading={loading}
              onClick={() => navigate(`/admin/classes/${c._id}`)}
            >
              <Typography.Title level={5} style={{ marginBottom: 4 }}>{c.name}</Typography.Title>
              <Typography.Text type="secondary">Code: {c.classCode}</Typography.Text>
              <div style={{ marginTop: 12 }}>
                <Button danger size="small" onClick={(e) => { e.stopPropagation(); onDeleteRow(c); }}>Delete</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Create Class"
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="classCode" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}


