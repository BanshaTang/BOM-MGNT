import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Input, Select, Space, Tag, Spin } from 'antd';
import { getMaterials, getCategories, getProducts } from '../utils/api';

const { Search } = Input;
const { Option } = Select;

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [priceSort, setPriceSort] = useState(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getMaterials();
      console.log('获取的物料数据:', data);
      setMaterials(data);
      console.log('当前物料状态:', materials);
    } catch (error) {
      console.error('获取物料详情失败:', error);
      setError(true);
      message.error('获取物料详情失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log('获取的类目数据:', data);
        const categoryMap = data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        console.log('类目映射:', categoryMap);
        setCategories(categoryMap);
      } catch (error) {
        console.error('获取类目失败:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const productMap = data.reduce((acc, product) => {
          acc[product.id] = product.name;
          return acc;
        }, {});
        console.log('产品映射:', productMap);
        setProducts(productMap);
      } catch (error) {
        console.error('获取产品失败:', error);
      }
    };

    fetchMaterials();
    fetchCategories();
    fetchProducts();
  }, [fetchMaterials]);

  const filteredMaterials = materials.filter(material => 
    material.name && material.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAndSortedMaterials = filteredMaterials
    .sort((a, b) => {
      if (!priceSort) return 0;
      if (priceSort === 'asc') return a.costPrice - b.costPrice;
      return b.costPrice - a.costPrice;
    });

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (error) {
    return <div>发生错误，请重试。</div>;
  }

  return (
    <div>
       <h1>物料列表</h1>
      <Space style={{ marginBottom: 20 }}>
        <Search
          placeholder="搜索物料名称或料号"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
        <Select
          value={priceSort}
          onChange={setPriceSort}
          style={{ width: 200 }}
          placeholder="价格排序"
        >
          <Option value={null}>默认排序</Option>
          <Option value="asc">价格从低到高</Option>
          <Option value="desc">价格从高到低</Option>
        </Select>
        <span>
          找到 {filteredAndSortedMaterials.length} 个物料
        </span>
      </Space>

      <List
        grid={{ 
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={filteredAndSortedMaterials}
        renderItem={material => (
          <List.Item key={material.id}>
            <Card
              hoverable
              cover={
                material.imageUrl && (
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    style={{ height: 200 }}
                  />
                )
              }
              onClick={() => {
                setSelectedMaterial(material);
                console.log(`选择物料: ${material.name}`);
                console.log('当前物料的产品 ID:', material.productIds);
              }}
            >
              <Card.Meta
                title={`${material.name || '未命名'} | ${material.nameID || '未命名'}`}
                description={
                  <>
                    <p>料号: {material.bomCode}</p>
                    <p>用量: {material.usage}</p>
                    <p>成本价: {material.costPrice}</p>
                    <p>印尼提货价: {material.idSupplierPrice}</p>
                    <p>澳门提货价: {material.maSupplierPrice}</p>
                    <p>印尼零售价: {material.idRetailPrice}</p>
                    <p>澳门零售价: {material.maRetailPrice}</p>
                    <Tag color="green">成本价: {material.costPrice || '未定'}</Tag>
                    {material.maRetailPrice && (
                      <Tag color="blue">澳门零售价: {material.maRetailPrice}</Tag>
                    )}
                    {material.idRetailPrice && (
                      <Tag color="purple">印尼零售价: {material.idRetailPrice}</Tag>
                    )}
                    <Tag color="blue">
                      关联类目: {material.categoryIds.map(id => categories[id] || '未知').join(', ') || '无'}
                    </Tag>
                    <div style={{ margin: '10px 0' }}>
                      <strong>关联产品:</strong>
                      <ul>
                        {material.productIds.length > 0 ? (
                          material.productIds.map(id => (
                            <li key={id}>{products[id] || '未知'}</li>
                          ))
                        ) : (
                          <li>无</li>
                        )}
                      </ul>
                    </div>
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

export default Materials; 