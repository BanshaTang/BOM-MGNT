import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Select, Space } from 'antd';
import { getProducts } from '../utils/api';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedType, setSelectedType] = useState(''); // 车型筛选
  const [selectedColor, setSelectedColor] = useState(''); // 颜色筛选

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getProducts();
      console.log(data); // 添加调试信息
      setProducts(data);
    } catch (error) {
      console.error('获取产品列表失败:', error);
      setError(true);
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log(products); // 添加调试信息

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>发生错误，请重试。</div>;
  }

  if (products.length === 0) {
    return <div>没有找到产品。</div>;
  }

  // 获取所有车型和颜色选项
  const types = [...new Set(products.map(p => p.type))];
  const colors = [...new Set(products.map(p => p.color))];

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesType = selectedType ? product.type === selectedType : true;
    const matchesColor = selectedColor ? product.color === selectedColor : true;
    return matchesType && matchesColor;
  });

  return (
    <div>
      <h1>产品列表</h1>
      <Space style={{ marginBottom: 20 }}>
        <Select
          placeholder="选择车型"
          onChange={value => setSelectedType(value)}
          style={{ width: 200 }}
        >
          <Option value="">所有车型</Option>
          {types.map(type => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Select>
        <Select
          placeholder="选择颜色"
          onChange={value => setSelectedColor(value)}
          style={{ width: 200 }}
        >
          <Option value="">所有颜色</Option>
          {colors.map(color => (
            <Option key={color} value={color}>{color}</Option>
          ))}
        </Select>
      </Space>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={filteredProducts}
        renderItem={product => (
          <List.Item>
            <Card
              hoverable
              cover={
                product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.modelName}
                    style={{ height: 200 }}
                  />
                )
              }
            >
              <Card.Meta
                title={product.modelName}
                description={
                  <>
                    <p>车型: {product.type || '未提供'}</p>
                    <p>市场: {product.market}</p>
                    <p>性能: {product.specs || '未提供'}</p>
                    <p>颜色: {product.color || '未提供'}</p>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Products; 