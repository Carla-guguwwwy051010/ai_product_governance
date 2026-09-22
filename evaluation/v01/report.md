# V0.1 Evaluation Report

**Version**: V0.1 Baseline
**Timestamp**: 2026-09-20T08:34:12.609Z
**Architecture**: Local Evaluation + Online Demo Separation
**Dataset**: 30 Synthetic Products (手机 10 + 洗发水 10 + 饮料 10)
**Duration**: 31ms

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
| **Field Accuracy** | **76.25%** | >85% | ⚠️ |
| **Precision** | **96.06%** | >90% | ✅ |
| **Recall** | **82.99%** | >80% | ✅ |
| **F1 Score** | **89.05%** | >80% | ✅ |
| **Completeness** | **20.00%** | >50% | ⚠️ |
| **Conflict Recall** | **66.67%** | >80% | ⚠️ |
| **Evidence Grounding** | **100.00%** | >90% | ✅ |
| **Review Routing Precision** | **73.33%** | >80% | ⚠️ |

---

## Modality Quality

| Modality | Accuracy | Status |
|----------|----------|--------|
| Text Extraction | 94.53% | ✅ |
| Image OCR | 90.00% | ✅ |
| Visual Attribute | 100.00% | ✅ |
| Voice Attribute | 93.18% | ✅ |
| Cross-modal Consistency | 66.67% | ⚠️ |

---

## Field-level Quality

| Field | Accuracy | Status |
|-------|----------|--------|
| brand | 100.00% | ✅ |
| model | 100.00% | ✅ |
| color | 90.00% | ✅ |
| capacity | 90.00% | ✅ |
| region | 30.00% | ❌ |
| condition | 30.00% | ❌ |
| product_name | 80.00% | ✅ |
| volume | 90.00% | ✅ |
| scent | 70.00% | ⚠️ |
| function | 80.00% | ✅ |
| package | 50.00% | ❌ |
| flavor | 40.00% | ❌ |

---

## Bad Cases Analysis

**Total Bad Cases**: 47

### By Type

| Type | Count | Percentage |
|------|-------|------------|
| EXTRACTION_ERROR | 13 | 27.7% |
| ROUTING_ERROR | 8 | 17.0% |
| MISSING_FIELD | 24 | 51.1% |
| CONFLICT_MISS | 2 | 4.3% |

### Top 10 Bad Cases


#### 1. [EXTRACTION_ERROR] P-001 - capacity
- **Golden**: 256GB
- **Predicted**: 512GB
- **Category**: 手机


#### 2. [ROUTING_ERROR] P-002 - review_routing
- **Golden**: 不应路由
- **Predicted**: 已路由
- **Category**: 手机


#### 3. [MISSING_FIELD] P-003 - region
- **Golden**: 中国大陆
- **Predicted**: undefined
- **Category**: 手机


#### 4. [MISSING_FIELD] P-003 - condition
- **Golden**: 全新
- **Predicted**: undefined
- **Category**: 手机


#### 5. [EXTRACTION_ERROR] P-004 - color
- **Golden**: null
- **Predicted**: undefined
- **Category**: 手机


#### 6. [MISSING_FIELD] P-004 - region
- **Golden**: 中国大陆
- **Predicted**: undefined
- **Category**: 手机


#### 7. [MISSING_FIELD] P-004 - condition
- **Golden**: 全新
- **Predicted**: undefined
- **Category**: 手机


#### 8. [ROUTING_ERROR] P-004 - review_routing
- **Golden**: 应路由
- **Predicted**: 未路由
- **Category**: 手机


#### 9. [MISSING_FIELD] P-005 - region
- **Golden**: 中国大陆
- **Predicted**: undefined
- **Category**: 手机


#### 10. [MISSING_FIELD] P-005 - condition
- **Golden**: 全新
- **Predicted**: undefined
- **Category**: 手机


---

## Key Findings

### ✅ Strengths
1. **High Precision (96.06%)** - Low hallucination rate
2. **Perfect Evidence Grounding (100.00%)** - All fields traceable
3. **Strong Core Fields** - brand (100.00%), model (100.00%)
4. **Excellent Text Extraction (94.53%)**

### ⚠️ Areas for Improvement
1. **Field Accuracy (76.25%)** - Below 85% target
2. **Completeness (20.00%)** - Only 6/30 products fully correct
3. **Conflict Recall (66.67%)** - Missing some cross-modal conflicts
4. **Low-accuracy Fields** - region (30.00%), condition (30.00%)

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

**Report Generated**: 2026-09-20T08:34:12.610Z
**Evaluation Duration**: 31ms
**Architecture**: Local Evaluation + Online Demo Separation
