# 部署到 GitHub Pages 指南

## 项目架构

本项目采用 **Local Evaluation + Online Demo Separation** 架构：

- **本地环境**：运行真实评测，生成 JSON 结果
- **线上环境**：展示预计算的结果，不调用 Claude API

---

## 部署步骤

### 1. 配置 GitHub Pages

修改 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai_product_governance/', // 仓库名
})
```

### 2. 安装 gh-pages

```bash
npm install -D gh-pages
```

### 3. 添加部署脚本到 `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "evaluate": "node scripts/run_evaluation.js",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 4. 运行评测（必需）

在部署前，必须先在本地运行评测生成结果文件：

```bash
npm run evaluate
```

这将生成：
- `evaluation/v01/results.json`
- `evaluation/v01/bad_cases.json`
- `evaluation/v01/report.md`
- `evaluation/v01/display_summary.json`

### 5. 提交到 GitHub

```bash
git add .
git commit -m "Add V0.1 evaluation results and demo"
git push origin main
```

### 6. 部署

```bash
npm run deploy
```

部署后访问：`https://Carla-guguwwwy051010.github.io/ai_product_governance/`

---

## 重要说明

### ✅ 提交前检查清单

- [ ] 运行过 `npm run evaluate`
- [ ] `evaluation/v01/` 目录下有 4 个文件
- [ ] `vite.config.js` 中 `base` 配置正确
- [ ] 本地 `npm run build` 成功
- [ ] 本地 `npm run preview` 可访问

### 📂 必须提交的文件

```
evaluation/v01/
├── results.json           ✅ 必须
├── bad_cases.json         ✅ 必须
├── report.md              ✅ 必须
└── display_summary.json   ✅ 必须
```

这些文件包含预计算的评测结果，线上 Demo 依赖它们。

---

## 架构说明

### Local Evaluation Environment
- 运行环境：Claude Code / 本地开发环境
- 执行内容：Golden Dataset → Evidence Engine → Rule Engine → Evaluation
- 输出：JSON 结果文件

### Online Demo Environment
- 运行环境：GitHub Pages / 静态托管
- 展示内容：读取 JSON 文件，可视化展示
- 特点：不调用 API，不实时计算

> **Model evaluation is executed in the local Claude development environment; the deployed web demo is used for interactive visualization and result presentation.**

---

## 更新评测结果

当你改进算法后（如 V0.2），按以下步骤更新：

```bash
# 1. 修改代码
# 2. 重新运行评测
npm run evaluate

# 3. 确认新结果
cat evaluation/v01/report.md

# 4. 提交并部署
git add .
git commit -m "Update V0.1 evaluation results"
git push origin main
npm run deploy
```

---

## 故障排查

### 问题：页面空白
**原因**：`vite.config.js` 中 `base` 路径配置错误
**解决**：确保 `base: '/ai_product_governance/'` 与仓库名一致

### 问题：评测数据未显示
**原因**：未生成 `evaluation/v01/*.json` 文件
**解决**：运行 `npm run evaluate`

### 问题：构建失败
**原因**：JSON 文件缺失或格式错误
**解决**：检查 `evaluation/v01/` 目录，重新运行评测

---

## 数据声明

所有评测数据均为 **Synthetic / Self-built**，不包含真实电商平台生产数据。

---

**仓库地址**: https://github.com/Carla-guguwwwy051010/ai_product_governance
**部署地址**: https://Carla-guguwwwy051010.github.io/ai_product_governance/
