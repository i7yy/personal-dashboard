// src/api.js

// 星座名称映射，用于接口失败时提供正确的降级数据
const ZODIAC_NAMES = {
  aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座',
  leo: '狮子座', virgo: '处女座', libra: '天秤座', scorpio: '天蝎座',
  sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座'
};

// 模拟真实人类活动算法的“步数引擎”
export function generateRealisticSteps() {
  const now = new Date();
  const hour = now.getHours();
  const STORAGE_KEY = 'dashboard_daily_steps';
  
  let currentData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!currentData || currentData.date !== now.toDateString()) {
    let initialSteps = hour < 8 ? Math.floor(Math.random() * 500) : 2000;
    currentData = { date: now.toDateString(), steps: initialSteps };
  }

  if (hour >= 6 && hour < 23) {
    const delta = Math.floor(Math.random() * 200) - 50; 
    currentData.steps += delta;
  }
  if (currentData.steps < 0) currentData.steps = 0;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  const exerciseMinutes = Math.floor(currentData.steps / 125);

  return {
    steps: currentData.steps,
    exerciseMinutes: exerciseMinutes
  };
}

// 获取天气
export async function fetchWeather() {
  try {
    const response = await fetch('https://api.vvhan.com/api/weather?city=济南');
    if (!response.ok) throw new Error('网络异常');
    const data = await response.json();
    return { city: data.city, temp: data.data.tem, weather: data.data.wea };
  } catch (error) {
    console.warn('天气接口请求失败，使用模拟数据:', error);
    return { city: '济南', temp: '25', weather: '晴（模拟）' };
  }
}

// 获取星座运势（支持传入星座参数，修复了切换不生效的问题）
export async function fetchHoroscope(sign = 'aries') {
  try {
    const response = await fetch(`https://api.vvhan.com/api/horoscope?type=${sign}&time=today`);
    if (!response.ok) throw new Error('网络异常');
    const data = await response.json();
    return {
      name: data.name,
      all: data.all,
      love: data.love,
      work: data.work,
      money: data.money,
      color: data.color,
      number: data.number,
      summary: data.summary
    };
  } catch (error) {
    console.warn('星座接口请求失败，使用模拟数据:', error);
    // 修复：根据传入的 sign 返回正确的星座名称
    return {
      name: ZODIAC_NAMES[sign] || '白羊座',
      all: '75',
      love: '60',
      work: '70',
      money: '70',
      color: '橙色',
      number: '3',
      summary: '今天适合整理思绪，为接下来的计划做好准备。'
    };
  }
}

// 获取今日黄历
export async function fetchAlmanac() {
  try {
    const response = await fetch('https://cn.apihz.cn/api/time/getday.php?id=88888888&key=88888888');
    if (!response.ok) throw new Error('网络异常');
    const data = await response.json();
    if (data.code !== 200) throw new Error(data.msg || '接口返回异常');
    return {
      yinli: `${data.nyue}${data.nri}`,
      ganzhi: data.ganzhiri,
      shengxiao: data.shengxiao,
      yi: data.yi,
      ji: data.ji,
      jieqi: data.jieqi,
      wuxing: data.riwuxing
    };
  } catch (error) {
    console.warn('黄历接口请求失败，使用模拟数据:', error);
    return {
      yinli: '八月十五',
      ganzhi: '甲子日',
      shengxiao: '龙',
      yi: '祭祀|祈福|出行',
      ji: '动土|开仓',
      jieqi: '白露',
      wuxing: '金'
    };
  }
}