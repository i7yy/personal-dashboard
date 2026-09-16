// src/api.js

// 模拟真实人类活动算法的“步数引擎”
export function generateRealisticSteps() {
  const now = new Date();
  const hour = now.getHours();
  const STORAGE_KEY = 'dashboard_daily_steps';
  
  // 1. 尝试从本地存储读取（模拟真实的一天累积）
  let currentData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!currentData || currentData.date !== now.toDateString()) {
    // 如果是新的一天，初始化一个起始步数（比如早上8点前步数很少）
    let initialSteps = hour < 8 ? Math.floor(Math.random() * 500) : 2000;
    currentData = { date: now.toDateString(), steps: initialSteps };
  }

  // 2. 随机游走算法：步数在 -50 到 +150 之间波动（模拟走路/打字等活动）
  // 晚上11点后到早上6点不增长，模拟睡觉
  if (hour >= 6 && hour < 23) {
    const delta = Math.floor(Math.random() * 200) - 50; 
    currentData.steps += delta;
  }
  
  // 保证步数不会为负
  if (currentData.steps < 0) currentData.steps = 0;
  
  // 3. 持久化存储，刷新页面不丢失
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

  // 4. 计算运动时间（步数 / 125 估算分钟数，大概 125步/分钟）
  const exerciseMinutes = Math.floor(currentData.steps / 125);

  return {
    steps: currentData.steps,
    exerciseMinutes: exerciseMinutes
  };
}

// 天气获取逻辑
export async function fetchWeather() {
  try {
    const response = await fetch('https://api.vvhan.com/api/weather?city=济南');
    if (!response.ok) throw new Error('网络异常');
    const data = await response.json();
    return { city: data.city, temp: data.data.tem, weather: data.data.wea };
  } catch (error) {
    return { city: '济南', temp: '25', weather: '晴（模拟）' };
  }
}