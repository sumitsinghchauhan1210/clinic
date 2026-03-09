import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../api/client';
import type { Patient, CreatePatientDto } from '../types';

const GENDER_OPTIONS = ['male', 'female', 'other', 'unknown'];

const columns = [
  { title: 'First name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  {
    title: 'DOB',
    dataIndex: 'dateOfBirth',
    key: 'dateOfBirth',
    render: (v: string) => (v ? new Date(v).toLocaleDateString() : '—'),
  },
];

export default function PatientsPage() {
  const [data, setData] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CreatePatientDto>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({ page, limit });
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit]);

  const onFinish = async (values: CreatePatientDto) => {
    setSubmitting(true);
    try {
      await api.createPatient(values);
      message.success('Patient added');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to add patient');
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
        <h2 style={{ margin: 0 }}>Patients</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add Patient
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
          showTotal: (t) => `Total ${t} patients`,
          onChange: setPage,
        }}
      />
      <Modal
        title="Add Patient"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="firstName" label="First name" rules={[{ required: true }]}>
            <Input placeholder="John" />
          </Form.Item>
          <Form.Item name="lastName" label="Last name">
            <Input placeholder="Doe" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="john@email.com" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Phone is required' },
              {
                pattern: /^\+?[\d\s\-().]{7,20}$/,
                message: 'Enter a valid phone number (e.g. +1-555-200-3001)',
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
            <Input placeholder="+1-555-200-3001" />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of birth">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              placeholder="Select"
              options={GENDER_OPTIONS.map((o) => ({ label: o, value: o }))}
            />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="123 Main St" />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="zip" label="ZIP">
            <Input />
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
