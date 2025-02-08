import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Input, Select, Space } from 'antd';
import { getProducts } from '../utils/api';
import ProductDetailModal from '../components/ProductDetailModal';
import LoadingState from '../components/LoadingState';
import ErrorRetry from '../components/ErrorRetry';
import LazyImage from '../components/LazyImage';

const { Search } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getProducts();
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

  // 获取所有筛选选项
  const markets = ['all', ...new Set(products.map(p => p.market))].filter(Boolean);
  const performances = ['all', ...new Set(products.map(p => p.performance))].filter(Boolean);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.modelName.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.carModel.toLowerCase().includes(searchText.toLowerCase());
    const matchesMarket = marketFilter === 'all' || product.market === marketFilter;
    const matchesPerformance = performanceFilter === 'all' || product.performance === performanceFilter;
    return matchesSearch && matchesMarket && matchesPerformance;
  });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorRetry onRetry={fetchProducts} />;
  }

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="搜索型号名称或车型"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
        <Select 
          value={marketFilter}
          onChange={setMarketFilter}
          style={{ width: 200 }}
          placeholder="选择市场"
        >
          {markets.map(market => (
            <Option key={market} value={market}>
              {market === 'all' ? '所有市场' : market}
            </Option>
          ))}
        </Select>
        <Select
          value={performanceFilter}
          onChange={setPerformanceFilter}
          style={{ width: 200 }}
          placeholder="选择性能"
        >
          {performances.map(performance => (
            <Option key={performance} value={performance}>
              {performance === 'all' ? '所有性能' : performance}
            </Option>
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
                  <LazyImage
                    src={product.imageUrl}
                    alt={product.modelName}
                    style={{ height: 200 }}
                  />
                )
              }
              onClick={() => setSelectedProduct(product)}
            >
              <Card.Meta
                title={product.modelName}
                description={
                  <>
                    <p>车型: {product.carModel}</p>
                    <p>市场: {product.market}</p>
                    <p>性能: {product.performance}</p>
                    <p>关联物料分类: {product.categoryIds?.length || 0}</p>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <ProductDetailModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products; 