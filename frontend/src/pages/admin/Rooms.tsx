import { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Space, message } from 'antd';
import Search from 'antd/es/input/Search';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { createRoom, deleteRoom, listRooms, updateRoom } from '../../api/admin';

export default function Rooms() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listRooms();
      setData(res.rooms || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const onEdit = (record: any) => {
    setEditing(record);
    const firstCam = (record.cameras || [])[0] || {};
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      cameraId: firstCam.cameraId,
      cameraAccessLink: firstCam.cameraAccessLink,
    });
    setModalOpen(true);
  };
  const onDelete = async (record: any) => {
    try {
      await deleteRoom(record._id);
      message.success('Deleted');
      fetchData();
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Delete failed');
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateRoom(editing._id, {
          name: values.name,
          description: values.description,
          camera: {
            cameraId: values.cameraId,
            cameraAccessLink: values.cameraAccessLink,
          },
        });
        message.success('Updated');
      } else {
        // Backend expects `cameras` as an array when creating a room.
        // Convert the single camera fields into a `cameras` array.
        await createRoom({
          name: values.name,
          description: values.description,
          cameras: [
            {
              cameraId: values.cameraId,
              cameraAccessLink: values.cameraAccessLink,
            },
          ],
        });
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
        <h3>Rooms</h3>
        <Button type="primary" onClick={onCreate}>
          Add Room
        </Button>
      </Space>
      <Search
        placeholder="Search by name, camera ID, or description"
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 420 }}
      />
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={
          search
            ? data.filter((r: any) => {
                const name = (r.name || '').toLowerCase();
                const desc = (r.description || '').toLowerCase();
                const camIds = (r.cameras || [])
                  .map((c: any) => c.cameraId || '')
                  .join(' ')
                  .toLowerCase();
                const q = search.toLowerCase();
                return (
                  name.includes(q) || desc.includes(q) || camIds.includes(q)
                );
              })
            : data
        }
        scroll={{ x: true }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          {
            title: 'Cameras',
            dataIndex: 'cameras',
            render: (cams: any[]) => cams?.length ?? 0,
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
        title={editing ? 'Edit Room' : 'Create Room'}
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
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cameraId"
            label="Camera ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cameraAccessLink"
            label="Camera Access Link"
            rules={[{ required: true }]}
          >
            <Input placeholder="http://..." />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
