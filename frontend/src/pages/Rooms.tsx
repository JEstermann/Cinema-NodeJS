import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Select,
  message,
  Space,
  Popconfirm,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { rooms } from '../api';
import { Room } from '../types';
import { useAuth } from '../context/AuthContext';

export const Rooms: React.FC = () => {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await rooms.list();
      const roomsList = Array.isArray(response.data?.data) ? response.data.data : [];
      setData(roomsList);
    } catch (error) {
      message.error('Erreur lors du chargement des salles');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSave = async (values: Partial<Room>) => {
    try {
      if (editingId) {
        await rooms.update(editingId, values);
        message.success('Salle mise à jour');
      } else {
        await rooms.create(values);
        message.success('Salle créée');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchRooms();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await rooms.delete(id);
      message.success('Salle supprimée');
      fetchRooms();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (record: Room) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Capacité', dataIndex: 'capacity', key: 'capacity' },
    {
      title: 'État',
      key: 'status',
      render: (_: any, record: Room) => (
        <Space>
          {record.isMaintenance && <Tag color="red">En maintenance</Tag>}
          {record.isAccessible && <Tag color="green">Accessible</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Room) => (
        <Space>
          {isAdmin && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Popconfirm title="Confirmer la suppression?" onConfirm={() => handleDelete(record.id)}>
                <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>Salles</h2>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Ajouter une salle
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={data || []}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Modifier la salle' : 'Ajouter une salle'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Nom" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Standard', value: 'STANDARD' },
              { label: 'Premium', value: 'PREMIUM' },
              { label: 'IMAX', value: 'IMAX' },
            ]} />
          </Form.Item>
          <Form.Item label="Capacité" name="capacity" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="isAccessible" valuePropName="checked">
            <Checkbox>Accessible (PMR)</Checkbox>
          </Form.Item>
          <Form.Item name="isMaintenance" valuePropName="checked">
            <Checkbox>En maintenance</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
