import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/AppLayout';
import CliniciansPage from './pages/CliniciansPage';
import PatientsPage from './pages/PatientsPage';
import VisitsPage from './pages/VisitsPage';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 8,
          colorPrimary: '#1677ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/clinicians" replace />} />
            <Route path="clinicians" element={<CliniciansPage />} />
            <Route path="visits" element={<VisitsPage />} />
            <Route path="patients" element={<PatientsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
