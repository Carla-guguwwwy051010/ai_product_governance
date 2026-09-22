# Evaluation Methodology

## 概述

本文档定义「AI 商品信息理解、治理与评测 Agent」的评测方法论。所有指标基于 Golden Dataset 实时计算，不包含硬编码数值。

## 数据集

### Golden Dataset
- **规模**: 30 条商品
- **类目**: 手机（10）、洗发水（10）、饮料（10）
- **来源**: Synthetic / Self-built
- **标注**: 人工标注 Golden Truth

### 数据结构
每条样本包含：
```javascript
{
  id: "P-001",
  category: "手机",
  golden: {                    // Golden Truth
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "黑色",
    capacity: "256GB",
    ...
  },
  inputs: {                    // 多模态输入
    text: { title, spec },
    image_ocr: [...],
    voice_asr: "...",
    visual: { color, category }
  },
  expectedIssues: [...]        // 预期检测到的问题
}
```

## 评测指标

### 1. Field Accuracy (字段准确率)
**定义**: 所有字段预测值与 Golden 值完全匹配的比例

**计算**:
```
Field Accuracy = 正确字段数 / 总字段数 × 100%
```

**示例**:
- Golden: `{ brand: "Apple", color: "黑色" }`
- Predicted: `{ brand: "Apple", color: "黑色" }`
- 结果: 2/2 = 100%

### 2. Precision / Recall / F1
**定义**: 标准信息抽取指标

**计算**:
```
True Positive (TP):  Golden 有值，预测正确
False Positive (FP): Golden 无值，预测有值（幻觉）
False Negative (FN): Golden 有值，预测缺失

Precision = TP / (TP + FP) × 100%
Recall    = TP / (TP + FN) × 100%
F1        = 2 × P × R / (P + R)
```

### 3. Completeness (完整性)
**定义**: 所有字段都正确的商品占比

**计算**:
```
Completeness = 完全正确的商品数 / 总商品数 × 100%
```

### 4. Conflict Recall (冲突检测召回率)
**定义**: 真实冲突被成功检测的比例

**计算**:
```
Conflict Recall = 检测到的冲突数 / 实际冲突数 × 100%
```

**示例**:
- Golden: 标题显示 256GB，图片 OCR 显示 512GB（冲突）
- 系统应标记为 CONFLICT

### 5. Evidence Grounding (证据覆盖率)
**定义**: 预测字段有来源证据的比例

**计算**:
```
Evidence Grounding = 有来源的字段数 / 预测字段总数 × 100%
```

**要求**: 每个字段必须关联至少一个 Evidence（source, sourceType, confidence）

### 6. Review Routing Precision (复核路由准确率)
**定义**: 复核路由决策的准确性

**计算**:
```
Review Routing Precision = 正确路由决策数 / 总决策数 × 100%
```

**路由规则**:
- 应路由: 冲突 / 缺失必填字段 / 格式错误
- 不应路由: 所有字段正常

### 7. Modality Quality (模态质量)
**定义**: 各输入模态的独立准确率

**计算**:
- **Text Extraction**: 文本来源字段的准确率
- **Image OCR**: 图片 OCR 来源字段的准确率
- **Visual Attribute**: 视觉分析来源字段的准确率
- **Voice Attribute**: 语音转写来源字段的准确率
- **Cross-modal Consistency**: 等同于 Conflict Recall

## Bad Case 分类

### 错误类型
1. **EXTRACTION_ERROR**: 提取错误（值不匹配）
2. **MISSING_FIELD**: 必填字段缺失
3. **HALLUCINATION**: 无证据幻觉（Golden 无值但预测有值）
4. **CONFLICT_MISS**: 冲突漏检（应检测但未检测）
5. **FORMAT_ERROR**: 格式错误未修正
6. **ROUTING_ERROR**: 复核路由错误

### Bad Case 结构
```javascript
{
  productId: "P-001",
  category: "手机",
  field: "capacity",
  golden: "256GB",
  predicted: "512GB",
  type: "CONFLICT_MISS"
}
```

## 评测流程

### Step 1: 处理每个商品
```javascript
for (product of goldenDataset) {
  const result = processProduct(product.inputs);
  const evaluation = evaluateProduct(product, result);
}
```

### Step 2: 字段级对比
```javascript
for (field in product.golden) {
  const golden = product.golden[field];
  const predicted = result.fused[field]?.value;
  
  if (golden === predicted) {
    // 正确
  } else if (golden !== null && !predicted) {
    // 缺失
  } else if (golden === null && predicted) {
    // 幻觉
  } else {
    // 错误
  }
}
```

### Step 3: 聚合指标
```javascript
const metrics = {
  fieldAccuracy: correctFields / totalFields,
  precision: TP / (TP + FP),
  recall: TP / (TP + FN),
  f1: 2 * P * R / (P + R),
  // ...
};
```

### Step 4: Bad Case 收集
```javascript
for (evaluation of evaluations) {
  for (field in evaluation.fields) {
    if (!field.correct) {
      badCases.push({
        productId: evaluation.productId,
        field: fieldName,
        golden: field.golden,
        predicted: field.predicted,
        type: classifyError(field)
      });
    }
  }
}
```

## 边界情况覆盖

### 必须覆盖的 Case
1. ✅ **品牌别名**: Samsung → 三星, Pantene → 潘婷
2. ✅ **颜色别名**: 午夜黑 → 黑色, 钛灰色 → 灰色
3. ✅ **单位标准化**: 256g → 256GB, 1000ML → 1000ml
4. ✅ **跨模态冲突**: 文本 vs 图片 OCR 不一致
5. ✅ **必填字段缺失**: 缺少 brand / model / color
6. ✅ **格式错误**: 1T 应规范为 1TB
7. ✅ **二手商品**: condition = "二手"

## 指标基准

### V0.1 目标（基线）
- Field Accuracy: > 85%
- F1 Score: > 80%
- Conflict Recall: > 80%
- Evidence Grounding: > 90%
- Review Routing Precision: > 80%

### V0.2 目标
- Field Accuracy: > 92%
- F1 Score: > 88%
- Conflict Recall: > 90%

### V0.3 目标
- Field Accuracy: > 95%
- F1 Score: > 92%
- Conflict Recall: > 95%

## 实现原则

### 1. 零硬编码
所有指标必须基于 Golden Dataset 实时计算，禁止写死数值。

### 2. 可复现
相同输入 + 相同代码 → 相同指标。

### 3. 可追溯
每个 Bad Case 必须关联到具体商品 ID 和字段。

### 4. 可解释
指标计算逻辑公开透明，可审查。

## 评测代码位置

- **数据集**: `src/data/syntheticData.js`
- **评测引擎**: `src/lib/evaluationEngine.js`
- **评测报告**: `evaluation/v01/report.json`

---

**数据声明**: 所有评测数据均为 Synthetic / Self-built，不包含真实电商平台生产数据。
