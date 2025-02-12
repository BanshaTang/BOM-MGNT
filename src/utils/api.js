import Airtable from 'airtable';

// 配置常量
const BASE_ID = 'app0FOTiFuW5oLDEX';
const API_KEY = 'patXOiqNFgRkq6ZPy.47c03e7610e9f4b9e8ca2555695789ecc330b49b607afad2c4db97bec0b3f0e6';
const BASE_URL = 'https://api.airtable.com/v0';

// 初始化 Airtable
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

// 表 ID 常量
const TABLE_IDS = {
  PRODUCTS: 'tblbZ4HACIqzQCxrN',
  CATEGORIES: 'tblu09nwcTd2EOUyr',
  MATERIALS: 'tblr2ZoEV91HMXO7C'
};

// 字段 ID 常量
export const FIELD_IDS = {
  // Products 表字段
  NAME: 'fldNagyxNT5xZbPcU',
  TYPE: 'fldEbCVsBllbiZqls',
  SPECS: 'fldAfD90Uc7GM57t9',
  MARKET: 'fldlznPxWI3WxbNDK',
  COLOR: 'fldb83HS86R1UKO5Z',
  IMG: 'fldnACeljAc5EbXXD',
  MATERIALS: 'fld3c6fJHkg1EEaC5',
  
  // Categories 表字段
  CATEGORY_NAME: 'fldIq0ewzF0ULgote',
  CATEGORY_MATERIALS: 'fldL9Bzjl6mgH1DMF',

  // Materials 表字段
  MATERIAL_NAME: 'fldxK3M9akup8wW0p',
  MATERIAL_NAME_ID: 'fldXSWAF0qrYxmjZM',
  MATERIAL_NAME_MO: 'fldhTlgxI2dbweIN7',
  MATERIAL_BOM_CODE: 'fld8HkLU0daoYDPRg',
  MATERIAL_HS_CODE: 'fldhf9AQtwuc6Em0W',
  MATERIAL_CATEGORY: 'flddAPaC26uacMO10',
  MATERIAL_PRODUCT: 'fldCbKwVrpGTqTVlb',
  MATERIAL_IMG: 'fldK0RMkDQpwPXMO3',
  MATERIAL_USAGE: 'flduegj6FNCv8q75m',
  MATERIAL_COST: 'fldqeqk39T8lVAKG5',
  MATERIAL_ID_SUPPLIER_PRICE: 'fld94Tyq4g7YYDdmV',
  MATERIAL_MA_SUPPLIER_PRICE: 'fldf2xCOgNVjCtDSK',
  MATERIAL_ID_RETAIL_PRICE: 'fldoJirWSGkLHi1P3',
  MATERIAL_MA_RETAIL_PRICE: 'fld6v5pp1QvfkQIKQ'
};

// 处理图片附件
const processAttachment = (attachment) => {
  if (!attachment || !attachment.length) return null;
  
  const image = attachment[0];
  return {
    url: image.url,
    thumbnailUrl: image.thumbnails?.small?.url,
    largeThumbnailUrl: image.thumbnails?.large?.url,
    filename: image.filename,
    size: image.size,
    type: image.type,
    width: image.width,
    height: image.height
  };
};

// 获取产品列表
export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/${BASE_ID}/${TABLE_IDS.PRODUCTS}?maxRecords=100&view=Grid%20view`, {
    headers: {
      Authorization: `Bearer ${API_KEY}` // 替换为你的实际 API 密钥
    }
  });
  
  if (!response.ok) {
    throw new Error(`网络错误: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.records)) {
    throw new Error('获取产品数据失败，返回的数据不是数组');
  }

  return data.records.map(record => ({
    id: record.id,
    name: record.fields['Type Name'] || '未提供', // 车型
    color: record.fields.Color || '未提供', // 颜色
    market: record.fields.Market || '未提供', // 市场
    img: record.fields.IMG ? record.fields.IMG[0].url : '', // 确保提取图片 URL
    specs: record.fields.Specs || '未提供', // 性能
    type: record.fields.Type || '未提供' // 类型
  }));
};

// 获取物料分类列表
export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/${BASE_ID}/${TABLE_IDS.CATEGORIES}?maxRecords=100&view=Grid%20view`, {
    headers: {
      Authorization: `Bearer ${API_KEY}` // 替换为你的实际 API 密钥
    }
  });
  
  if (!response.ok) {
    throw new Error(`网络错误: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.records)) {
    throw new Error('获取类别数据失败，返回的数据不是数组');
  }

  return data.records.map(record => {
    console.log('当前记录:', record.fields); // 打印当前记录的字段
    const materials = record.fields['CATEGORY_MATERIALS'] || []; // 提取 CATEGORY_MATERIALS 字段
    console.log('物料 ID:', materials); // 打印物料 ID
    return {
      id: record.id,
      name: record.fields['Name'] || '未提供',
      materials: record.fields['Materials'] || '未提供', // 确保提取为数组
    };
  });
};

// 获取物料详情列表
export const getMaterials = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/${BASE_ID}/${TABLE_IDS.MATERIALS}?maxRecords=100&view=Grid%20view`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('获取的物料记录:', data.records); // 确保记录存在

    return data.records.map(record => {
      console.log('当前记录字段:', record.fields); // 添加调试信息
      return {
        id: record.id,
        name: record.fields['Internal Name'], // 物料名称
        nameID: record.fields['Indonesia Name'], // 物料ID
        nameMO: record.fields['Macau Name'], // 物料MO
        bomCode: record.fields['BOM Code'], // BOM代码
        hsCode: record.fields['HS Code'], // HS代码
        imageUrl: record.fields['IMG']?.[0]?.url, // 图片
        costPrice: record.fields['China Cost'], // 成本
        idSupplierPrice: record.fields['ID Supplier Price'], // 供应商价格ID
        maSupplierPrice: record.fields['MA Supplier Price'], // MA供应商价格
        idRetailPrice: record.fields['ID Retail Price'], // 零售价格ID
        maRetailPrice: record.fields['MA Retail Price'], // MA零售价格
        categoryIds: record.fields['Linked Category'] || [], // 分类
        productIds: record.fields['Linked Product'] || [], // 产品
        usage: record.fields['Usage'], // 用量
        _raw: record
      };
    });
  } catch (error) {
    console.error('获取物料详情错误:', error);
    throw error;
  }
}; 