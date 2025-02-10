import React, { useState, useEffect, useCallback } from 'react';
import { List, Card, message, Spin, Tag } from 'antd';
import { getCategories } from '../utils/api';
// import CategoryDetailModal from '../components/CategoryDetailModal';
// import LoadingState from '../components/LoadingState';
// import ErrorRetry from '../components/ErrorRetry';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      console.log('获取的分类数据:', data);
      setCategories(data);
    } catch (error) {
      console.error('获取物料分类失败:', error);
      setError(error.message);
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
    return <div>错误: {error}</div>;
  }

  console.log('当前类别:', categories); // 打印当前类别
  console.log('渲染的类别:', categories.map(category => category.name)); // 打印渲染的类别名称

  const renderItem = (record) => {
    const name = record.fields ? record.fields.Name : '未提供';

    // return (
    //   <List.Item key={record.id}>
    //     <Card 
    //       hoverable
    //       onClick={() => console.log(`选择分类: ${name}`)}
    //     >
    //       <Card.Meta
    //         title={name}
    //         description={
    //           <>
    //             <Tag color="blue">
    //               包含物料数量: {record.fields?.Materials?.length || 0}
    //             </Tag>
    //           </>
    //         }
    //       />
    //     </Card>
    //   </List.Item>
    // );
  };

  return (
    <div>
      <h1>类别列表</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {categories
          .filter(record => record.name && record.name !== '未提供')
          .map(record => {
            console.log(`类别: ${record.name}, 物料数量: ${record.materials.length || 0}`); // 打印物料数量
            return (
              <Card key={record.id} style={{ width: 300, margin: '10px' }}>
                <Card.Meta
                  title={record.name}
                  description={
                    <>
                      <Tag color="blue">
                        包含物料数量: {record.materials.length || 0}
                      </Tag>
                    </>
                  }
                />
              </Card>
            );
          })}
      </div>
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
        renderItem={renderItem}
      />
    </div>
  );
};

export default Categories; 