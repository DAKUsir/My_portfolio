function WindowBar({ title }: { title: string }) {
  return (
    <div className="visual-window-bar">
      <span className="visual-window-dots"><i /><i /><i /></span>
      <span>{title}</span>
      <span className="visual-window-mark">↗</span>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "finishit") {
    return (
      <div className="project-art art-finishit" aria-hidden="true">
        <div className="visual-app-window">
          <WindowBar title="finishit / my week" />
          <div className="focus-panel">
            <div><span>YOUR NEXT FOCUS</span><b>Build a small model</b><small>25 min · Machine learning</small></div>
            <span className="focus-play">▶</span>
          </div>
          <div className="focus-progress"><i /></div>
          <div className="focus-note"><span>✳</span> A plan that adapts as you learn</div>
        </div>
        <span className="visual-number">01 / LEARNING LOOP</span>
      </div>
    );
  }

  if (kind === "krishi") {
    return (
      <div className="project-art art-krishi" role="img" aria-label="Krishi Bazar farming assistant interface over an agricultural landscape">
        <div className="market-topography" />
        <svg className="market-route" viewBox="0 0 460 240" fill="none" aria-hidden="true">
          <path d="M-10 204C96 176 134 225 230 188S367 167 480 110" />
          <path d="M-18 228C91 199 134 245 238 210S382 187 488 132" />
          <path d="M-12 179C88 151 139 201 226 165S357 145 473 85" />
        </svg>
        <div className="market-sun"><span>KRISHI<br />BAZAR</span></div>
        <div className="market-card"><span>FARM ASSIST</span><b>Grow with better insight</b><small>Crop health · Market access</small></div>
        <span className="market-pin market-pin-one" /><span className="market-pin market-pin-two" />
        <span className="visual-number">02 / FIELD TO MARKET</span>
      </div>
    );
  }

  if (kind === "cancer") {
    return (
      <div className="project-art art-cancer" aria-hidden="true">
        <div className="scan-grid" />
        <div className="scan-rings"><i /><i /><i /><span /></div>
        <div className="scan-panel">
          <span className="scan-label">MODEL EXPLAINABILITY</span>
          <div className="scan-score"><b>09</b><span>classifiers<br />benchmarked</span></div>
          <div className="scan-bars"><i /><i /><i /><i /><i /></div>
          <div className="scan-legend"><span><i />SHAP + LIME</span><span>FEATURE IMPACT</span></div>
        </div>
        <span className="visual-number">03 / INTERPRETABLE AI</span>
      </div>
    );
  }

  if (kind === "eye") {
    return (
      <div className="project-art art-eye" aria-hidden="true">
        <div className="retina-glow" />
        <svg className="retina" viewBox="0 0 300 230" fill="none">
          <circle cx="150" cy="115" r="85" />
          <circle cx="150" cy="115" r="58" />
          <circle cx="150" cy="115" r="28" />
          <path d="M150 30v170M65 115h170M90 55l120 120M210 55 90 175" />
          <path d="M150 115c-28-29-34-54-24-78M150 115c31-12 53-32 66-58M150 115c-4 35 9 62 34 83M150 115c-35 8-61 3-81-16" />
          <circle cx="150" cy="115" r="7" className="retina-center" />
        </svg>
        <span className="retina-tag">CNN <b>×</b> ViT</span>
        <span className="retina-caption">LOCAL DETAIL / GLOBAL CONTEXT</span>
        <span className="visual-number">04 / VISION STUDY</span>
      </div>
    );
  }

  return (
    <div className="project-art art-gpt" aria-hidden="true">
      <div className="code-window">
        <WindowBar title="fine_tune.py" />
        <div className="code-lines">
          <span><i>01</i><b>model</b> = GPT2ForSequenceClassification()</span>
          <span><i>02</i><b>trainer</b> = Trainer(</span>
          <span><i>03</i>&nbsp;&nbsp;gradient_accumulation_steps=<em>4</em>,</span>
          <span><i>04</i>&nbsp;&nbsp;warmup_ratio=<em>0.1</em></span>
          <span><i>05</i>)</span>
        </div>
        <div className="code-result"><span>VALIDATION F1</span><b>0.85+</b><i /></div>
      </div>
      <span className="visual-number">05 / LANGUAGE SYSTEMS</span>
    </div>
  );
}
