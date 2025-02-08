export const getProxiedImageUrl = (originalUrl) => {
  if (!originalUrl) return null;
  
  // 使用另一个代理服务
  const encodedUrl = encodeURIComponent(originalUrl);
  return `https://cors-anywhere.herokuapp.com/${originalUrl}`;
  
  // 如果上面的不行，可以尝试这些备选方案
  // return `https://api.codetabs.com/v1/proxy?quest=${originalUrl}`;
  // return `https://proxy.cors.sh/${originalUrl}`;
};

export const getBase64Image = async (url) => {
  if (!url) return null;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://s1.vika.cn'
      }
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('获取Base64图片失败:', error);
    return null;
  }
}; 