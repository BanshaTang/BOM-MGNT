import Airtable from 'airtable';

// 配置常量
const BASE_ID = 'app0FOTiFuW5oLDEX';
const API_KEY = 'patXOiqNFgRkq6ZPy.47c03e7610e9f4b9e8ca2555695789ecc330b49b607afad2c4db97bec0b3f0e6';

// 初始化 Airtable
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

// 表 ID 常量
const TABLE_IDS = {
  PRODUCTS: 'tblbZ4HACIqzQCxrN',
  CATEGORIES: 'tblu09nwcTd2EOUyr',
  MATERIALS: 'tblr2ZoEV91HMX07C'
};

// 字段 ID 常量
const FIELD_IDS = {
  // Products 表字段
  NAME: 'fldNagyxNT',
  TYPE: 'fldEbCVsBl',
  SPECS: 'fldAfD90Uc',
  MARKET: 'fldlznPxWI3WxbNDK',
  COLOR: 'fldb83HS86R1UKOSZ',
  IMG: 'fldnACeljAc5EbXXD',
  MATERIALS: 'fld3c6fJHkglEEaC5',
  
  // Categories 表字段
  CATEGORY_NAME: 'fldIq0ewzF0ULgote',
  CATEGORY_MATERIALS: 'fldL9BzjlGmgHlDMF',

  // Materials 表字段
  MATERIAL_NAME: 'fldxK3M9akup8wW0p',
  MATERIAL_NAME_ID: 'fldXSWAF0qrYxmjZM',
  MATERIAL_NAME_MO: 'fldhTlgxI2dbeJN7',
  MATERIAL_BOM_CODE: 'fld8HkLU0daoDPRg',
  MATERIAL_HS_CODE: 'fldhf9AQtwuc6Em0W',
  MATERIAL_CATEGORY: 'flddAPaC26uacM0l0',
  MATERIAL_PRODUCT: 'fldCbKwVrpGTqTVlb',
  MATERIAL_IMG: 'fldK0RMkDQpwPXM03',
  MATERIAL_USAGE: 'flduegj6FNCv8q75m',
  MATERIAL_COST: 'fldqeqk39T8lVAKG5',
  MATERIAL_ID_SUPPLIER_PRICE: 'fld94Tyq4g7YYDdmV',
  MATERIAL_MA_SUPPLIER_PRICE: 'fldf2xC0gNVjCtDSK',
  MATERIAL_ID_RETAIL_PRICE: 'fldoJ1rWSGKLHi1P3',
  MATERIAL_MA_RETAIL_PRICE: 'fld6v5pp1QvfkQ1KQ'
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
  try {
    console.log('开始获取产品列表，Base ID:', BASE_ID);
    const records = await base(TABLE_IDS.PRODUCTS)
      .select({
        maxRecords: 100,
        view: 'Grid view'
      })
      .all();

    return records.map(record => ({
      id: record.id,
      modelName: record.get(FIELD_IDS.NAME),
      type: record.get(FIELD_IDS.TYPE),
      specs: record.get(FIELD_IDS.SPECS),
      market: record.get(FIELD_IDS.MARKET),
      color: record.get(FIELD_IDS.COLOR),
      imageUrl: record.get(FIELD_IDS.IMG)?.[0]?.url,
      materialIds: record.get(FIELD_IDS.MATERIALS) || [],
      _raw: record
    }));
  } catch (error) {
    console.error('获取产品列表错误:', error, '使用的 Base ID:', BASE_ID);
    throw error;
  }
};

// 获取物料分类列表
export const getCategories = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/${BASE_ID}/${TABLE_IDS.CATEGORIES}?maxRecords=100&view=Grid%20view`,
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
    return data.records.map(record => ({
      id: record.id,
      name: record.fields[FIELD_IDS.CATEGORY_NAME],
      materialIds: record.fields[FIELD_IDS.CATEGORY_MATERIALS] || [],
      _raw: record
    }));
  } catch (error) {
    console.error('获取物料分类错误:', error);
    throw error;
  }
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
    return data.records.map(record => ({
      id: record.id,
      name: record.fields[FIELD_IDS.MATERIAL_NAME],
      nameID: record.fields[FIELD_IDS.MATERIAL_NAME_ID],
      nameMO: record.fields[FIELD_IDS.MATERIAL_NAME_MO],
      bomCode: record.fields[FIELD_IDS.MATERIAL_BOM_CODE],
      hsCode: record.fields[FIELD_IDS.MATERIAL_HS_CODE],
      imageUrl: record.fields[FIELD_IDS.MATERIAL_IMG]?.[0]?.url,
      costPrice: record.fields[FIELD_IDS.MATERIAL_COST],
      idSupplierPrice: record.fields[FIELD_IDS.MATERIAL_ID_SUPPLIER_PRICE],
      maSupplierPrice: record.fields[FIELD_IDS.MATERIAL_MA_SUPPLIER_PRICE],
      idRetailPrice: record.fields[FIELD_IDS.MATERIAL_ID_RETAIL_PRICE],
      maRetailPrice: record.fields[FIELD_IDS.MATERIAL_MA_RETAIL_PRICE],
      categoryIds: record.fields[FIELD_IDS.MATERIAL_CATEGORY] || [],
      productIds: record.fields[FIELD_IDS.MATERIAL_PRODUCT] || [],
      _raw: record
    }));
  } catch (error) {
    console.error('获取物料详情错误:', error);
    throw error;
  }
}; 