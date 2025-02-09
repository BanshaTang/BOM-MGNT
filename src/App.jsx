import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Tabs } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Materials from './pages/Materials';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

const { TabPane } = Tabs;

function App() {
  const [activeKey, setActiveKey] = useState("products");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Tabs activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane tab="Products" key="products">
                      <Products />
                    </TabPane>
                    <TabPane tab="Categories" key="categories">
                      <Categories />
                    </TabPane>
                    <TabPane tab="Materials" key="materials">
                      <Materials />
                    </TabPane>
                  </Tabs>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App; 