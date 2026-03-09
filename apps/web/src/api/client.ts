const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string | number | undefined> } = {}
): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const isJson = init.body && typeof init.body === 'string';
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      Array.isArray(err.message) ? err.message.join(', ') : (err.message ?? res.statusText)
    );
  }
  return res.json();
}

export const api = {
  getClinicians: (params?: { page?: number; limit?: number }) =>
    request<{
      data: import('../types').Clinician[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/clinicians', { params: params as Record<string, number> }),
  createClinician: (body: import('../types').CreateClinicianDto) =>
    request<import('../types').Clinician>('/clinicians', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getPatients: (params?: { page?: number; limit?: number }) =>
    request<{
      data: import('../types').Patient[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/patients', { params: params as Record<string, number> }),
  createPatient: (body: import('../types').CreatePatientDto) =>
    request<import('../types').Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getVisits: (params?: {
    page?: number;
    limit?: number;
    clinicianId?: number;
    patientId?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  }) =>
    request<{
      data: import('../types').Visit[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>('/visits', { params: params as Record<string, string | number> }),
  createVisit: (body: import('../types').CreateVisitDto) =>
    request<import('../types').Visit>('/visits', { method: 'POST', body: JSON.stringify(body) }),
};
