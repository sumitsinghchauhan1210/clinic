import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Switch, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../api/client';
import type { Clinician, CreateClinicianDto } from '../types';

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Specialty', dataIndex: 'specialty', key: 'specialty' },
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (v: boolean) => (v ? 'Yes' : 'No'),
  },
];

export default function CliniciansPage() {
  const [data, setData] = useState<Clinician[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CreateClinicianDto>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getClinicians({ page, limit });
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to load clinicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit]);

  const onFinish = async (values: CreateClinicianDto) => {
    setSubmitting(true);
    try {
      await api.createClinician(values);
      message.success('Clinician added');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to add clinician');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Clinicians</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add Clinician
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: false,
          showTotal: (t) => `Total ${t} clinicians`,
          onChange: setPage,
        }}
      />
      <Modal
        title="Add Clinician"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Dr. Jane Smith" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="jane@clinic.com" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Phone is required' },
              {
                pattern: /^\+?[\d\s\-().]{7,20}$/,
                message: 'Enter a valid phone number (e.g. +1-555-123-4567)',
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const digitCount = value.replace(/\D/g, '').length;
                  if (digitCount < 7 || digitCount > 15) {
                    return Promise.reject('Phone must have 7–15 digits');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="+1-555-123-4567" />
          </Form.Item>
          <Form.Item name="specialty" label="Specialty">
            <Input placeholder="General" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
