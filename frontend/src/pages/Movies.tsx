import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { movies } from '../api';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';

export const Movies: React.FC = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movies.list();
      const moviesList = Array.isArray(response.data?.data) ? response.data.data : [];
      setData(moviesList);
    } catch (error) {
      message.error('Erreur lors du chargement des films');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSave = async (values: Partial<Movie>) => {
    try {
      if (editingId) {
        await movies.update(editingId, values);
        message.success('Film mis à jour');
      } else {
        await movies.create(values);
        message.success('Film créé');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchMovies();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await movies.delete(id);
      message.success('Film supprimé');
      fetchMovies();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (record: Movie) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Durée (min)', dataIndex: 'durationInMinutes', key: 'duration' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Movie) => (
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
        <h2>Films</h2>
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
            Ajouter un film
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
        title={editingId ? 'Modifier le film' : 'Ajouter un film'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Titre" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Durée (minutes)"
            name="durationInMinutes"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
