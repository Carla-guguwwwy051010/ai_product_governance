// Evaluation Engine - 真实计算指标，不写死
// 基于 Golden Dataset 计算准确率、召回率、F1 等

import { syntheticProducts } from '../data/syntheticData.js';
import { processProduct } from './evidenceEngine.js';

// 评估单个产品
export function evaluateProduct(product) {
  const result = processProduct(product.inputs);
  const golden = product.golden;

  const evaluation = {
    productId: product.id,
    category: product.category,
    fields: {},
    overallCorrect: true,
    detectedIssues: result.issues.map(i => i.type),
    expectedIssues: product.expectedIssues || []
  };

  // 评估每个字段
  Object.keys(golden).forEach(field => {
    const goldenValue = golden[field];
    const predictedValue = result.fused[field]?.value;

    const isCorrect = goldenValue === predictedValue;
    const isMissing = goldenValue !== null && !predictedValue;
    const isHallucination = goldenValue === null && predictedValue;

    evaluation.fields[field] = {
      golden: goldenValue,
      predicted: predictedValue,
      correct: isCorrect,
      missing: isMissing,
      hallucination: isHallucination
    };

    if (!isCorrect) {
      evaluation.overallCorrect = false;
    }
  });

  // 评估冲突检测
  evaluation.conflictDetection = {
    shouldDetect: product.expectedIssues.includes("ATTRIBUTE_CONFLICT"),
    detected: result.issues.some(i => i.type === "ATTRIBUTE_CONFLICT"),
    correct: false
  };
  evaluation.conflictDetection.correct =
    evaluation.conflictDetection.shouldDetect === evaluation.conflictDetection.detected;

  // 评估 Review Routing
  evaluation.reviewRouting = {
    shouldRoute: product.expectedIssues.length > 0,
    routed: result.reviewRequired,
    correct: false
  };
  evaluation.reviewRouting.correct =
    evaluation.reviewRouting.shouldRoute === evaluation.reviewRouting.routed;

  // Evidence Grounding: 是否所有字段都有来源
  evaluation.evidenceGrounding = {
    total: Object.keys(result.fused).length,
    grounded: Object.values(result.fused).filter(f => f.sources && f.sources.length > 0).length,
    score: 0
  };
  evaluation.evidenceGrounding.score =
    evaluation.evidenceGrounding.total > 0
      ? evaluation.evidenceGrounding.grounded / evaluation.evidenceGrounding.total
      : 0;

  return {
    ...evaluation,
    result
  };
}

// 评估整个数据集
export function evaluateDataset(products = syntheticProducts) {
  const evaluations = products.map(p => evaluateProduct(p));

  // 计算指标
  const metrics = {
    total: products.length,
    fieldAccuracy: 0,
    precision: 0,
    recall: 0,
    f1: 0,
    completeness: 0,
    conflictRecall: 0,
    evidenceGrounding: 0,
    reviewRoutingPrecision: 0
  };

  // Field Accuracy: 所有字段的平均准确率
  let totalFields = 0;
  let correctFields = 0;

  evaluations.forEach(ev => {
    Object.values(ev.fields).forEach(field => {
      totalFields++;
      if (field.correct) correctFields++;
    });
  });

  metrics.fieldAccuracy = totalFields > 0 ? (correctFields / totalFields) * 100 : 0;

  // Precision / Recall / F1
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  evaluations.forEach(ev => {
    Object.values(ev.fields).forEach(field => {
      if (field.golden !== null && field.predicted !== null && field.correct) {
        truePositive++;
      }
      if (field.golden === null && field.predicted !== null) {
        falsePositive++; // Hallucination
      }
      if (field.golden !== null && !field.predicted) {
        falseNegative++; // Missing
      }
    });
  });

  metrics.precision = truePositive + falsePositive > 0
    ? (truePositive / (truePositive + falsePositive)) * 100
    : 0;

  metrics.recall = truePositive + falseNegative > 0
    ? (truePositive / (truePositive + falseNegative)) * 100
    : 0;

  metrics.f1 = metrics.precision + metrics.recall > 0
    ? (2 * metrics.precision * metrics.recall) / (metrics.precision + metrics.recall)
    : 0;

  // Completeness: 多少产品的所有字段都正确
  const completeProducts = evaluations.filter(ev => ev.overallCorrect).length;
  metrics.completeness = (completeProducts / metrics.total) * 100;

  // Conflict Recall: 冲突检测召回率
  const conflictCases = evaluations.filter(ev => ev.conflictDetection.shouldDetect);
  const detectedConflicts = conflictCases.filter(ev => ev.conflictDetection.detected);
  metrics.conflictRecall = conflictCases.length > 0
    ? (detectedConflicts.length / conflictCases.length) * 100
    : 100;

  // Evidence Grounding: 平均证据覆盖率
  const groundingScores = evaluations.map(ev => ev.evidenceGrounding.score);
  metrics.evidenceGrounding = groundingScores.length > 0
    ? (groundingScores.reduce((a, b) => a + b, 0) / groundingScores.length) * 100
    : 0;

  // Review Routing Precision: 路由准确率
  const correctRouting = evaluations.filter(ev => ev.reviewRouting.correct).length;
  metrics.reviewRoutingPrecision = (correctRouting / metrics.total) * 100;

  // Field-level metrics
  const fieldMetrics = {};
  const fieldNames = new Set();
  evaluations.forEach(ev => {
    Object.keys(ev.fields).forEach(field => fieldNames.add(field));
  });

  fieldNames.forEach(fieldName => {
    let total = 0;
    let correct = 0;
    evaluations.forEach(ev => {
      if (ev.fields[fieldName]) {
        total++;
        if (ev.fields[fieldName].correct) correct++;
      }
    });
    fieldMetrics[fieldName] = total > 0 ? (correct / total) * 100 : 0;
  });

  // Bad Cases
  const badCases = [];
  evaluations.forEach(ev => {
    Object.keys(ev.fields).forEach(field => {
      const f = ev.fields[field];
      if (!f.correct) {
        let type = "EXTRACTION_ERROR";
        if (f.missing) type = "MISSING_FIELD";
        if (f.hallucination) type = "HALLUCINATION";
        if (ev.conflictDetection.shouldDetect && !ev.conflictDetection.detected) {
          type = "CONFLICT_MISS";
        }

        badCases.push({
          productId: ev.productId,
          category: ev.category,
          field: field,
          golden: f.golden,
          predicted: f.predicted,
          type: type
        });
      }
    });

    // Conflict miss
    if (ev.conflictDetection.shouldDetect && !ev.conflictDetection.detected) {
      badCases.push({
        productId: ev.productId,
        category: ev.category,
        field: "conflict_detection",
        golden: "应检测冲突",
        predicted: "未检测",
        type: "CONFLICT_MISS"
      });
    }

    // Wrong routing
    if (!ev.reviewRouting.correct) {
      badCases.push({
        productId: ev.productId,
        category: ev.category,
        field: "review_routing",
        golden: ev.reviewRouting.shouldRoute ? "应路由" : "不应路由",
        predicted: ev.reviewRouting.routed ? "已路由" : "未路由",
        type: "ROUTING_ERROR"
      });
    }
  });

  // Bad Case Taxonomy
  const taxonomy = {};
  badCases.forEach(bc => {
    if (!taxonomy[bc.type]) {
      taxonomy[bc.type] = [];
    }
    taxonomy[bc.type].push(bc);
  });

  // Modality Quality
  const modalityQuality = {
    textExtraction: 0,
    imageOCR: 0,
    visualAttribute: 0,
    voiceAttribute: 0,
    crossModalConsistency: 0
  };

  // 简化：基于 sourceTypes 统计
  let textCorrect = 0, textTotal = 0;
  let ocrCorrect = 0, ocrTotal = 0;
  let visualCorrect = 0, visualTotal = 0;
  let voiceCorrect = 0, voiceTotal = 0;

  evaluations.forEach(ev => {
    Object.keys(ev.fields).forEach(field => {
      const f = ev.fields[field];
      const sources = ev.result.fused[field]?.sourceTypes || [];

      if (sources.includes("text")) {
        textTotal++;
        if (f.correct) textCorrect++;
      }
      if (sources.includes("image_ocr")) {
        ocrTotal++;
        if (f.correct) ocrCorrect++;
      }
      if (sources.includes("visual")) {
        visualTotal++;
        if (f.correct) visualCorrect++;
      }
      if (sources.includes("voice_asr")) {
        voiceTotal++;
        if (f.correct) voiceCorrect++;
      }
    });
  });

  modalityQuality.textExtraction = textTotal > 0 ? (textCorrect / textTotal) * 100 : 0;
  modalityQuality.imageOCR = ocrTotal > 0 ? (ocrCorrect / ocrTotal) * 100 : 0;
  modalityQuality.visualAttribute = visualTotal > 0 ? (visualCorrect / visualTotal) * 100 : 0;
  modalityQuality.voiceAttribute = voiceTotal > 0 ? (voiceCorrect / voiceTotal) * 100 : 0;
  modalityQuality.crossModalConsistency = metrics.conflictRecall;

  return {
    metrics,
    fieldMetrics,
    badCases,
    taxonomy,
    modalityQuality,
    evaluations
  };
}
