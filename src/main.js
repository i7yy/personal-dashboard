import * as echarts from 'echarts';
import './style.css';

// 初始化图表
function initCharts() {
  // 1. 步数趋势图（折线图）
  const stepsChart = echarts.init(document.getElementById('chart-steps'));
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
  const sleepChart = echarts.init(document.getElementById('chart-sleep'));
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
    stepsChart.resize();
    sleepChart.resize();
  });
}

// 暗色/亮色模式切换
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // 重新渲染图表以适应颜色变化（简单写法）
    initCharts(); 
  });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initThemeToggle();
});