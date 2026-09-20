# 🚀 快速部署指南

## 立即部署到 GitHub Pages

按照以下步骤，5 分钟内完成部署：

---

## Step 1: 安装 gh-pages

```bash
cd product-governance-agent
npm install -D gh-pages
```

---

## Step 2: 确认评测结果已生成

检查文件是否存在：

```bash
ls evaluation/v01/
```

应该看到：
- ✅ `results.json`
- ✅ `bad_cases.json`
- ✅ `report.md`
- ✅ `display_summary.json`

如果没有，运行：
```bash
npm run evaluate
```

---

## Step 3: 构建

```bash
npm run build
```

应该看到：
```
✓ built in XXXms
dist/index.html
dist/assets/...
```

---

## Step 4: 部署

```bash
npm run deploy
```

等待部署完成（约 30 秒）

---

## Step 5: 配置 GitHub Pages

1. 访问 GitHub 仓库：https://github.com/Carla-guguwwwy051010/ai_product_governance
2. 点击 **Settings** → **Pages**
3. **Source** 选择 `gh-pages` 分支
4. **Folder** 选择 `/ (root)`
5. 点击 **Save**

---

## Step 6: 访问线上地址

等待 1-2 分钟后访问：

```
https://Carla-guguwwwy051010.github.io/ai_product_governance/
```

---

## ✅ 验证清单

访问线上地址后，检查：

- [ ] 页面正常加载
- [ ] Hero 区域显示正确
- [ ] Intake 界面可交互
- [ ] Evaluation 显示真实指标（76.25% 等）
- [ ] Bad Cases 数量显示 47
- [ ] 所有图片和样式正常

---

## 🔧 故障排查

### 问题：页面 404
**原因**: GitHub Pages 未启用
**解决**: 按 Step 5 配置 GitHub Pages

### 问题：页面空白
**原因**: base 路径配置错误
**解决**: 确认 `vite.config.js` 中 `base: '/ai_product_governance/'`

### 问题：数据未显示
**原因**: JSON 文件未生成或未提交
**解决**: 
```bash
npm run evaluate
git add evaluation/
git commit -m "Add evaluation results"
git push
npm run deploy
```

---

## 📱 分享链接

部署成功后，将此链接分享给他人：

```
https://Carla-guguwwwy051010.github.io/ai_product_governance/
```

---

## 🔄 更新部署

当你改进算法或更新数据后：

```bash
# 1. 重新评测
npm run evaluate

# 2. 确认新结果
cat evaluation/v01/report.md

# 3. 提交到 Git
git add .
git commit -m "Update evaluation results"
git push

# 4. 重新部署
npm run deploy
```

---

## 📊 架构说明

本项目采用 **Local Evaluation + Online Demo Separation**：

- **Local**: 运行评测，生成 JSON 文件
- **Online**: 展示 JSON 结果，不调用 API

> Model evaluation is executed in the local Claude development environment; the deployed web demo is used for interactive visualization and result presentation.

---

**准备好了吗？开始部署吧！** 🚀
