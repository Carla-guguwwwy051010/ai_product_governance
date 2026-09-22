// V0.1 Complete Evaluation Script
// 本地环境真实运行评测，生成完整结果文件

import { writeFileSync, mkdirSync } from 'fs';
import { syntheticProducts } from '../src/data/syntheticData.js';
import { processProduct } from '../src/lib/evidenceEngine.js';
import { evaluateDataset } from '../src/lib/evaluationEngine.js';

console.log('🚀 Running V0.1 Complete Evaluation...\n');
console.log('Architecture: Local Evaluation + Online Demo Separation');
console.log('═'.repeat(60));

// Ensure output directory exists
mkdirSync('evaluation/v01', { recursive: true });

// Run complete evaluation
const startTime = Date.now();
const evaluation = evaluateDataset(syntheticProducts);
const duration = Date.now() - startTime;

console.log('\n📊 V0.1 Evaluation Results');
console.log('═'.repeat(60));
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

console.log('\n' + '═'.repeat(60));

// ===== 1. Generate results.json =====
const results = {
  version: 'V0.1',
  timestamp: new Date().toISOString(),
  architecture: 'Local Evaluation + Online Demo Separation',
  description: 'Model evaluation executed in local Claude environment; web demo displays pre-computed results',
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
  duration_ms: duration,
  dataDeclaration: 'All data is Synthetic / Self-built. No production platform data.'
};

writeFileSync('evaluation/v01/results.json', JSON.stringify(results, null, 2));
console.log('✅ Generated: evaluation/v01/results.json');

// ===== 2. Generate bad_cases.json =====
const badCasesData = {
  version: 'V0.1',
  timestamp: new Date().toISOString(),
  total: evaluation.badCases.length,
  taxonomy: Object.entries(evaluation.taxonomy).map(([type, cases]) => ({
    type,
    count: cases.length,
    percentage: ((cases.length / evaluation.badCases.length) * 100).toFixed(1)
  })),
  cases: evaluation.badCases.map((bc, idx) => ({
    id: idx + 1,
    productId: bc.productId,
    category: bc.category,
    field: bc.field,
    golden: bc.golden,
    predicted: bc.predicted,
    type: bc.type,
    severity: bc.type === 'CONFLICT_MISS' || bc.type === 'MISSING_FIELD' ? 'high' : 'medium'
  })),
  summary: {
    byType: Object.fromEntries(
      Object.entries(evaluation.taxonomy).map(([type, cases]) => [type, cases.length])
    ),
    byCategory: {}
  }
};

// Calculate by category
syntheticProducts.forEach(p => {
  const casesForProduct = evaluation.badCases.filter(bc => bc.productId === p.id);
  if (!badCasesData.summary.byCategory[p.category]) {
    badCasesData.summary.byCategory[p.category] = 0;
  }
  badCasesData.summary.byCategory[p.category] += casesForProduct.length;
});

writeFileSync('evaluation/v01/bad_cases.json', JSON.stringify(badCasesData, null, 2));
console.log('✅ Generated: evaluation/v01/bad_cases.json');

// ===== 3. Generate report.md =====
const reportMd = `# V0.1 Evaluation Report

**Version**: V0.1 Baseline
**Timestamp**: ${new Date().toISOString()}
**Architecture**: Local Evaluation + Online Demo Separation
**Dataset**: 30 Synthetic Products (手机 10 + 洗发水 10 + 饮料 10)
**Duration**: ${duration}ms

---

## Architecture

**Evaluation Environment**: Local Claude Code environment
**Execution**: Real-time processing of Golden Dataset with Evidence Engine + Rule Engine
**Output**: Pre-computed results (results.json, bad_cases.json)
**Demo Environment**: Online web application
**Display**: Interactive visualization of pre-computed evaluation results

> Model evaluation is executed in the local Claude development environment; the deployed web demo is used for interactive visualization and result presentation.

---

## Core Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Field Accuracy** | **${evaluation.metrics.fieldAccuracy.toFixed(2)}%** | >85% | ${evaluation.metrics.fieldAccuracy >= 85 ? '✅' : '⚠️'} |
| **Precision** | **${evaluation.metrics.precision.toFixed(2)}%** | >90% | ${evaluation.metrics.precision >= 90 ? '✅' : '⚠️'} |
| **Recall** | **${evaluation.metrics.recall.toFixed(2)}%** | >80% | ${evaluation.metrics.recall >= 80 ? '✅' : '⚠️'} |
| **F1 Score** | **${evaluation.metrics.f1.toFixed(2)}%** | >80% | ${evaluation.metrics.f1 >= 80 ? '✅' : '⚠️'} |
| **Completeness** | **${evaluation.metrics.completeness.toFixed(2)}%** | >50% | ${evaluation.metrics.completeness >= 50 ? '✅' : '⚠️'} |
| **Conflict Recall** | **${evaluation.metrics.conflictRecall.toFixed(2)}%** | >80% | ${evaluation.metrics.conflictRecall >= 80 ? '✅' : '⚠️'} |
| **Evidence Grounding** | **${evaluation.metrics.evidenceGrounding.toFixed(2)}%** | >90% | ${evaluation.metrics.evidenceGrounding >= 90 ? '✅' : '⚠️'} |
| **Review Routing Precision** | **${evaluation.metrics.reviewRoutingPrecision.toFixed(2)}%** | >80% | ${evaluation.metrics.reviewRoutingPrecision >= 80 ? '✅' : '⚠️'} |

---

## Modality Quality

| Modality | Accuracy | Status |
|----------|----------|--------|
| Text Extraction | ${evaluation.modalityQuality.textExtraction.toFixed(2)}% | ${evaluation.modalityQuality.textExtraction >= 85 ? '✅' : '⚠️'} |
| Image OCR | ${evaluation.modalityQuality.imageOCR.toFixed(2)}% | ${evaluation.modalityQuality.imageOCR >= 85 ? '✅' : '⚠️'} |
| Visual Attribute | ${evaluation.modalityQuality.visualAttribute.toFixed(2)}% | ${evaluation.modalityQuality.visualAttribute >= 85 ? '✅' : '⚠️'} |
| Voice Attribute | ${evaluation.modalityQuality.voiceAttribute.toFixed(2)}% | ${evaluation.modalityQuality.voiceAttribute >= 85 ? '✅' : '⚠️'} |
| Cross-modal Consistency | ${evaluation.modalityQuality.crossModalConsistency.toFixed(2)}% | ${evaluation.modalityQuality.crossModalConsistency >= 80 ? '✅' : '⚠️'} |

---

## Field-level Quality

| Field | Accuracy | Status |
|-------|----------|--------|
${Object.entries(evaluation.fieldMetrics).map(([field, score]) =>
  `| ${field} | ${score.toFixed(2)}% | ${score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌'} |`
).join('\n')}

---

## Bad Cases Analysis

**Total Bad Cases**: ${evaluation.badCases.length}

### By Type

| Type | Count | Percentage |
|------|-------|------------|
${Object.entries(evaluation.taxonomy).map(([type, cases]) =>
  `| ${type} | ${cases.length} | ${((cases.length / evaluation.badCases.length) * 100).toFixed(1)}% |`
).join('\n')}

### Top 10 Bad Cases

${evaluation.badCases.slice(0, 10).map((bc, idx) => `
#### ${idx + 1}. [${bc.type}] ${bc.productId} - ${bc.field}
- **Golden**: ${bc.golden}
- **Predicted**: ${bc.predicted}
- **Category**: ${bc.category}
`).join('\n')}

---

## Key Findings

### ✅ Strengths
1. **High Precision (${evaluation.metrics.precision.toFixed(2)}%)** - Low hallucination rate
2. **Perfect Evidence Grounding (${evaluation.metrics.evidenceGrounding.toFixed(2)}%)** - All fields traceable
3. **Strong Core Fields** - brand (${evaluation.fieldMetrics.brand?.toFixed(2)}%), model (${evaluation.fieldMetrics.model?.toFixed(2)}%)
4. **Excellent Text Extraction (${evaluation.modalityQuality.textExtraction.toFixed(2)}%)**

### ⚠️ Areas for Improvement
1. **Field Accuracy (${evaluation.metrics.fieldAccuracy.toFixed(2)}%)** - Below 85% target
2. **Completeness (${evaluation.metrics.completeness.toFixed(2)}%)** - Only ${Math.round(evaluation.metrics.completeness * evaluation.metrics.total / 100)}/${evaluation.metrics.total} products fully correct
3. **Conflict Recall (${evaluation.metrics.conflictRecall.toFixed(2)}%)** - Missing some cross-modal conflicts
4. **Low-accuracy Fields** - region (${evaluation.fieldMetrics.region?.toFixed(2) || 'N/A'}%), condition (${evaluation.fieldMetrics.condition?.toFixed(2) || 'N/A'}%)

---

## Recommendations for V0.2

1. **Improve Missing Fields**
   - Add default value inference for region and condition
   - Expand keyword coverage for package, flavor, scent

2. **Enhance Conflict Detection**
   - Implement semantic similarity checks
   - Adjust conflict detection thresholds

3. **Optimize Review Routing**
   - Introduce risk stratification (high/medium/low)
   - Reduce false positive routing

4. **Expand Dataset**
   - Add 20 more products (target: 50 total)
   - Include more edge cases

---

## Data Declaration

All data, metrics, and results are based on **Synthetic / Self-built** datasets. No production platform data or internal metrics are included.

---

**Report Generated**: ${new Date().toISOString()}
**Evaluation Duration**: ${duration}ms
**Architecture**: Local Evaluation + Online Demo Separation
`;

writeFileSync('evaluation/v01/report.md', reportMd);
console.log('✅ Generated: evaluation/v01/report.md');

// ===== 4. Generate summary for display =====
const displaySummary = {
  headline: {
    fieldAccuracy: evaluation.metrics.fieldAccuracy.toFixed(1),
    f1Score: evaluation.metrics.f1.toFixed(1),
    evidenceGrounding: evaluation.metrics.evidenceGrounding.toFixed(1),
    totalCases: evaluation.badCases.length
  },
  quickStats: {
    totalProducts: evaluation.metrics.total,
    completeProducts: Math.round(evaluation.metrics.completeness * evaluation.metrics.total / 100),
    highSeverityIssues: evaluation.badCases.filter(bc =>
      bc.type === 'CONFLICT_MISS' || bc.type === 'MISSING_FIELD'
    ).length
  }
};

writeFileSync('evaluation/v01/display_summary.json', JSON.stringify(displaySummary, null, 2));
console.log('✅ Generated: evaluation/v01/display_summary.json');

console.log('\n' + '═'.repeat(60));
console.log('✨ V0.1 Evaluation Complete!');
console.log('\nGenerated Files:');
console.log('  📊 evaluation/v01/results.json');
console.log('  🔍 evaluation/v01/bad_cases.json');
console.log('  📝 evaluation/v01/report.md');
console.log('  📈 evaluation/v01/display_summary.json');
console.log('\nArchitecture: Local Evaluation + Online Demo Separation');
console.log('Next: Update web app to load pre-computed results');
console.log('═'.repeat(60));
