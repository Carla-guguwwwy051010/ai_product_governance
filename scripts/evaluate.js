// V0.1 Evaluation Script
// 运行完整评测并生成报告

import { writeFileSync } from 'fs';
import { syntheticProducts } from '../src/data/syntheticData.js';
import { evaluateDataset } from '../src/lib/evaluationEngine.js';

console.log('🚀 Running V0.1 Evaluation...\n');

// 运行评测
const startTime = Date.now();
const evaluation = evaluateDataset(syntheticProducts);
const duration = Date.now() - startTime;

// 打印主要指标
console.log('📊 V0.1 Evaluation Results');
console.log('═'.repeat(50));
console.log(`Dataset Size: ${evaluation.metrics.total} products`);
console.log(`Duration: ${duration}ms\n`);

console.log('Main Metrics:');
console.log(`  Field Accuracy:           ${evaluation.metrics.fieldAccuracy.toFixed(2)}%`);
console.log(`  Precision:                ${evaluation.metrics.precision.toFixed(2)}%`);
console.log(`  Recall:                   ${evaluation.metrics.recall.toFixed(2)}%`);
console.log(`  F1 Score:                 ${evaluation.metrics.f1.toFixed(2)}%`);
console.log(`  Completeness:             ${evaluation.metrics.completeness.toFixed(2)}%`);
console.log(`  Conflict Recall:          ${evaluation.metrics.conflictRecall.toFixed(2)}%`);
console.log(`  Evidence Grounding:       ${evaluation.metrics.evidenceGrounding.toFixed(2)}%`);
console.log(`  Review Routing Precision: ${evaluation.metrics.reviewRoutingPrecision.toFixed(2)}%\n`);

console.log('Modality Quality:');
console.log(`  Text Extraction:          ${evaluation.modalityQuality.textExtraction.toFixed(2)}%`);
console.log(`  Image OCR:                ${evaluation.modalityQuality.imageOCR.toFixed(2)}%`);
console.log(`  Visual Attribute:         ${evaluation.modalityQuality.visualAttribute.toFixed(2)}%`);
console.log(`  Voice Attribute:          ${evaluation.modalityQuality.voiceAttribute.toFixed(2)}%`);
console.log(`  Cross-modal Consistency:  ${evaluation.modalityQuality.crossModalConsistency.toFixed(2)}%\n`);

console.log('Field-level Quality:');
Object.entries(evaluation.fieldMetrics).forEach(([field, score]) => {
  console.log(`  ${field.padEnd(20)} ${score.toFixed(2)}%`);
});

console.log('\nBad Case Taxonomy:');
Object.entries(evaluation.taxonomy).forEach(([type, cases]) => {
  console.log(`  ${type.padEnd(25)} ${cases.length} cases`);
});

console.log('\n' + '═'.repeat(50));

// 生成详细报告
const report = {
  version: 'V0.1',
  timestamp: new Date().toISOString(),
  dataset: {
    total: syntheticProducts.length,
    categories: {
      '手机': syntheticProducts.filter(p => p.category === '手机').length,
      '洗发水': syntheticProducts.filter(p => p.category === '洗发水').length,
      '饮料': syntheticProducts.filter(p => p.category === '饮料').length
    }
  },
  metrics: evaluation.metrics,
  modalityQuality: evaluation.modalityQuality,
  fieldMetrics: evaluation.fieldMetrics,
  badCases: evaluation.badCases.map(bc => ({
    productId: bc.productId,
    category: bc.category,
    field: bc.field,
    golden: bc.golden,
    predicted: bc.predicted,
    type: bc.type
  })),
  taxonomy: Object.entries(evaluation.taxonomy).map(([type, cases]) => ({
    type,
    count: cases.length,
    examples: cases.slice(0, 3).map(c => ({
      productId: c.productId,
      field: c.field,
      golden: c.golden,
      predicted: c.predicted
    }))
  })),
  duration_ms: duration,
  dataDeclaration: 'All data is Synthetic / Self-built. No production platform data.'
};

// 保存报告
writeFileSync(
  'evaluation/v01/report.json',
  JSON.stringify(report, null, 2)
);

console.log('✅ Report saved to evaluation/v01/report.json');

// 打印前5个 Bad Cases
console.log('\n📋 Top 5 Bad Cases:');
evaluation.badCases.slice(0, 5).forEach((bc, idx) => {
  console.log(`\n${idx + 1}. [${bc.type}] ${bc.productId} - ${bc.field}`);
  console.log(`   Golden:    ${bc.golden}`);
  console.log(`   Predicted: ${bc.predicted}`);
});

console.log('\n✨ Evaluation complete!');
