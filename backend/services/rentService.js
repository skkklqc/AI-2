const MOCK_RENTS = {
  '北京市-北京市': 6500,
  '上海市-上海市': 6000,
  '广东省-广州市': 3500,
  '广东省-深圳市': 4500,
  '浙江省-杭州市': 3200,
  '四川省-成都市': 2200,
  '湖北省-武汉市': 2000,
  '江苏省-南京市': 2800,
  '江苏省-苏州市': 2600,
  '陕西省-西安市': 1800,
  '重庆市-重庆市': 1900,
  '天津市-天津市': 2500,
  '福建省-厦门市': 3000,
  '湖南省-长沙市': 1700,
  '河南省-郑州市': 1600,
  '山东省-青岛市': 2200,
  '辽宁省-大连市': 2000,
  '云南省-昆明市': 1500,
  '黑龙江省-哈尔滨市': 1200,
  '安徽省-合肥市': 1800,
};

const DEFAULT_RENT = 2000;

async function callLlmForRent(region) {
  const apiKey = process.env.LLM_API_KEY;
  const apiUrl =
    process.env.LLM_API_URL ||
    'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '你是一个中国城市房租数据助手。用户会提供省-市格式的地区，请只返回一个数字，表示该地区一居室或合租房的平均月租金（人民币，元），不要返回其他文字。',
          },
          {
            role: 'user',
            content: `请估算 ${region} 的平均月房租（元），只返回数字。`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    const rent = parseFloat(text?.replace(/[^\d.]/g, ''));

    if (Number.isFinite(rent) && rent > 0) {
      return Math.round(rent);
    }

    return null;
  } catch {
    return null;
  }
}

async function getAverageRent(region) {
  const llmRent = await callLlmForRent(region);
  if (llmRent !== null) {
    return llmRent;
  }

  return MOCK_RENTS[region] ?? DEFAULT_RENT;
}

module.exports = { getAverageRent, MOCK_RENTS };
