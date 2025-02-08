import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 假设的用户数据，您可以根据需要替换为从数据库或API获取的用户数据
  const validUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: 'user123' }
  ];

  const onFinish = (values) => {
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      const user = validUsers.find(
        u => u.username === values.username && u.password === values.password
      );
      
      if (user) {
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user.username);
        message.success('登录成功！');
        navigate('/'); // 登录成功后跳转到首页
      } else {
        message.error('用户名或密码错误！');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 300 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h2>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 