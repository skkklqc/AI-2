# 在线访问

**薪资计算器：** http://1.117.70.56:3001

---

# Salary Calculator · 薪资计算器

Node.js + React 全栈项目，用于计算税后收入、扣除房租后的剩余收入，以及真实时薪。支持两组 offer 对比。

## 功能

- 输入月薪、年终奖、五险一金比例、平均工作时长、城市
- 按中国个税规则计算税后收入
- 按城市估算平均房租
- 支持两组方案对比（时薪、年薪、去房租收入等）
- 可视化月薪构成与对比条形图

## 项目结构

```
├── backend/          # Express API
├── frontend/         # React + Vite 前端
├── deploy/           # 部署脚本
└── package.json
```

## 本地运行

```bash
# 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 一键启动（构建前端 + 启动后端）
cd ..
npm start
```

浏览器访问 http://localhost:3001

## API

`POST /calculate`

请求体：

```json
{
  "items": [
    {
      "monthlySalary": 20000,
      "yearEndBonus": 50000,
      "socialInsuranceRatio": 22,
      "averageWorkHours": 8,
      "region": "北京市-北京市"
    }
  ]
}
```

## 服务器部署

```bash
npm start
```

使用 PM2 时参考 `deploy/ecosystem.config.cjs`。

## 技术栈

- 后端：Node.js、Express
- 前端：React、Vite
- 进程管理：PM2
