import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const navItems = [
  { key: '/clinicians', icon: <UserOutlined />, label: 'Clinicians' },
  { key: '/visits', icon: <CalendarOutlined />, label: 'Visits' },
  { key: '/patients', icon: <TeamOutlined />, label: 'Patients' },
];

export default function AppLayout() {
  const location = useLocation();
  const selected = navItems.find((i) => location.pathname.startsWith(i.key))?.key ?? '/clinicians';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: '#001529' }} width={220}>
        <div
          style={{
            height: 64,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 24,
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Clinic
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selected]}
          items={navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <NavLink to={item.key}>{item.label}</NavLink>,
          }))}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
