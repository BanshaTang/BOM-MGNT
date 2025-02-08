import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Input, Space, Tag } from 'antd';
import { getCategories } from '../utils/api';
import CategoryDetailModal from '../components/CategoryDetailModal';
import LoadingState from '../components/LoadingState';
import ErrorRetry from '../components/ErrorRetry';

const { Search } = Input;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('获取物料分类失败:', error);
      setError(true);
      message.error('获取物料分类失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorRetry onRetry={fetchCategories} />;
  }

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 20 }}>
        <Search
          placeholder="搜索分类名称或描述"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
        <div>
          找到 {filteredCategories.length} 个分类
        </div>
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
        dataSource={filteredCategories}
        renderItem={category => (
          <List.Item>
            <Card 
              hoverable
              onClick={() => setSelectedCategory(category)}
            >
              <Card.Meta
                title={category.name}
                description={
                  <>
                    <p>{category.description}</p>
                    <Tag color="blue">
                      关联物料: {category.materialIds?.length || 0}
                    </Tag>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <CategoryDetailModal
        category={selectedCategory}
        visible={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </div>
  );
};

export default Categories; 