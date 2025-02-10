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
  const [selectedCategory, setSelectedCategory] = useState(null); // 新增状态

  // 获取当前用户信息
  const username = localStorage.getItem('username'); // 获取当前用户名
  const isAdmin = username === 'admin';
  const isUser = username === 'user1'; // 假设 user1 是 user_id
  const isUserMA = username === 'user_ma'; // 假设 user_ma 是 user_ma

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getMaterials();
      console.log('获取的物料数据:', data);
      setMaterials(data);
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
        const categoryMap = data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
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
  const filteredByCategory = selectedCategory 
    ? filteredMaterials.filter(material => material.categoryIds.includes(selectedCategory))
    : filteredMaterials;
  const filteredAndSortedMaterials = filteredByCategory
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

  const renderPriceTags = (material) => {
    const tags = [];

    if (isAdmin) {
      tags.push(<p key="costPrice">成本价: {material.costPrice}</p>);
      tags.push(<p key="macauPickupPrice">澳门提货价: {material.maSupplierPrice}</p>);
      tags.push(<p key="indonesiaPickupPrice">印尼提货价: {material.idSupplierPrice}</p>);
      tags.push(<p key="macauRetailPrice">澳门零售价: {material.maRetailPrice}</p>);
      tags.push(<p key="indonesiaRetailPrice">印尼零售价: {material.idRetailPrice}</p>);
    } else if (username === 'user_id') { // 针对 user_id 用户
      // user_id 用户隐藏成本价、澳门提货价和澳门零售价
      // 只显示印尼提货价和印尼零售价
      if (material.idSupplierPrice) {
        tags.push(<p key="indonesiaPickupPriceTag">印尼提货价: {material.idSupplierPrice}</p>);
      }
      if (material.idRetailPrice) {
        tags.push(<p key="indonesiaRetailPriceTag">印尼零售价: {material.idRetailPrice}</p>);
      }
    } else if (isUserMA) { // 针对 user_ma 用户
      // user_ma 用户隐藏成本价、印尼提货价和印尼零售价
      // 只显示澳门提货价和澳门零售价
      tags.push(<p key="macauPickupPriceTag">澳门提货价: {material.maSupplierPrice}</p>);
      tags.push(<p key="macauRetailPriceTag">澳门零售价: {material.maRetailPrice}</p>);
      // 隐藏印尼提货价和印尼零售价
      // 不再添加印尼提货价和印尼零售价的显示逻辑
    }

    return tags;
  };

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
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: 200 }}
          placeholder="筛选类目"
        >
          <Option value={null}>所有类目</Option>
          {Object.entries(categories).map(([id, name]) => (
            <Option key={id} value={id}>{name}</Option>
          ))}
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
                    {renderPriceTags(material)}
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