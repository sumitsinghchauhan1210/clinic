import { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Select, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../api/client';
import type { Visit, Clinician, Patient, CreateVisitDto } from '../types';

export default function VisitsPage() {
  const [data, setData] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filterClinicianId, setFilterClinicianId] = useState<number | undefined>();
  const [filterPatientId, setFilterPatientId] = useState<number | undefined>();
  const [form] = Form.useForm<CreateVisitDto>();

  const loadVisits = async () => {
    setLoading(true);
    try {
      const res = await api.getVisits({
        page,
        limit,
        clinicianId: filterClinicianId,
        patientId: filterPatientId,
      });
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        api.getClinicians({ page: 1, limit: 100 }),
        api.getPatients({ page: 1, limit: 100 }),
      ]);
      setClinicians(cRes.data);
      setPatients(pRes.data);
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to load clinicians/patients');
    }
  };

  useEffect(() => {
    loadVisits();
  }, [page, limit, filterClinicianId, filterPatientId]);

  useEffect(() => {
    loadOptions();
  }, []);

  const onFinish = async (values: CreateVisitDto) => {
    setSubmitting(true);
    try {
      await api.createVisit(values);
      message.success('Visit created');
      setModalOpen(false);
      form.resetFields();
      loadVisits();
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to create visit');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Date & time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (v: string) => (v ? new Date(v).toLocaleString() : '—'),
    },
    {
      title: 'Clinician',
      key: 'clinician',
      render: (_: unknown, r: Visit) => r.clinician?.name ?? '—',
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: unknown, r: Visit) =>
        r.patient ? [r.patient.firstName, r.patient.lastName].filter(Boolean).join(' ') : '—',
    },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Visits</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Select
            placeholder="Filter by clinician"
            allowClear
            style={{ minWidth: 180 }}
            value={filterClinicianId}
            onChange={setFilterClinicianId}
            options={clinicians.map((c) => ({ label: c.name, value: c.id }))}
            onDropdownVisibleChange={(open) => open && loadOptions()}
          />
          <Select
            placeholder="Filter by patient"
            allowClear
            style={{ minWidth: 180 }}
            value={filterPatientId}
            onChange={setFilterPatientId}
            options={patients.map((p) => ({
              label: `${p.firstName} ${p.lastName || ''}`.trim() || p.email,
              value: p.id,
            }))}
            onDropdownVisibleChange={(open) => open && loadOptions()}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Add Visit
          </Button>
        </div>
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
          showTotal: (t) => `Total ${t} visits`,
          onChange: setPage,
        }}
      />
      <Modal
        title="New Visit"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="clinicianId" label="Clinician" rules={[{ required: true }]}>
            <Select
              placeholder="Select clinician"
              options={clinicians.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
          <Form.Item name="patientId" label="Patient" rules={[{ required: true }]}>
            <Select
              placeholder="Select patient"
              options={patients.map((p) => ({
                label: `${p.firstName} ${p.lastName || ''}`.trim() || p.email,
                value: p.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Visit notes (optional)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Create Visit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
