import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Spin, Tag } from 'antd';
import { getCategories } from '../utils/api';
// import CategoryDetailModal from '../components/CategoryDetailModal';
// import LoadingState from '../components/LoadingState';
// import ErrorRetry from '../components/ErrorRetry';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCategories();
      console.log('获取的分类数据:', data);
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

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (error) {
    return <div>发生错误，请重试。</div>;
  }

  return (
    <div>
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
        dataSource={categories}
        renderItem={category => (
          <List.Item key={category.id}>
            <Card 
              hoverable
              onClick={() => console.log(`选择分类: ${category.fields.Name}`)}
            >
              <Card.Meta
                title={category.fields.Name}
                description={
                  <>
                    <Tag color="blue">
                      包含物料数量: {category.fields.Materials?.length || 0}
                    </Tag>
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

export default Categories; 