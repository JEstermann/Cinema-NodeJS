import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Spin } from 'antd';
import { LogoutOutlined, UserOutlined, VideoCameraOutlined, BgColorsOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Auth';
import { Movies } from './pages/Movies';
import { Rooms } from './pages/Rooms';
import { Dashboard } from './pages/Dashboard';
import './App.css';

const { Header, Content, Footer } = Layout;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, loading, logout, user } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  const userMenu = {
    items: [
      {
        label: `Déconnexion`,
        key: 'logout',
        icon: <LogoutOutlined />,
        onClick: async () => {
          await logout();
          window.location.href = '/login';
        },
      },
    ],
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', margin: 0 }}>🎬 Cinema</h1>
          <Dropdown menu={userMenu}>
            <Button icon={<UserOutlined />}>
              {user?.email}
            </Button>
          </Dropdown>
        </Header>

        <Layout>
          <Layout.Sider width={200} theme="light" collapsible>
            <Menu
              mode="inline"
              style={{ height: '100%' }}
              items={[
                {
                  label: 'Tableau de bord',
                  key: '/dashboard',
                  icon: <DashboardOutlined />,
                  onClick: () => window.location.href = '/dashboard',
                },
                {
                  label: 'Films',
                  key: '/movies',
                  icon: <VideoCameraOutlined />,
                  onClick: () => window.location.href = '/movies',
                },
                {
                  label: 'Salles',
                  key: '/rooms',
                  icon: <BgColorsOutlined />,
                  onClick: () => window.location.href = '/rooms',
                },
              ]}
            />
          </Layout.Sider>

          <Layout>
            <Content style={{ padding: '24px' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '2px' }}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
              Cinema © 2026 - Gestion de cinéma
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
