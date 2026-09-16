import * as echarts from 'echarts';
import { generateRealisticSteps, fetchWeather } from './api.js';
import './style.css';

// 存储图表实例，供实时更新使用
let stepsChart = null;
let sleepChart = null;

// 初始化图表
function initCharts() {
  const stepsDom = document.getElementById('chart-steps');
  const sleepDom = document.getElementById('chart-sleep');
  
  if (!stepsDom || !sleepDom) return;

  // 如果实例已存在，先销毁，防止内存泄漏和重复渲染
  if (stepsChart) stepsChart.dispose();
  if (sleepChart) sleepChart.dispose();

  // 1. 步数趋势图（折线图）
  stepsChart = echarts.init(stepsDom);
  stepsChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [8200, 7500, 9200, 6800, 10300, 8800, 9500],
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.2 }
    }]
  });

  // 2. 时间分配图（饼图）
  sleepChart = echarts.init(sleepDom);
  sleepChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 7.5, name: '睡眠' },
        { value: 8, name: '工作/学习' },
        { value: 2, name: '运动' },
        { value: 6.5, name: '休闲' }
      ]
    }]
  });

  // 窗口大小变化时自适应
  window.addEventListener('resize', () => {
    if (stepsChart) stepsChart.resize();
    if (sleepChart) sleepChart.resize();
  });
}

// 暗色/亮色模式切换
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // 重新渲染图表以适应颜色变化
    initCharts(); 
  });
}

// 初始化实时数据（核心升级部分）
async function initRealTimeData() {
  const weatherBox = document.getElementById('weather-box');
  const stepsBox = document.getElementById('steps-box');
  const exerciseBox = document.getElementById('exercise-box');

  // 1. 获取天气（异步请求 + 错误降级）
  try {
    const weather = await fetchWeather();
    weatherBox.innerHTML = `🌤️ ${weather.city} ${weather.weather} ${weather.temp}℃`;
  } catch (error) {
    weatherBox.innerHTML = `🌤️ 天气获取失败`;
  }

  // 2. 获取实时步数与运动时间，并同步更新 ECharts 图表
  function updateRealTimeStats() {
    const stats = generateRealisticSteps();
    
    // 更新文本标签
    stepsBox.innerHTML = `👟 今日步数: ${stats.steps}`;
    if (exerciseBox) {
      exerciseBox.innerHTML = `🏃 运动时间: ${stats.exerciseMinutes} 分钟`;
    }

    // 让左侧的折线图数据也实时变化！
    if (stepsChart) {
      const currentOption = stepsChart.getOption();
      const currentDataArray = currentOption.series[0].data;
      // 将数组最后一个值替换为当前的实时步数
      currentDataArray[currentDataArray.length - 1] = stats.steps;
      
      stepsChart.setOption({
        series: [{ data: currentDataArray }]
      });
    }
  }

  // 立即执行一次
  updateRealTimeStats();
  
  // 每 3 秒更新一次（模拟实时数据流）
  setInterval(updateRealTimeStats, 3000);
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initThemeToggle();
  initRealTimeData();
});