import * as echarts from 'echarts';
import { generateRealisticSteps, fetchWeather, fetchHoroscope, fetchAlmanac } from './api.js';
import './style.css';

let stepsChart = null;
let sleepChart = null;
let stepsData = [8200, 7500, 9200, 6800, 10300, 8800, 9500];
let isLoaderHidden = false; // 防止重复隐藏

// 白天撞色背景池（随机选择）
const DAY_GRADIENTS = [
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
  'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
  'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
  'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)'
];

function initRandomBackground() {
  const isDark = document.body.classList.contains('dark-mode');
  if (!isDark) {
    const randomGradient = DAY_GRADIENTS[Math.floor(Math.random() * DAY_GRADIENTS.length)];
    document.documentElement.style.setProperty('--bg-gradient', randomGradient);
  } else {
    document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)');
  }
}

function initCharts() {
  const stepsDom = document.getElementById('chart-steps');
  const sleepDom = document.getElementById('chart-sleep');
  if (!stepsDom || !sleepDom) return;

  if (stepsChart) stepsChart.dispose();
  if (sleepChart) sleepChart.dispose();

  stepsChart = echarts.init(stepsDom);
  stepsChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [{ data: stepsData, type: 'line', smooth: true, areaStyle: { opacity: 0.2 } }]
  });

  sleepChart = echarts.init(sleepDom);
  sleepChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: [
        { value: 7.5, name: '睡眠' }, { value: 8, name: '工作/学习' },
        { value: 2, name: '运动' }, { value: 6.5, name: '休闲' }
      ]
    }]
  });

  window.addEventListener('resize', () => {
    if (stepsChart) stepsChart.resize();
    if (sleepChart) sleepChart.resize();
  });
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    initRandomBackground();
    setTimeout(() => {
      if (stepsChart) stepsChart.setOption({ backgroundColor: 'transparent' });
      if (sleepChart) sleepChart.setOption({ backgroundColor: 'transparent' });
    }, 100);
  });
}

async function updateHoroscopeDisplay(sign) {
  const horoscopeBox = document.getElementById('horoscope-box');
  if (!horoscopeBox) return;
  
  horoscopeBox.innerHTML = `<span>正在获取运势...</span>`;
  try {
    const horoscope = await fetchHoroscope(sign);
    horoscopeBox.innerHTML = `
      <span class="horoscope-title">${horoscope.name} · 今日运势</span>
      <span class="horoscope-score">综合 ${horoscope.all}分</span>
      <span class="horoscope-tags">💕 ${horoscope.love} ｜ 💼 ${horoscope.work} ｜ 💰 ${horoscope.money}</span>
      <span class="horoscope-lucky">🍀 幸运色：${horoscope.color} ｜ 幸运数字：${horoscope.number}</span>
      <span class="horoscope-summary">${horoscope.summary}</span>
    `;
  } catch (error) {
    horoscopeBox.innerHTML = `🔮 星座运势获取失败`;
  }
}

function initHoroscopeSelect() {
  const select = document.getElementById('sign-select');
  const STORAGE_KEY = 'dashboard_zodiac_sign';
  
  let savedSign = localStorage.getItem(STORAGE_KEY) || 'aries';
  select.value = savedSign;
  updateHoroscopeDisplay(savedSign);

  select.addEventListener('change', (e) => {
    const selectedSign = e.target.value;
    localStorage.setItem(STORAGE_KEY, selectedSign);
    updateHoroscopeDisplay(selectedSign);
  });
}

async function initRealTimeData() {
  const weatherBox = document.getElementById('weather-box');
  const stepsBox = document.getElementById('steps-box');
  const exerciseBox = document.getElementById('exercise-box');
  const almanacBox = document.getElementById('almanac-box');

  try {
    const weather = await fetchWeather();
    weatherBox.innerHTML = `🌤️ ${weather.city} ${weather.weather} ${weather.temp}℃`;
  } catch (error) { weatherBox.innerHTML = `🌤️ 天气获取失败`; }

  try {
    const almanac = await fetchAlmanac();
    almanacBox.innerHTML = `
      <span class="almanac-date">📅 农历 ${almanac.yinli} · ${almanac.ganzhi} · 属${almanac.shengxiao}</span>
      <span class="almanac-yi">✅ 宜：${almanac.yi.replace(/\|/g, ' · ')}</span>
      <span class="almanac-ji">❌ 忌：${almanac.ji.replace(/\|/g, ' · ')}</span>
      <span class="almanac-wuxing">🌿 五行：${almanac.wuxing}${almanac.jieqi ? ' ｜ 节气：' + almanac.jieqi : ''}</span>
    `;
  } catch (error) { almanacBox.innerHTML = `📅 黄历获取失败`; }

  function updateRealTimeStats() {
    const stats = generateRealisticSteps();
    stepsBox.innerHTML = `👟 今日步数: ${stats.steps}`;
    if (exerciseBox) exerciseBox.innerHTML = `🏃 运动时间: ${stats.exerciseMinutes} 分钟`;

    if (stepsChart) {
      stepsData[stepsData.length - 1] = stats.steps;
      stepsChart.setOption({ series: [{ data: stepsData }] });
    }
  }
  updateRealTimeStats();
  setInterval(updateRealTimeStats, 5000);
}

// 隐藏加载屏（增加防抖，防止重复触发）
function hideLoader() {
  if (isLoaderHidden) return;
  isLoaderHidden = true;
  
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('loader-hidden');
    setTimeout(() => loader.remove(), 1000);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  initRandomBackground();
  initCharts();
  initThemeToggle();
  initHoroscopeSelect();
  
  await initRealTimeData();
  
  // 1. 监听全局点击事件，鼠标点击任意位置跳过加载
  window.addEventListener('click', hideLoader);

  // 2. 兜底方案：如果用户 10 秒都没有点击，自动隐藏（防止页面一直卡着）
  setTimeout(hideLoader, 10000);
});