# 📊 个人数据生活仪表盘 (Personal Dashboard)

> 🚀 **在线体验**：[点击这里访问线上项目](https://i7yy.cn)
> 👨‍💻 **作者**：侯若轩 | **技术栈**：Vite + ECharts + 原生 JavaScript (ES6+) + CSS3

## ✨ 项目亮点
- **实时数据引擎**：基于随机游走算法，结合 `localStorage` 实现步数与运动时间的本地持久化与 5 秒实时刷新。
- **多源数据聚合**：接入第三方天气、星座运势、黄历 API，采用 `async/await` 与错误降级策略保证页面稳定。
- **沉浸式交互体验**：全屏烟花+横幅开场动画，支持点击任意位置跳过，并带有 10 秒兜底防卡死机制。
- **视觉与性能优化**：随机撞色背景、毛玻璃卡片 UI、暗色模式切换，并通过优化渲染频率减轻浏览器负担。

## 📸 界面截图


| 白天模式 (随机撞色) | 夜间模式 |
| :---: | :---: |
|  <img width="1855" height="1066" alt="image" src="https://github.com/user-attachments/assets/b8552321-718c-46f1-9be7-9b294c2227bc" />
| <img width="1492" height="987" alt="image" src="https://github.com/user-attachments/assets/e2b416f0-8d74-41c1-9537-8af58e9a2d01" />
) |

## 📝 开发日志 (迭代记录) —— 
- **V1.0** 初始化仪表盘，完成基础折线图与饼图
- **V2.0** 引入随机游走算法，实现步数实时动态刷新与本地存储
- **V3.0** 接入天气、星座运势、黄历 API，丰富数据维度
- **V4.0** 新增开场烟花加载屏，支持点击跳过；重构 UI，实现随机撞色与毛玻璃效果

## 🛠 本地运行
```bash
npm install
npm run dev
