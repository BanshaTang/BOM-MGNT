import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Input, Select, Space, Tag } from 'antd';
import { getMaterials } from '../utils/api';
import MaterialDetailModal from '../components/MaterialDetailModal';
import LoadingState from '../components/LoadingState';
import ErrorRetry from '../components/ErrorRetry';
import LazyImage from '../components/LazyImage';

const { Search } = Input;
const { Option } = Select;

const Materials = () => {
  const [materials, setMaterials] = useState([]);
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
    fetchMaterials();
  }, [fetchMaterials]);

  const filteredAndSortedMaterials = materials
    .filter(material =>
      material.name.toLowerCase().includes(searchText.toLowerCase()) ||
      material.code.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (!priceSort) return 0;
      if (priceSort === 'asc') return a.costPrice - b.costPrice;
      return b.costPrice - a.costPrice;
    });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorRetry onRetry={fetchMaterials} />;
  }

  return (
    <div>
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
          <List.Item>
            <Card
              hoverable
              cover={
                material.imageUrl && (
                  <LazyImage
                    src={material.imageUrl}
                    alt={material.name}
                    style={{ height: 200 }}
                  />
                )
              }
              onClick={() => setSelectedMaterial(material)}
            >
              <Card.Meta
                title={material.name}
                description={
                  <>
                    <p>料号: {material.code}</p>
                    <Tag color="green">成本价: {material.costPrice}</Tag>
                    {material.moRetailPrice && (
                      <Tag color="blue">澳门零售价: {material.moRetailPrice}</Tag>
                    )}
                    {material.idRetailPrice && (
                      <Tag color="purple">印尼零售价: {material.idRetailPrice}</Tag>
                    )}
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <MaterialDetailModal
        material={selectedMaterial}
        visible={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
      />
    </div>
  );
};

export default Materials; 