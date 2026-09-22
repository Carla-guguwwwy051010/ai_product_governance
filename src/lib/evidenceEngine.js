// Evidence-based Product Understanding Engine
// 所有字段都可以追溯到来源

import { brandAliases, colorAliases, unitNormalization } from '../data/syntheticData.js';

// Evidence 数据结构
export class Evidence {
  constructor(field, value, source, sourceType, confidence = 0.9) {
    this.field = field;
    this.value = value;
    this.source = source; // e.g., "title", "image_02", "voice_01"
    this.sourceType = sourceType; // "text", "image_ocr", "voice_asr", "visual"
    this.confidence = confidence;
    this.timestamp = new Date().toISOString();
  }
}

// 从文本提取证据
export function extractTextEvidence(textInput) {
  const evidences = [];
  const { title = "", spec = "" } = textInput;
  const combined = `${title} ${spec}`.toLowerCase();

  // Brand extraction with proper capitalization
  const brandMappings = {
    "apple": "Apple",
    "小米": "小米",
    "xiaomi": "小米",
    "华为": "华为",
    "huawei": "华为",
    "oppo": "OPPO",
    "vivo": "vivo",
    "三星": "三星",
    "samsung": "三星",
    "荣耀": "荣耀",
    "一加": "一加",
    "oneplus": "一加",
    "redmi": "Redmi",
    "红米": "Redmi",
    "realme": "realme",
    "真我": "realme",
    "海飞丝": "海飞丝",
    "潘婷": "潘婷",
    "pantene": "潘婷",
    "飘柔": "飘柔",
    "沙宣": "沙宣",
    "vs": "沙宣",
    "vidal sassoon": "沙宣",
    "清扬": "清扬",
    "clear": "清扬",
    "施华蔻": "施华蔻",
    "schwarzkopf": "施华蔻",
    "霸王": "霸王",
    "阿道夫": "阿道夫",
    "滋源": "滋源",
    "蜂花": "蜂花",
    "可口可乐": "可口可乐",
    "coca-cola": "可口可乐",
    "百事": "百事可乐",
    "pepsi": "百事可乐",
    "雪碧": "雪碧",
    "sprite": "雪碧",
    "元气森林": "元气森林",
    "农夫山泉": "农夫山泉",
    "康师傅": "康师傅",
    "统一": "统一",
    "红牛": "红牛",
    "red bull": "红牛",
    "怡宝": "怡宝",
    "东方树叶": "东方树叶"
  };

  for (const [key, value] of Object.entries(brandMappings)) {
    if (combined.includes(key)) {
      evidences.push(new Evidence("brand", value, "title", "text", 0.95));
      break;
    }
  }

  // Model extraction (手机型号) with proper formatting
  const modelExtractors = [
    { pattern: /iphone\s*(\d+)\s*(pro\s*max|pro|plus)?/i, format: (m) => `iPhone ${m[1]}${m[2] ? ' ' + m[2].replace(/\s+/g, ' ').trim() : ''}`.replace(/pro max/i, 'Pro Max').replace(/pro/i, 'Pro').replace(/plus/i, 'Plus') },
    { pattern: /(xiaomi|小米)\s*(\d+)\s*(ultra|pro)?/i, format: (m) => `Xiaomi ${m[2]}${m[3] ? ' ' + m[3].charAt(0).toUpperCase() + m[3].slice(1).toLowerCase() : ''}` },
    { pattern: /mate\s*(\d+)\s*(pro|plus)?/i, format: (m) => `Mate ${m[1]}${m[2] ? ' ' + m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase() : ''}` },
    { pattern: /find\s*x(\d+)\s*(ultra|pro)?/i, format: (m) => `Find X${m[1]}${m[2] ? ' ' + m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase() : ''}` },
    { pattern: /x(\d+)\s*pro/i, format: (m) => `X${m[1]} Pro` },
    { pattern: /galaxy\s*s(\d+)\s*(ultra|plus)?/i, format: (m) => `Galaxy S${m[1]}${m[2] ? ' ' + m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase() : ''}` },
    { pattern: /magic(\d+)\s*pro/i, format: (m) => `Magic${m[1]} Pro` },
    { pattern: /oneplus\s*(\d+)/i, format: (m) => `OnePlus ${m[1]}` },
    { pattern: /k(\d+)\s*pro/i, format: (m) => `K${m[1]} Pro` },
    { pattern: /gt(\d+)\s*pro/i, format: (m) => `GT${m[1]} Pro` }
  ];

  for (const extractor of modelExtractors) {
    const match = combined.match(extractor.pattern);
    if (match) {
      const formattedModel = extractor.format(match);
      evidences.push(new Evidence("model", formattedModel, "title", "text", 0.92));
      break;
    }
  }

  // Color extraction
  const colors = ["黑色", "白色", "金色", "蓝色", "绿色", "灰色", "红色", "粉色", "紫色",
                  "午夜黑", "钛灰色", "青山黛"];
  for (const color of colors) {
    if (combined.includes(color)) {
      const normalizedColor = colorAliases[color] || color;
      evidences.push(new Evidence("color", normalizedColor, "title", "text", 0.90));
      break;
    }
  }

  // Capacity extraction
  const capacityMatch = combined.match(/(\d+)\s*(gb|g|tb|t)\b/i);
  if (capacityMatch) {
    let value = capacityMatch[1];
    let unit = capacityMatch[2].toUpperCase();
    unit = unitNormalization[unit] || unit;
    evidences.push(new Evidence("capacity", `${value}${unit}`, "title", "text", 0.88));
  }

  // Region extraction
  if (combined.includes("国行") || combined.includes("中国")) {
    evidences.push(new Evidence("region", "中国大陆", "title", "text", 0.85));
  } else if (combined.includes("韩版") || combined.includes("韩国")) {
    evidences.push(new Evidence("region", "韩国", "title", "text", 0.85));
  }

  // Condition extraction
  if (combined.includes("全新") || combined.includes("未拆")) {
    evidences.push(new Evidence("condition", "全新", "title", "text", 0.90));
  } else if (combined.includes("二手") || combined.includes("95新")) {
    evidences.push(new Evidence("condition", "二手", "title", "text", 0.90));
  }

  // Volume extraction (洗发水/饮料)
  const volumeMatch = combined.match(/(\d+)\s*(ml|l)\b/i);
  if (volumeMatch) {
    let value = volumeMatch[1];
    let unit = volumeMatch[2].toLowerCase();
    if (unit === 'l' && !combined.includes('ml')) {
      value = parseInt(value) * 1000;
      unit = 'ml';
    }
    evidences.push(new Evidence("volume", `${value}${unit}`, "title", "text", 0.88));
  }

  // Package extraction
  if (combined.includes("罐装")) {
    evidences.push(new Evidence("package", "罐装", "title", "text", 0.85));
  } else if (combined.includes("瓶装")) {
    evidences.push(new Evidence("package", "瓶装", "title", "text", 0.85));
  }

  // Product name extraction (洗发水)
  const shampooTypes = [
    { pattern: /去屑.*?洗发水|洗发水.*?去屑/i, name: "去屑洗发水" },
    { pattern: /乳液修护.*?洗发水|修护.*?洗发水/i, name: "乳液修护洗发水" },
    { pattern: /柔顺.*?洗发水|洗发水.*?柔顺/i, name: "柔顺洗发水" },
    { pattern: /修护水养.*?洗发水|水养.*?洗发水/i, name: "修护水养洗发水" },
    { pattern: /男士.*?去屑.*?洗发水|去屑.*?洗发水/i, name: "男士去屑洗发水" },
    { pattern: /多效修护.*?洗发水|修护.*?洗发水/i, name: "多效修护洗发水" },
    { pattern: /防脱育发.*?洗发水|防脱.*?洗发水/i, name: "防脱育发洗发水" },
    { pattern: /轻柔.*?洗发水/i, name: "轻柔洗发水" },
    { pattern: /无硅油.*?洗发水/i, name: "无硅油洗发水" },
    { pattern: /护发素/i, name: "护发素" }
  ];
  for (const type of shampooTypes) {
    if (combined.match(type.pattern)) {
      evidences.push(new Evidence("product_name", type.name, "title", "text", 0.90));
      break;
    }
  }

  // Product name extraction (饮料)
  const beverageTypes = [
    { pattern: /可乐/i, name: "可乐" },
    { pattern: /柠檬.*?汽水|汽水/i, name: "柠檬味汽水" },
    { pattern: /燃茶/i, name: "燃茶" },
    { pattern: /天然水/i, name: "天然水" },
    { pattern: /冰红茶/i, name: "冰红茶" },
    { pattern: /阿萨姆.*?奶茶|奶茶/i, name: "阿萨姆奶茶" },
    { pattern: /维生素.*?功能饮料|功能饮料/i, name: "维生素功能饮料" },
    { pattern: /纯净水/i, name: "纯净水" },
    { pattern: /茶饮料/i, name: "茶饮料" }
  ];
  for (const type of beverageTypes) {
    if (combined.match(type.pattern)) {
      evidences.push(new Evidence("product_name", type.name, "title", "text", 0.90));
      break;
    }
  }

  // Scent extraction (洗发水)
  const scents = [
    { pattern: /薄荷|清新薄荷/i, name: "清新薄荷" },
    { pattern: /花果香/i, name: "花果香" },
    { pattern: /摩洛哥.*?坚果油|坚果油/i, name: "摩洛哥坚果油" },
    { pattern: /运动薄荷/i, name: "运动薄荷" },
    { pattern: /樱花/i, name: "樱花" },
    { pattern: /中药/i, name: "中药" },
    { pattern: /香水香氛/i, name: "香水香氛" },
    { pattern: /生姜/i, name: "生姜" },
    { pattern: /茶香/i, name: "茶香" }
  ];
  for (const scent of scents) {
    if (combined.match(scent.pattern)) {
      evidences.push(new Evidence("scent", scent.name, "title", "text", 0.88));
      break;
    }
  }

  // Function extraction (洗发水)
  const functions = [
    { pattern: /去屑止痒/i, name: "去屑止痒" },
    { pattern: /修护受损/i, name: "修护受损" },
    { pattern: /柔顺顺滑|柔顺/i, name: "柔顺顺滑" },
    { pattern: /深层修护/i, name: "深层修护" },
    { pattern: /去屑控油/i, name: "去屑控油" },
    { pattern: /多效修护/i, name: "多效修护" },
    { pattern: /防脱生发|防脱/i, name: "防脱生发" },
    { pattern: /无硅油.*?健康|健康/i, name: "无硅油健康" },
    { pattern: /护发/i, name: "护发" }
  ];
  for (const func of functions) {
    if (combined.match(func.pattern)) {
      evidences.push(new Evidence("function", func.name, "title", "text", 0.88));
      break;
    }
  }

  // Flavor extraction (饮料)
  const flavors = [
    { pattern: /经典/i, name: "经典" },
    { pattern: /柠檬/i, name: "柠檬" },
    { pattern: /无糖.*?乌龙茶|乌龙茶/i, name: "无糖乌龙茶" },
    { pattern: /原味/i, name: "原味" }
  ];
  for (const flavor of flavors) {
    if (combined.match(flavor.pattern)) {
      evidences.push(new Evidence("flavor", flavor.name, "title", "text", 0.88));
      break;
    }
  }

  return evidences;
}

// 从图片 OCR 提取证据
export function extractImageOCREvidence(ocrTexts, imageIndex = 1) {
  const evidences = [];

  ocrTexts.forEach((text, idx) => {
    const lower = text.toLowerCase();

    // Capacity
    const capacityMatch = lower.match(/(\d+)\s*(gb|g|tb|t)\b/i);
    if (capacityMatch) {
      let value = capacityMatch[1];
      let unit = capacityMatch[2].toUpperCase();
      unit = unitNormalization[unit] || unit;
      evidences.push(new Evidence("capacity", `${value}${unit}`, `image_${imageIndex}_ocr`, "image_ocr", 0.94));
    }

    // Volume
    const volumeMatch = lower.match(/(\d+)\s*(ml|l)\b/i);
    if (volumeMatch) {
      let value = volumeMatch[1];
      let unit = volumeMatch[2].toLowerCase();
      evidences.push(new Evidence("volume", `${value}${unit}`, `image_${imageIndex}_ocr`, "image_ocr", 0.94));
    }

    // Brand (if clear in image)
    const brands = ["apple", "xiaomi", "samsung", "huawei", "oppo", "vivo", "pantene", "coca-cola", "pepsi"];
    for (const brand of brands) {
      if (lower.includes(brand)) {
        evidences.push(new Evidence("brand", brand, `image_${imageIndex}_ocr`, "image_ocr", 0.92));
        break;
      }
    }
  });

  return evidences;
}

// 从语音 ASR 提取证据
export function extractVoiceEvidence(asrText) {
  const evidences = [];
  if (!asrText) return evidences;

  const lower = asrText.toLowerCase();

  // 使用文本提取逻辑，但标记为 voice
  const textEvidences = extractTextEvidence({ title: asrText, spec: "" });
  return textEvidences.map(ev =>
    new Evidence(ev.field, ev.value, "voice_01", "voice_asr", ev.confidence * 0.95)
  );
}

// 从视觉特征提取证据
export function extractVisualEvidence(visualFeatures) {
  const evidences = [];

  if (visualFeatures.color) {
    const colorMap = {
      "dark": "黑色",
      "white": "白色",
      "blue": "蓝色",
      "red": "红色",
      "green": "绿色",
      "gold": "金色",
      "gray": "灰色",
      "pink": "粉色"
    };
    const color = colorMap[visualFeatures.color];
    if (color) {
      evidences.push(new Evidence("color", color, "visual_analysis", "visual", 0.87));
    }
  }

  if (visualFeatures.category) {
    evidences.push(new Evidence("category", visualFeatures.category, "visual_analysis", "visual", 0.90));
  }

  return evidences;
}

// 证据融合
export function fuseEvidences(evidences) {
  const fieldMap = {};

  evidences.forEach(ev => {
    if (!fieldMap[ev.field]) {
      fieldMap[ev.field] = [];
    }
    fieldMap[ev.field].push(ev);
  });

  const fused = {};
  const conflicts = [];

  Object.keys(fieldMap).forEach(field => {
    const evList = fieldMap[field];

    // Group by value
    const valueGroups = {};
    evList.forEach(ev => {
      const val = ev.value;
      if (!valueGroups[val]) {
        valueGroups[val] = [];
      }
      valueGroups[val].push(ev);
    });

    const values = Object.keys(valueGroups);

    if (values.length === 1) {
      // No conflict
      fused[field] = {
        value: values[0],
        sources: evList.map(e => e.source),
        sourceTypes: [...new Set(evList.map(e => e.sourceType))],
        confidence: Math.max(...evList.map(e => e.confidence)),
        status: "VALID"
      };
    } else {
      // Conflict detected
      const sorted = values.sort((a, b) => {
        const aConf = Math.max(...valueGroups[a].map(e => e.confidence));
        const bConf = Math.max(...valueGroups[b].map(e => e.confidence));
        return bConf - aConf;
      });

      fused[field] = {
        value: sorted[0], // Highest confidence
        conflictValues: sorted,
        sources: evList.map(e => e.source),
        sourceTypes: [...new Set(evList.map(e => e.sourceType))],
        confidence: Math.max(...valueGroups[sorted[0]].map(e => e.confidence)),
        status: "CONFLICT"
      };

      conflicts.push({
        field: field,
        values: sorted,
        evidences: evList
      });
    }
  });

  return { fused, conflicts };
}

// 规则引擎
export function applyRules(fused, category) {
  const issues = [];

  // 必填字段检查
  const requiredFields = {
    "手机": ["brand", "model", "color", "capacity"],
    "洗发水": ["brand", "product_name", "volume"],
    "饮料": ["brand", "product_name", "volume"]
  };

  const required = requiredFields[category] || [];
  required.forEach(field => {
    if (!fused[field] || !fused[field].value) {
      issues.push({
        type: "MISSING_FIELD",
        field: field,
        severity: "high",
        message: `必填字段缺失: ${field}`
      });
    }
  });

  // 格式校验
  Object.keys(fused).forEach(field => {
    const item = fused[field];
    if (!item.value) return;

    if (field === "capacity") {
      if (!item.value.match(/^\d+(GB|TB)$/)) {
        issues.push({
          type: "FORMAT_ERROR",
          field: field,
          value: item.value,
          severity: "medium",
          message: `容量格式错误: ${item.value}，应为 256GB 或 1TB 格式`
        });
      }
    }

    if (field === "volume") {
      if (!item.value.match(/^\d+ml$/)) {
        issues.push({
          type: "FORMAT_ERROR",
          field: field,
          value: item.value,
          severity: "medium",
          message: `容量格式错误: ${item.value}，应为 500ml 格式`
        });
      }
    }
  });

  // 冲突检测
  Object.keys(fused).forEach(field => {
    const item = fused[field];
    if (item.status === "CONFLICT") {
      issues.push({
        type: "ATTRIBUTE_CONFLICT",
        field: field,
        values: item.conflictValues,
        sources: item.sources,
        severity: "high",
        message: `字段冲突: ${field}，不同来源给出不同值: ${item.conflictValues.join(" ↔ ")}`
      });
    }
  });

  return issues;
}

// 判断是否需要人工复核
export function requiresReview(issues) {
  const highSeverity = issues.filter(i => i.severity === "high");
  return highSeverity.length > 0;
}

// 完整处理流程
export function processProduct(productInput) {
  const evidences = [];

  // 1. Extract from all sources
  if (productInput.text) {
    evidences.push(...extractTextEvidence(productInput.text));
  }

  if (productInput.image_ocr && productInput.image_ocr.length > 0) {
    evidences.push(...extractImageOCREvidence(productInput.image_ocr));
  }

  if (productInput.voice_asr) {
    evidences.push(...extractVoiceEvidence(productInput.voice_asr));
  }

  if (productInput.visual) {
    evidences.push(...extractVisualEvidence(productInput.visual));
  }

  // 2. Fuse evidences
  const { fused, conflicts } = fuseEvidences(evidences);

  // 3. Determine category
  const category = fused.category?.value || productInput.category || "未知";

  // 4. Apply rules
  const issues = applyRules(fused, category);

  // 5. Check if review needed
  const reviewRequired = requiresReview(issues);

  return {
    evidences,
    fused,
    conflicts,
    issues,
    reviewRequired,
    category
  };
}
