import { useState, useEffect } from 'react';
import './App.css';
import { syntheticProducts } from './data/syntheticData.js';
import { processProduct } from './lib/evidenceEngine.js';

// Import pre-computed evaluation results
import evaluationResults from '../evaluation/v01/results.json';
import badCasesData from '../evaluation/v01/bad_cases.json';

function App() {
  const [activeMode, setActiveMode] = useState('text');
  const [textInput, setTextInput] = useState({
    title: "Apple iPhone 15 Pro Max 256g 午夜黑 国行全网通",
    spec: "品牌：Apple；型号：A3108；颜色：黑色；容量：256 GB；全新未拆封。"
  });
  const [images, setImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [voiceTranscript, setVoiceTranscript] = useState("这个是 iPhone 15 Pro Max，黑色，256G，国行版本，全新未拆。");
  const [isRecording, setIsRecording] = useState(false);
  const [runStatus, setRunStatus] = useState('READY');
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Use pre-computed evaluation results instead of computing on the fly
  const evaluation = evaluationResults;

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2200);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    showToast(`${files.length} file(s) uploaded`);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        showToast('Voice input captured');
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const handleRun = () => {
    setRunStatus('RUNNING');
    setTimeout(() => {
      const productInput = {
        category: "手机",
        text: textInput,
        image_ocr: ["512 GB"],
        voice_asr: voiceTranscript,
        visual: { color: "dark", category: "phone" }
      };
      const processed = processProduct(productInput);
      setResult(processed);
      setRunStatus('COMPLETE');
      showToast('Multimodal pipeline completed — review required');
    }, 950);
  };

  const currentProduct = syntheticProducts[0];

  return (
    <>
      <nav>
        <div className="wrap nav-inner">
          <a href="#top" className="logo">
            <span className="logo-main">CATALOGUE.</span>
            <span className="logo-sub">Multimodal Product Intelligence</span>
          </a>
          <div className="nav-links">
            <a href="#intake">INTAKE</a>
            <a href="#governance">GOVERNANCE</a>
            <a href="#evaluation">EVALUATION</a>
            <a href="#iterations">ITERATIONS</a>
          </div>
          <button className="nav-btn" onClick={() => document.getElementById('intake').scrollIntoView()}>
            RUN DEMO ↗
          </button>
        </div>
      </nav>

      <header className="hero wrap" id="top">
        <div className="hero-meta micro">
          <div>AI PRODUCT PORTFOLIO / 2026</div>
          <div>NO. 01</div>
          <div>SYNTHETIC / SELF-BUILT DATA</div>
        </div>
        <div className="hero-stage">
          <div className="hero-copy grid-bg">
            <div className="hero-kicker">
              <span className="pill">
                <span className="dot"></span>Multimodal Governance Agent
              </span>
              <span className="micro muted">Text / Image / Voice / Batch</span>
            </div>
            <div className="hero-no">01</div>
            <h1 className="hero-title serif">
              Understand the<br />product <em>before</em><br />you govern it.
            </h1>
            <div className="hero-desc">
              <div><div className="micro">Project</div><div style={{ font: '22px var(--serif)', marginTop: '7px' }}>AI 商品信息理解、治理与评测 Agent</div></div>
              <div className="muted">从商家真实发布链路出发，融合商品标题、详情、商品图片、包装标签、语音口述与批量文件，形成可溯源的商品 Schema，并完成规则治理、冲突检测和模型评测。</div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-head micro">
              <span>MULTIMODAL SCAN / SKU P-014</span>
              <span>LIVE SYSTEM</span>
            </div>
            <div className="scope"></div>
            <div className="cross"></div>
            <div className="object"></div>
            <div className="visual-bottom">
              <h2>One product.<br />Many signals.</h2>
              <div className="stats micro">
                <div>SOURCES<b>04</b></div>
                <div>FIELDS<b>18</b></div>
                <div>RULES<b>21</b></div>
                <div>CASES<b>{syntheticProducts.length}</b></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-foot micro">
          <div>01 / CAPTURE<br /><span className="muted">text / image / voice / file</span></div>
          <div>02 / UNDERSTAND<br /><span className="muted">OCR / ASR / LLM extraction</span></div>
          <div>03 / GOVERN<br /><span className="muted">normalize / validate / conflict</span></div>
          <div>04 / EVALUATE<br /><span className="muted">golden dataset / bad cases</span></div>
        </div>
      </header>

      <section id="intake" className="intake">
        <div className="wrap">
          <div className="section-top">
            <div>
              <div className="section-no">01</div>
              <div className="micro">Product Intake Workspace</div>
            </div>
            <div>
              <h2 className="section-title serif">Capture every signal.</h2>
              <p className="section-copy">
                电商商品信息不是一段干净文本。商家会上传主图、包装图、规格截图，口述卖点，也可能批量导入表格。Agent 需要先把这些"多来源证据"统一理解，再谈治理。
              </p>
            </div>
          </div>

          <div className="workspace">
            <div className="intake-left">
              <div className="micro">Input Sources</div>
              <div className="mode-tabs">
                {['text', 'image', 'voice', 'file'].map(mode => (
                  <button
                    key={mode}
                    className={`mode-tab ${activeMode === mode ? 'active' : ''}`}
                    onClick={() => setActiveMode(mode)}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={`input-panel ${activeMode === 'text' ? 'active' : ''}`}>
                <div className="label">Product Title</div>
                <textarea
                  value={textInput.title}
                  onChange={(e) => setTextInput({ ...textInput, title: e.target.value })}
                />
                <div className="label" style={{ marginTop: '15px' }}>Specification / Description</div>
                <textarea
                  value={textInput.spec}
                  onChange={(e) => setTextInput({ ...textInput, spec: e.target.value })}
                />
              </div>

              <div className={`input-panel ${activeMode === 'image' ? 'active' : ''}`}>
                <label className="upload-zone">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                  <div>
                    <div style={{ font: '26px var(--serif)', marginBottom: '10px' }}>
                      Drop product images here.
                    </div>
                    <div className="micro" style={{ color: '#7d7d78' }}>
                      MAIN IMAGE / PACKAGE / LABEL / SPEC SCREENSHOT
                    </div>
                  </div>
                </label>
                <div className="upload-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="thumb">
                      <img src={img} alt={`Upload ${idx + 1}`} />
                      <button className="thumb-remove" onClick={() => handleRemoveImage(idx)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`input-panel ${activeMode === 'voice' ? 'active' : ''}`}>
                <div className="wave">
                  {Array.from({ length: 52 }).map((_, i) => (
                    <i key={i} style={{ height: `${18 + Math.abs(Math.sin(i * 0.71)) * 62}px` }}></i>
                  ))}
                </div>
                <button className="record" onClick={handleVoiceRecord}>
                  {isRecording ? '■ STOP RECORDING' : '● START VOICE INPUT'}
                </button>
                <div style={{ marginTop: '12px', color: '#8d8d88', fontSize: '11px', lineHeight: '1.7' }}>
                  Demo transcript: "{voiceTranscript}"
                </div>
              </div>

              <div className={`input-panel ${activeMode === 'file' ? 'active' : ''}`}>
                {uploadedFiles.length === 0 ? (
                  <label className="upload-zone" style={{ minHeight: '160px' }}>
                    <input type="file" accept=".csv,.json,.xlsx" multiple onChange={handleFileUpload} />
                    <div>
                      <div style={{ font: '26px var(--serif)', marginBottom: '10px' }}>
                        Upload batch files.
                      </div>
                      <div className="micro" style={{ color: '#7d7d78' }}>
                        CSV / JSON / XLSX
                      </div>
                    </div>
                  </label>
                ) : (
                  <>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="file-box" style={{ marginBottom: '10px' }}>
                        <div>
                          <div className="micro">{file.name}</div>
                          <div style={{ fontSize: '11px', color: '#7f7f7a', marginTop: '6px' }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,.16)',
                            color: '#cfcfca',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            cursor: 'pointer'
                          }}
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                    <label className="file-box" style={{ marginTop: '10px', borderStyle: 'dashed' }}>
                      <input type="file" accept=".csv,.json,.xlsx" multiple onChange={handleFileUpload} />
                      <div>
                        <div className="micro">Add more files</div>
                      </div>
                      <div className="micro" style={{ color: '#7f7f7a' }}>CLICK</div>
                    </label>
                  </>
                )}
              </div>

              <div className="source-summary">
                <div className="source-chip"><span className="micro">Text</span><b>02</b></div>
                <div className="source-chip"><span className="micro">Image</span><b>{images.length}</b></div>
                <div className="source-chip"><span className="micro">Voice</span><b>01</b></div>
                <div className="source-chip"><span className="micro">Batch</span><b>{uploadedFiles.length > 0 ? uploadedFiles.length : '—'}</b></div>
              </div>

              <button className="run" onClick={handleRun} disabled={runStatus === 'RUNNING'}>
                <span>Fuse evidence & run governance</span><span>↗</span>
              </button>

              <div className="pipeline-strip">
                {['OCR / ASR', 'Extract', 'Fuse', 'Normalize', 'Validate', 'Review'].map((label, idx) => (
                  <div key={idx} className="pipe">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <b>{label}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="intake-right">
              <div className="evidence-head">
                <div>
                  <div className="micro">Evidence Board</div>
                  <div style={{ fontSize: '11px', color: '#85857f', marginTop: '6px' }}>
                    Every attribute keeps its source.
                  </div>
                </div>
                <span className="pill" style={{ color: '#eee', borderColor: 'rgba(255,255,255,.15)' }}>
                  <span className="dot" style={{ background: 'white' }}></span>
                  <span>{runStatus}</span>
                </span>
              </div>

              {result && result.evidences && (
                <div className="evidence-stack">
                  {result.evidences.slice(0, 4).map((ev, idx) => (
                    <div key={idx} className="evidence">
                      <div className="ev-type">{ev.sourceType.toUpperCase()}</div>
                      <div className="ev-main">
                        {ev.field}: "{ev.value}"
                        <small>{ev.source}</small>
                      </div>
                      <div className="ev-score">{ev.confidence.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}

              {!result && (
                <div className="evidence-stack">
                  <div className="evidence">
                    <div className="ev-type">TEXT</div>
                    <div className="ev-main">"iPhone 15 Pro Max 256g 午夜黑"<small>title / source_01</small></div>
                    <div className="ev-score">0.98</div>
                  </div>
                </div>
              )}

              {result && result.fused && (
                <div className="fusion">
                  <div className="micro" style={{ marginBottom: '8px' }}>Evidence Fusion</div>
                  {Object.keys(result.fused).slice(0, 4).map(field => {
                    const item = result.fused[field];
                    return (
                      <div key={field} className="fusion-row">
                        <span>{field}</span>
                        <strong className={item.status === 'CONFLICT' ? 'conflict' : ''}>
                          {item.conflictValues ? item.conflictValues.join(' ↔ ') : item.value}
                        </strong>
                        <span className="micro">
                          {item.status === 'CONFLICT' ? 'CONFLICT' : item.sourceTypes.join(' + ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <pre style={{
                marginTop: '22px',
                paddingTop: '18px',
                borderTop: '1px solid rgba(255,255,255,.12)',
                whiteSpace: 'pre-wrap',
                color: '#bdbdb7',
                font: '10px/1.7 var(--mono)'
              }}>
                {result ? JSON.stringify({
                  category: result.category,
                  reviewRequired: result.reviewRequired,
                  issues: result.issues.length,
                  conflicts: result.conflicts.length
                }, null, 2) : '{\n  "status": "ready",\n  "message": "Run multimodal governance pipeline."\n}'}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section id="governance" className="governance">
        <div className="wrap">
          <div className="section-top">
            <div>
              <div className="section-no">02</div>
              <div className="micro">Governance Result</div>
            </div>
            <div>
              <h2 className="section-title serif">Evidence, not guesses.</h2>
              <p className="section-copy">
                当不同来源给出不同结论，系统不应简单"相信模型"。治理页把字段值、来源、规则状态与复核动作放在同一个决策界面里。
              </p>
            </div>
          </div>

          <div className="gov-layout">
            <div className="product-poster">
              <div className="micro">Synthetic Product Portrait / SKU {currentProduct.id}</div>
              <div className="poster-frame"></div>
              <div className="poster-object"></div>
              <div className="poster-meta">
                <div>
                  <div className="micro">Category / {currentProduct.category}</div>
                  <h3>{currentProduct.golden.model || 'Product'}</h3>
                </div>
                <div className="micro">SCHEMA V0.1</div>
              </div>
            </div>

            <div className="gov-panel">
              <div className="gov-head">
                <div>
                  <div className="micro">Normalized Product Schema</div>
                  <div className="muted" style={{ fontSize: '11px', marginTop: '6px' }}>
                    Source-aware · Rule-aware · Review-aware
                  </div>
                </div>
                <span className="status">
                  {result?.reviewRequired ? 'Review Required' : 'Ready'}
                </span>
              </div>

              <div className="audit">
                {result && result.fused && Object.keys(result.fused).map(field => {
                  const item = result.fused[field];
                  return (
                    <div key={field} className="audit-row">
                      <span>{field}</span>
                      <div>
                        <strong>{item.conflictValues ? item.conflictValues.join(' ↔ ') : item.value}</strong>
                        <div className="source-tags">
                          {item.sourceTypes.map((st, idx) => (
                            <span key={idx} className="source-tag">{st}</span>
                          ))}
                        </div>
                      </div>
                      <span className="audit-state">{item.status}</span>
                    </div>
                  );
                })}

                {!result && Object.keys(currentProduct.golden).slice(0, 4).map(field => (
                  <div key={field} className="audit-row">
                    <span>{field}</span>
                    <div>
                      <strong>{currentProduct.golden[field]}</strong>
                      <div className="source-tags">
                        <span className="source-tag">TEXT</span>
                      </div>
                    </div>
                    <span className="audit-state">VALID</span>
                  </div>
                ))}
              </div>

              {result && result.issues.length > 0 && (
                <div className="issue">
                  <div className="issue-num">01</div>
                  <div>
                    <div className="micro">Detected Issue</div>
                    <h4>{result.issues[0].type} / {result.issues[0].field}</h4>
                    <p>{result.issues[0].message}</p>
                  </div>
                  <div className="review-actions">
                    <button>RESOLVE</button>
                    <button className="primary">SEND REVIEW</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="evaluation" className="eval">
        <div className="wrap">
          <div className="section-top">
            <div>
              <div className="section-no">03</div>
              <div className="micro">Evaluation</div>
            </div>
            <div>
              <h2 className="section-title serif">Evaluate each modality.</h2>
              <p className="section-copy">
                多模态场景下，不能只看"字段准确率"。要分别评估文本抽取、图片 OCR / 视觉识别、语音转写后的属性提取、跨模态一致性，以及错误是否被正确路由到人工复核。
              </p>
            </div>
          </div>

          {evaluation && (
            <div className="eval-board">
              <div className="metrics-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="micro">V0.1 Baseline / Real Metrics</div>
                    <div className="muted" style={{ fontSize: '10px', marginTop: '6px' }}>
                      Local evaluation · Pre-computed results · n={evaluation.dataset.total}
                    </div>
                  </div>
                  <span className="pill">SYNTHETIC DATA</span>
                </div>

                <div className="metric-strip">
                  <div className="metric">
                    <div className="metric-v">{evaluation.metrics.fieldAccuracy.toFixed(1)}</div>
                    <div className="metric-l">Field Accuracy</div>
                  </div>
                  <div className="metric">
                    <div className="metric-v">{evaluation.metrics.f1.toFixed(1)}</div>
                    <div className="metric-l">F1</div>
                  </div>
                  <div className="metric">
                    <div className="metric-v">{evaluation.metrics.conflictRecall.toFixed(1)}</div>
                    <div className="metric-l">Conflict Recall</div>
                  </div>
                  <div className="metric">
                    <div className="metric-v">{evaluation.metrics.evidenceGrounding.toFixed(1)}</div>
                    <div className="metric-l">Evidence Grounding</div>
                  </div>
                  <div className="metric">
                    <div className="metric-v">{evaluation.metrics.reviewRoutingPrecision.toFixed(1)}</div>
                    <div className="metric-l">Review Precision</div>
                  </div>
                </div>

                <div className="eval-grid">
                  <div>
                    <div className="micro" style={{ marginBottom: '14px' }}>Field-level Quality</div>
                    <div className="bars">
                      {Object.entries(evaluation.fieldMetrics).slice(0, 5).map(([field, score]) => (
                        <div key={field} className="bar">
                          <span>{field}</span>
                          <div className="track">
                            <div className="fill" style={{ width: `${score}%` }}></div>
                          </div>
                          <strong>{Math.round(score)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="micro" style={{ marginBottom: '14px' }}>Bad Case Taxonomy</div>
                    {badCasesData.taxonomy.slice(0, 4).map((item) => (
                      <div key={item.type} className="case">
                        <div>
                          <b>{item.type.replace(/_/g, ' ')}</b>
                          <small>{item.percentage}%</small>
                        </div>
                        <div className="case-n">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="quality">
                <div className="micro">Modality Quality</div>
                <h3 style={{ font: '34px/1 var(--serif)', letterSpacing: '-.05em', margin: '16px 0 20px' }}>
                  Where each signal breaks.
                </h3>
                <div className="modal-evals">
                  <div className="modal-row">
                    <div>
                      <strong>Text Extraction</strong>
                      <small>title / description / specs</small>
                    </div>
                    <div className="modal-score">{Math.round(evaluation.modalityQuality.textExtraction)}</div>
                  </div>
                  <div className="modal-row">
                    <div>
                      <strong>Image OCR</strong>
                      <small>package / label / parameter screenshot</small>
                    </div>
                    <div className="modal-score">{Math.round(evaluation.modalityQuality.imageOCR)}</div>
                  </div>
                  <div className="modal-row">
                    <div>
                      <strong>Visual Attribute Recognition</strong>
                      <small>color / category / form factor</small>
                    </div>
                    <div className="modal-score">{Math.round(evaluation.modalityQuality.visualAttribute)}</div>
                  </div>
                  <div className="modal-row">
                    <div>
                      <strong>Voice → Attribute</strong>
                      <small>ASR + semantic extraction</small>
                    </div>
                    <div className="modal-score">{Math.round(evaluation.modalityQuality.voiceAttribute)}</div>
                  </div>
                  <div className="modal-row">
                    <div>
                      <strong>Cross-modal Consistency</strong>
                      <small>evidence fusion / conflict routing</small>
                    </div>
                    <div className="modal-score">{Math.round(evaluation.modalityQuality.crossModalConsistency)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="iterations">
        <div className="wrap">
          <div className="section-top">
            <div>
              <div className="section-no">04</div>
              <div className="micro">Iteration Archive</div>
            </div>
            <div>
              <h2 className="section-title serif">Bad cases become rules.</h2>
              <p className="section-copy">
                V0.1 先解决基础文本抽取；V0.2 引入图片与语音证据；V0.3 则重点优化跨模态冲突、证据可信度和人工复核路由。
              </p>
            </div>
          </div>
          <div className="versions">
            <article className="version">
              <div className="micro">Baseline</div>
              <div className="v-no">V0.1</div>
              <h3>Text-first Product Governance</h3>
              <p>建立 Schema、Golden Dataset、基础 Prompt 与规则校验，先跑通文本商品信息的抽取与治理闭环。</p>
              <div className="v-foot">
                <span>FOCUS</span>
                <strong>TEXT / RULES</strong>
              </div>
            </article>
            <article className="version">
              <div className="micro">Multimodal</div>
              <div className="v-no">V0.2</div>
              <h3>Image + Voice Evidence Fusion</h3>
              <p>加入图片 OCR、视觉属性、语音转写与跨来源证据关联；让每个字段值都能回溯到输入来源。</p>
              <div className="v-foot">
                <span>FOCUS</span>
                <strong>OCR / ASR / FUSION</strong>
              </div>
            </article>
            <article className="version">
              <div className="micro">Review-aware</div>
              <div className="v-no">V0.3</div>
              <h3>Conflict-aware Human Review</h3>
              <p>针对跨模态冲突、低置信度与高风险字段，优化 review routing 和疑难 Case 处理。</p>
              <div className="v-foot">
                <span>FOCUS</span>
                <strong>CONFLICT / REVIEW</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="micro">AI PRODUCT PORTFOLIO / 2026</div>
          <h2 className="footer-title">
            One product.<br /><em>Many truths.</em>
          </h2>
          <div className="footer-grid">
            <div>
              <strong style={{ color: '#eee' }}>Multimodal Product Intelligence & Governance Agent</strong>
              <br /><br />
              <strong>Architecture: Local Evaluation + Online Demo Separation</strong>
              <br /><br />
              Model evaluation is executed in the local Claude development environment; the deployed web demo is used for interactive visualization and result presentation.
              <br /><br />
              所有商品样本、图片、语音、规则与指标均为模拟 / 自建数据。
              <br />
              Synthetic / Self-built Demo. No production platform data.
            </div>
            <div>
              TEXT · IMAGE · VOICE · BATCH<br />
              OCR · ASR · EXTRACTION<br />
              EVIDENCE FUSION · SCHEMA
            </div>
            <div>
              RULE ENGINE · CONFLICT<br />
              HUMAN REVIEW · GOLDEN DATASET<br />
              EVALUATION · BAD CASE
            </div>
          </div>
        </div>
      </footer>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}

export default App;
