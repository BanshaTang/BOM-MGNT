import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import Login from './pages/Login';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Materials from './pages/Materials';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/materials" element={<Materials />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App; 