# AI 商品信息理解、治理与评测 Agent

## 项目概述

基于多模态输入（文本、图片、语音、批量文件）的商品信息理解、治理与评测系统。

**核心特点：**
- Evidence-based：每个字段都可追溯到来源
- Conflict-aware：自动检测跨模态冲突
- Review-routing：高风险字段自动路由人工复核
- Evaluation-driven：真实计算指标，不写死数值

**技术栈：** React + Vite

**数据声明：** 所有商品数据、图片、语音、规则与指标均为 Synthetic / Self-built，不含真实电商平台生产数据。

---

## 🏗️ Architecture: Local Evaluation + Online Demo Separation

**重要说明：本项目采用"实验评测环境 + 在线展示环境"分离架构**

### Evaluation Environment (本地/Claude 环境)
- **执行环境**: Local Claude Code / Development Environment
- **功能**: 真实运行 Dataset、Evidence Engine、Rule Engine 和 Evaluation
- **输出**: 预计算的评测结果文件
  - `evaluation/v01/results.json`
  - `evaluation/v01/bad_cases.json`
  - `evaluation/v01/report.md`

### Demo Environment (线上部署)
- **执行环境**: Deployed Web Application
- **功能**: 交互式可视化和结果展示
- **数据来源**: 读取预计算的 JSON 文件
- **说明**: 不实时调用 Claude API，不实时计算指标

> **Model evaluation is executed in the local Claude development environment; the deployed web demo is used for interactive visualization and result presentation.**

---

## 快速开始

### 本地运行评测（必需）
```bash
cd product-governance-agent
npm install

# 运行完整评测（生成 results.json 等文件）
node scripts/run_evaluation.js
```

### 启动 Web Demo
```bash
npm run dev
# 访问 http://localhost:5173
```

---

## 功能特性

### 1. 多模态输入 (Intake)
- **Text**: 商品标题、规格描述
- **Image**: 主图、包装图、规格截图（支持上传）
- **Voice**: 商家语音口述（模拟录音）
- **Batch**: CSV/JSON 批量导入

### 2. Evidence Engine
- 从每个来源提取结构化证据
- 每条证据包含：field, value, source, sourceType, confidence
- 证据融合：合并多来源信息，检测冲突

### 3. Rule Engine
- 必填字段检查
- 格式校验（容量、单位标准化）
- 跨模态冲突检测
- 人工复核路由决策

### 4. Governance Dashboard
- 展示标准化后的商品 Schema
- 显示每个字段的来源标签
- 高亮冲突字段
- 提供人工复核操作入口

### 5. Evaluation System
- **Field Accuracy**: 字段级准确率
- **Precision / Recall / F1**: 标准分类指标
- **Conflict Recall**: 冲突检测召回率
- **Evidence Grounding**: 证据覆盖率
- **Review Routing Precision**: 复核路由准确率
- **Modality Quality**: 各模态独立质量评估
- **Bad Case Taxonomy**: 错误类型分类统计

## 项目结构

```
product-governance-agent/
├── src/
│   ├── data/
│   │   └── syntheticData.js      # 30条合成商品数据
│   ├── lib/
│   │   ├── evidenceEngine.js     # 证据提取与融合
│   │   └── evaluationEngine.js   # 评测指标计算
│   ├── App.jsx                    # 主应用组件
│   └── App.css                    # V3.0 样式（完整保留）
├── evaluation/
│   └── v01/                       # V0.1 评测报告
├── docs/
│   └── evaluation_methodology.md  # 评测方法论
└── README.md
```

## 数据集

### Golden Dataset (30 条)
- **手机**: 10 条（Apple, 小米, 华为, OPPO, vivo, 三星, 荣耀, 一加, Redmi, realme）
- **洗发水**: 10 条（海飞丝, 潘婷, 飘柔, 沙宣, 清扬, 施华蔻, 霸王, 阿道夫, 滋源, 蜂花）
- **饮料**: 10 条（可口可乐, 百事, 雪碧, 元气森林, 农夫山泉, 康师傅, 统一, 红牛, 怡宝, 东方树叶）

### 覆盖的边界情况
- ✅ 品牌别名（Samsung → 三星, Pantene → 潘婷）
- ✅ 颜色别名（午夜黑 → 黑色, 钛灰色 → 灰色）
- ✅ 单位格式错误（256g → 256GB, 1T → 1TB）
- ✅ 必填字段缺失
- ✅ 跨模态冲突（文本256GB vs 图片OCR 512GB）
- ✅ 二手商品标注

## V0.1 评测结果

| 指标 | 数值 | 说明 |
|------|------|------|
| Field Accuracy | 实际计算 | 所有字段的平均准确率 |
| F1 Score | 实际计算 | Precision & Recall 调和平均 |
| Conflict Recall | 实际计算 | 冲突检测召回率 |
| Evidence Grounding | 实际计算 | 证据覆盖率 |
| Review Routing Precision | 实际计算 | 复核路由准确率 |

**注**: 所有指标均由 `evaluationEngine.js` 基于 Golden Dataset 实时计算，无硬编码数值。

## 开发计划

### ✅ V0.1 (已完成)
- [x] 建立 Schema 和 Golden Dataset
- [x] 实现 Evidence Engine
- [x] 实现 Rule Engine
- [x] 实现真实 Evaluation
- [x] 搭建交互界面
- [x] 完成 V0.1 评测

### 🚧 V0.2 (计划中)
- [ ] 优化 OCR 识别准确率
- [ ] 引入真实语音转写
- [ ] 优化证据可信度计算
- [ ] 扩充 Golden Dataset 到 100 条

### 🚧 V0.3 (计划中)
- [ ] 优化跨模态冲突检测
- [ ] 引入 LLM-based 属性提取
- [ ] 优化人工复核路由策略
- [ ] A/B 测试不同 Prompt 策略

## 构建与部署

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 许可

MIT License

---

**声明**: 本项目所有商品数据、图片、语音、规则与指标均为 Synthetic / Self-built Demo，不包含任何真实电商平台的生产数据或内部指标。
