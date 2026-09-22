// Synthetic / Self-built Product Data
// 30 商品样本，覆盖手机、洗发水、饮料及各种边界情况

export const syntheticProducts = [
  // === 手机类 (10个) ===
  {
    id: "P-001",
    category: "手机",
    golden: {
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      color: "黑色",
      capacity: "256GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "Apple iPhone 15 Pro Max 256g 午夜黑 国行全网通",
        spec: "品牌：Apple；型号：A3108；颜色：黑色；容量：256 GB；全新未拆封。"
      },
      image_ocr: ["512 GB"], // Conflict: 图片显示512GB
      voice_asr: "这个是 iPhone 15 Pro Max，黑色，256G，国行版本，全新未拆。",
      visual: { color: "dark", category: "phone" }
    },
    expectedIssues: ["ATTRIBUTE_CONFLICT"]
  },
  {
    id: "P-002",
    category: "手机",
    golden: {
      brand: "小米",
      model: "Xiaomi 14 Ultra",
      color: "白色",
      capacity: "512GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "小米14 Ultra 徕卡影像 白色 512G",
        spec: "小米14 Ultra 徕卡专业光学镜头 骁龙8 Gen3 全新国行"
      },
      image_ocr: ["Xiaomi 14 Ultra", "512GB"],
      voice_asr: "",
      visual: { color: "white", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-003",
    category: "手机",
    golden: {
      brand: "华为",
      model: "Mate 60 Pro",
      color: "金色",
      capacity: "512GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "HUAWEI Mate60 Pro 金色 512g", // 品牌别名
        spec: ""
      },
      image_ocr: [],
      voice_asr: "华为 Mate 60 Pro 金色版本 512G",
      visual: { color: "gold", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-004",
    category: "手机",
    golden: {
      brand: "OPPO",
      model: "Find X7 Ultra",
      color: null, // Missing color
      capacity: "256GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "OPPO Find X7 Ultra 天玑9300 256GB", // 缺失颜色
        spec: "OPPO Find X7 Ultra 天玑9300处理器 256GB存储"
      },
      image_ocr: ["256GB"],
      voice_asr: "",
      visual: { category: "phone" }
    },
    expectedIssues: ["MISSING_FIELD"]
  },
  {
    id: "P-005",
    category: "手机",
    golden: {
      brand: "vivo",
      model: "X100 Pro",
      color: "蓝色",
      capacity: "512GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "vivo X100 Pro 蔡司光学 蓝色512G",
        spec: "天玑9300芯片 蔡司APO超级长焦"
      },
      image_ocr: ["vivo X100 Pro"],
      voice_asr: "这是 vivo X100 Pro 蓝色 512G",
      visual: { color: "blue", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-006",
    category: "手机",
    golden: {
      brand: "三星",
      model: "Galaxy S24 Ultra",
      color: "灰色",
      capacity: "512GB",
      region: "韩国",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "Samsung Galaxy S24 Ultra 钛灰色 512GB 韩版", // 品牌别名
        spec: "三星 S24 Ultra 骁龙8 Gen3 for Galaxy 韩国版"
      },
      image_ocr: ["512GB", "Made in Korea"],
      voice_asr: "",
      visual: { color: "gray", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-007",
    category: "手机",
    golden: {
      brand: "荣耀",
      model: "Magic6 Pro",
      color: "绿色",
      capacity: "256GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "荣耀Magic6 Pro 青山黛 256G", // 颜色别名
        spec: "骁龙8 Gen3 巨犀玻璃"
      },
      image_ocr: ["Magic6 Pro"],
      voice_asr: "荣耀 Magic6 Pro 绿色 256G",
      visual: { color: "green", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-008",
    category: "手机",
    golden: {
      brand: "一加",
      model: "OnePlus 12",
      color: "白色",
      capacity: "1TB", // 格式错误：输入为"1T"
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "一加12 白色 1T 超大存储", // 格式错误
        spec: "OnePlus 12 骁龙8 Gen3 1TB"
      },
      image_ocr: ["1TB"],
      voice_asr: "",
      visual: { color: "white", category: "phone" }
    },
    expectedIssues: ["FORMAT_ERROR"]
  },
  {
    id: "P-009",
    category: "手机",
    golden: {
      brand: "Redmi",
      model: "K70 Pro",
      color: "黑色",
      capacity: "256GB",
      region: "中国大陆",
      condition: "二手"
    },
    inputs: {
      text: {
        title: "Redmi K70 Pro 黑色 256G 95新",
        spec: "骁龙8 Gen3 2K屏 二手9成新 无磕碰"
      },
      image_ocr: [],
      voice_asr: "红米 K70 Pro 黑色 256G 二手的 95新",
      visual: { color: "black", category: "phone" }
    },
    expectedIssues: []
  },
  {
    id: "P-010",
    category: "手机",
    golden: {
      brand: "realme",
      model: "GT5 Pro",
      color: "灰色",
      capacity: "512GB",
      region: "中国大陆",
      condition: "全新"
    },
    inputs: {
      text: {
        title: "真我GT5 Pro 灰色512GB", // 品牌别名
        spec: "realme GT5 Pro 骁龙8 Gen3"
      },
      image_ocr: ["realme GT5 Pro"],
      voice_asr: "",
      visual: { color: "gray", category: "phone" }
    },
    expectedIssues: []
  },

  // === 洗发水类 (10个) ===
  {
    id: "P-011",
    category: "洗发水",
    golden: {
      brand: "海飞丝",
      product_name: "去屑洗发水",
      volume: "750ml",
      scent: "清新薄荷",
      function: "去屑止痒"
    },
    inputs: {
      text: {
        title: "海飞丝去屑洗发水750ml 薄荷清爽",
        spec: "功效：去屑止痒；香型：清新薄荷"
      },
      image_ocr: ["750ml", "薄荷"],
      voice_asr: "",
      visual: { color: "blue", category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-012",
    category: "洗发水",
    golden: {
      brand: "潘婷",
      product_name: "乳液修护洗发水",
      volume: "500ml",
      scent: "花果香",
      function: "修护受损"
    },
    inputs: {
      text: {
        title: "Pantene潘婷乳液修护500ml", // 品牌别名
        spec: "修护干枯受损发质 花果香型"
      },
      image_ocr: ["500ml", "Pantene"],
      voice_asr: "潘婷乳液修护洗发水500毫升",
      visual: { category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-013",
    category: "洗发水",
    golden: {
      brand: "飘柔",
      product_name: "柔顺洗发水",
      volume: "1L",
      scent: null, // Missing
      function: "柔顺顺滑"
    },
    inputs: {
      text: {
        title: "飘柔柔顺洗发水1000ml家庭装",
        spec: "让头发更柔顺丝滑"
      },
      image_ocr: ["1L"],
      voice_asr: "",
      visual: { category: "shampoo" }
    },
    expectedIssues: ["MISSING_FIELD"]
  },
  {
    id: "P-014",
    category: "洗发水",
    golden: {
      brand: "沙宣",
      product_name: "修护水养洗发水",
      volume: "750ml",
      scent: "摩洛哥坚果油",
      function: "深层修护"
    },
    inputs: {
      text: {
        title: "VS沙宣修护水养750ml摩洛哥坚果油", // 品牌别名
        spec: "Vidal Sassoon 深层修护"
      },
      image_ocr: ["750ml", "Argan Oil"],
      voice_asr: "",
      visual: { category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-015",
    category: "洗发水",
    golden: {
      brand: "清扬",
      product_name: "男士去屑洗发水",
      volume: "500ml",
      scent: "运动薄荷",
      function: "去屑控油"
    },
    inputs: {
      text: {
        title: "Clear清扬男士去屑500ml运动薄荷", // 品牌别名
        spec: "专为男士设计 去屑控油"
      },
      image_ocr: ["500ml", "MEN"],
      voice_asr: "清扬男士去屑洗发水500毫升",
      visual: { category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-016",
    category: "洗发水",
    golden: {
      brand: "施华蔻",
      product_name: "多效修护洗发水",
      volume: "600ml",
      scent: "樱花",
      function: "多效修护"
    },
    inputs: {
      text: {
        title: "Schwarzkopf施华蔻多效修护樱花600ml",
        spec: "修护毛躁 锁色护色"
      },
      image_ocr: ["600ml", "Sakura"],
      voice_asr: "",
      visual: { color: "pink", category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-017",
    category: "洗发水",
    golden: {
      brand: "霸王",
      product_name: "防脱育发洗发水",
      volume: "400ml",
      scent: "中药",
      function: "防脱生发"
    },
    inputs: {
      text: {
        title: "霸王防脱育发洗发水400ml中药配方",
        spec: "含首乌、当归等中药成分"
      },
      image_ocr: ["400ml"],
      voice_asr: "霸王防脱洗发水400毫升",
      visual: { category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-018",
    category: "洗发水",
    golden: {
      brand: "阿道夫",
      product_name: "轻柔洗发水",
      volume: "520ml",
      scent: "香水香氛", // Conflict
      function: "柔顺"
    },
    inputs: {
      text: {
        title: "阿道夫轻柔洗发水520ml 香水香氛",
        spec: "法国香氛 持久留香"
      },
      image_ocr: ["520ml", "茶香"], // Conflict: 图片显示茶香
      voice_asr: "",
      visual: { category: "shampoo" }
    },
    expectedIssues: ["ATTRIBUTE_CONFLICT"]
  },
  {
    id: "P-019",
    category: "洗发水",
    golden: {
      brand: "滋源",
      product_name: "无硅油洗发水",
      volume: "535ml",
      scent: "生姜",
      function: "无硅油健康"
    },
    inputs: {
      text: {
        title: "滋源无硅油生姜洗发水535ml",
        spec: "不含硅油 头皮更健康"
      },
      image_ocr: ["535ml", "Ginger"],
      voice_asr: "滋源无硅油洗发水生姜味535毫升",
      visual: { category: "shampoo" }
    },
    expectedIssues: []
  },
  {
    id: "P-020",
    category: "洗发水",
    golden: {
      brand: "蜂花",
      product_name: "护发素",
      volume: "1000ml", // 格式错误：输入为"1000ML"
      scent: null,
      function: "护发"
    },
    inputs: {
      text: {
        title: "蜂花护发素1000ML大瓶装", // 格式错误
        spec: "经典国货 大容量"
      },
      image_ocr: ["1000ML"],
      voice_asr: "",
      visual: { category: "shampoo" }
    },
    expectedIssues: ["FORMAT_ERROR"]
  },

  // === 饮料类 (10个) ===
  {
    id: "P-021",
    category: "饮料",
    golden: {
      brand: "可口可乐",
      product_name: "可乐",
      volume: "330ml",
      package: "罐装",
      flavor: "经典"
    },
    inputs: {
      text: {
        title: "Coca-Cola可口可乐经典330ml罐装", // 品牌别名
        spec: "经典配方 碳酸饮料"
      },
      image_ocr: ["330ml", "Coca-Cola"],
      voice_asr: "",
      visual: { color: "red", category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-022",
    category: "饮料",
    golden: {
      brand: "百事可乐",
      product_name: "可乐",
      volume: "500ml",
      package: "瓶装",
      flavor: "经典"
    },
    inputs: {
      text: {
        title: "Pepsi百事可乐500ml瓶装",
        spec: "碳酸饮料 经典口味"
      },
      image_ocr: ["500ml", "Pepsi"],
      voice_asr: "百事可乐500毫升瓶装",
      visual: { color: "blue", category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-023",
    category: "饮料",
    golden: {
      brand: "雪碧",
      product_name: "柠檬味汽水",
      volume: "330ml",
      package: "罐装",
      flavor: "柠檬"
    },
    inputs: {
      text: {
        title: "Sprite雪碧柠檬味330ml罐装",
        spec: "清爽柠檬味碳酸饮料"
      },
      image_ocr: ["330ml"],
      voice_asr: "",
      visual: { color: "green", category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-024",
    category: "饮料",
    golden: {
      brand: "元气森林",
      product_name: "燃茶",
      volume: "500ml",
      package: "瓶装",
      flavor: "无糖乌龙茶"
    },
    inputs: {
      text: {
        title: "元气森林燃茶无糖乌龙茶500ml",
        spec: "0糖0脂0卡 健康茶饮"
      },
      image_ocr: ["500ml", "0糖"],
      voice_asr: "元气森林燃茶乌龙茶味500毫升",
      visual: { category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-025",
    category: "饮料",
    golden: {
      brand: "农夫山泉",
      product_name: "天然水",
      volume: "550ml",
      package: "瓶装",
      flavor: null
    },
    inputs: {
      text: {
        title: "农夫山泉天然水550ml",
        spec: "大自然的搬运工"
      },
      image_ocr: ["550ml"],
      voice_asr: "",
      visual: { category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-026",
    category: "饮料",
    golden: {
      brand: "康师傅",
      product_name: "冰红茶",
      volume: "500ml",
      package: "瓶装",
      flavor: "柠檬"
    },
    inputs: {
      text: {
        title: "康师傅冰红茶柠檬味500ml瓶装",
        spec: "经典柠檬红茶"
      },
      image_ocr: ["500ml", "Lemon"],
      voice_asr: "康师傅冰红茶500毫升",
      visual: { category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-027",
    category: "饮料",
    golden: {
      brand: "统一",
      product_name: "阿萨姆奶茶",
      volume: "500ml", // Conflict
      package: "瓶装",
      flavor: "原味"
    },
    inputs: {
      text: {
        title: "统一阿萨姆奶茶原味500ml",
        spec: "浓郁奶香 经典奶茶"
      },
      image_ocr: ["450ml"], // Conflict
      voice_asr: "",
      visual: { category: "beverage" }
    },
    expectedIssues: ["ATTRIBUTE_CONFLICT"]
  },
  {
    id: "P-028",
    category: "饮料",
    golden: {
      brand: "红牛",
      product_name: "维生素功能饮料",
      volume: "250ml",
      package: "罐装",
      flavor: "经典"
    },
    inputs: {
      text: {
        title: "Red Bull红牛维生素功能饮料250ml罐装",
        spec: "能量饮料 提神醒脑"
      },
      image_ocr: ["250ml", "Red Bull"],
      voice_asr: "红牛功能饮料250毫升",
      visual: { color: "blue", category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-029",
    category: "饮料",
    golden: {
      brand: "怡宝",
      product_name: "纯净水",
      volume: "555ml",
      package: "瓶装",
      flavor: null
    },
    inputs: {
      text: {
        title: "怡宝纯净水555ml", // Missing package
        spec: "优质纯净水"
      },
      image_ocr: ["555ml"],
      voice_asr: "",
      visual: { category: "beverage" }
    },
    expectedIssues: []
  },
  {
    id: "P-030",
    category: "饮料",
    golden: {
      brand: "东方树叶",
      product_name: "茶饮料",
      volume: "500ml",
      package: "瓶装",
      flavor: "乌龙茶"
    },
    inputs: {
      text: {
        title: "东方树叶乌龙茶500ml无糖茶饮料",
        spec: "0糖0卡 真茶真味"
      },
      image_ocr: ["500ml", "Oolong"],
      voice_asr: "东方树叶乌龙茶500毫升",
      visual: { category: "beverage" }
    },
    expectedIssues: []
  }
];

// 品牌别名映射
export const brandAliases = {
  "HUAWEI": "华为",
  "Samsung": "三星",
  "Pantene": "潘婷",
  "VS": "沙宣",
  "Vidal Sassoon": "沙宣",
  "Clear": "清扬",
  "Schwarzkopf": "施华蔻",
  "Coca-Cola": "可口可乐",
  "Pepsi": "百事可乐",
  "Sprite": "雪碧",
  "Red Bull": "红牛",
  "真我": "realme"
};

// 颜色别名映射
export const colorAliases = {
  "午夜黑": "黑色",
  "钛灰色": "灰色",
  "青山黛": "绿色"
};

// 单位标准化映射
export const unitNormalization = {
  "g": "GB",
  "G": "GB",
  "T": "TB",
  "ML": "ml",
  "L": "ml"
};
