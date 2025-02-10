import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Select, Space, Row, Col, Spin, Alert } from 'antd';
import { getProducts } from '../utils/api';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(''); // 车型筛选
  const [selectedColor, setSelectedColor] = useState(''); // 颜色筛选
  const [selectedSpecs, setSelectedSpecs] = useState(null); // 筛选性能
  const [selectedMarket, setSelectedMarket] = useState(null); // 筛选市场

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      console.log(data); // 添加调试信息
      setProducts(data);
    } catch (error) {
      console.error('获取产品列表失败:', error);
      setError(error.message);
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log(products); // 添加调试信息

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="错误" description={error} type="error" />;

  // 获取所有车型和颜色选项
  const types = [...new Set(products.map(p => p.type))];
  const colors = [...new Set(products.map(p => p.color))];

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesType = selectedType ? product.type === selectedType : true;
    const matchesColor = selectedColor ? product.color === selectedColor : true;
    const matchesSpecs = selectedSpecs ? product.specs === selectedSpecs : true;
    const matchesMarket = selectedMarket ? product.market === selectedMarket : true;
    return matchesType && matchesColor && matchesSpecs && matchesMarket;
  });

  return (
    <div style={{ padding: '20px' }}>
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

        <Select
          placeholder="选择性能"
          onChange={value => setSelectedSpecs(value)}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {Array.from(new Set(products.map(product => product.specs))).map(spec => (
            <Option key={spec} value={spec}>{spec}</Option>
          ))}
        </Select>
        <Select
          placeholder="选择市场"
          onChange={value => setSelectedMarket(value)}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          {Array.from(new Set(products.map(product => product.market))).map(market => (
            <Option key={market} value={market}>{market}</Option>
          ))}
        </Select>
      </Space>

      {/* 产品列表 */}
      <Row gutter={16}>
        {products
          .filter(product => 
            (!selectedSpecs || product.specs === selectedSpecs) &&
            (!selectedMarket || product.market === selectedMarket)
          )
          .map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card 
                title={product.name}
                cover={<img alt={product.name} src={product.img} className="product-image" style={{ padding: '5%' }} />}
                style={{ marginBottom: '20px' }}
              >
                <p>车型: {product.type || '未提供'}</p>
                    <p>市场: {product.market}</p>
                    <p>性能: {product.specs || '未提供'}</p>
                    <p>颜色: {product.color || '未提供'}</p>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Products; 