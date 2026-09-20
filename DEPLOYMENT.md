# 部署指南

## 快速部署到 Vercel（推荐）

### 方式 1: 通过 Vercel CLI（最快）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录（首次需要）
vercel login

# 3. 在项目目录下部署
cd product-governance-agent
vercel

# 4. 按提示操作（一路回车使用默认配置）
# ✅ 部署完成后会自动生成预览链接
```

### 方式 2: 通过 Vercel 网站

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择 Git 仓库（或直接上传文件夹）
4. Vercel 会自动识别 Vite 项目
5. 点击 "Deploy"
6. ✅ 完成！获得预览链接

---

## 部署到 Netlify

### 方式 1: 拖拽部署

```bash
# 1. 构建项目
npm run build

# 2. 访问 https://app.netlify.com/drop
# 3. 将 dist 文件夹拖入浏览器
# ✅ 自动部署并生成链接
```

### 方式 2: Netlify CLI

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化并部署
netlify init
netlify deploy --prod
```

---

## 部署到 GitHub Pages

### 配置步骤

1. 修改 `vite.config.js`，添加 base 路径：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/product-governance-agent/', // 替换为你的仓库名
})
```

2. 安装 gh-pages：

```bash
npm install -D gh-pages
```

3. 在 `package.json` 添加部署脚本：

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. 部署：

```bash
npm run deploy
```

5. 访问：`https://你的用户名.github.io/product-governance-agent/`

---

## 本地预览（已测试）

```bash
# 开发模式
npm run dev
# 访问 http://localhost:5173 ✅

# 生产构建
npm run build

# 预览构建结果
npm run preview
# 访问 http://localhost:4173 ✅
```

---

## 环境要求

- Node.js 18+ 
- npm 9+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

---

## 故障排查

### 问题 1: 构建失败
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 问题 2: 部署后页面空白
检查浏览器控制台，可能是路径配置问题。确保 `vite.config.js` 中的 `base` 配置正确。

### 问题 3: 图片或资源 404
确保所有资源使用相对路径，且已包含在 `dist` 目录中。

---

## 推荐配置

### Vercel 配置（vercel.json）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify 配置（netlify.toml）

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 部署后测试清单

- [ ] 首页正常加载
- [ ] 导航链接工作正常
- [ ] Intake 界面可交互
- [ ] "Run Demo" 按钮正常执行
- [ ] Evaluation 指标正确显示
- [ ] 响应式布局正常（手机、平板、桌面）

---

## 获取部署链接后

将链接更新到：
1. README.md
2. PROJECT_PROGRESS.md
3. V01_SUMMARY.md

格式：
```markdown
🌐 **在线预览**: https://your-app.vercel.app
```

---

**推荐**: 使用 Vercel，因为：
- ✅ 零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 免费额度充足
- ✅ 每次 git push 自动部署

部署后请将链接反馈给我！
