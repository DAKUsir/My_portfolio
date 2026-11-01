export function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "finishit") {
    return (
      <div className="project-art art-finishit" aria-hidden="true">
        <div className="art-window-bar">
          <span className="window-dots"><i /><i /><i /></span>
          <span>today / learning plan</span>
          <span className="window-plus">+</span>
        </div>
        <div className="kanban-board">
          <div className="kanban-column">
            <span className="kanban-label">FOCUS</span>
            <span className="task-card task-violet">Review neural nets</span>
            <span className="task-card task-blue">Contest prep</span>
          </div>
          <div className="kanban-column">
            <span className="kanban-label">IN FLOW</span>
            <span className="task-card task-green">Build a small model</span>
            <span className="task-card task-muted" />
          </div>
          <div className="kanban-column">
            <span className="kanban-label">DONE</span>
            <span className="task-card task-done">Weekly review</span>
            <span className="task-card task-done">Read 2 papers</span>
          </div>
        </div>
        <div className="art-footnote"><span /> six AI tools, one learning loop</div>
      </div>
    );
  }

  if (kind === "krishi") {
    return (
      <div className="project-art art-krishi" aria-hidden="true">
        <div className="field-grid" />
        <svg className="field-lines" viewBox="0 0 460 240" fill="none">
          <path d="M-10 204C96 176 134 225 230 188S367 167 480 110" />
          <path d="M-18 228C91 199 134 245 238 210S382 187 488 132" />
          <path d="M-12 179C88 151 139 201 226 165S357 145 473 85" />
        </svg>
        <div className="field-sun"><span>KRISHI<br />BAZAR</span></div>
        <div className="field-card"><span className="field-card-label">FARM ASSIST</span><b>Grow with better insight</b><span>Crop health · Market access</span></div>
        <span className="field-pin pin-one" /><span className="field-pin pin-two" />
      </div>
    );
  }

  if (kind === "cancer") {
    return (
      <div className="project-art art-cancer" aria-hidden="true">
        <div className="scan-grid" />
        <div className="scan-panel">
          <span className="scan-label">MODEL EXPLAINABILITY</span>
          <div className="scan-score"><b>01</b><span>individual<br />prediction</span></div>
          <div className="scan-bars"><i /><i /><i /><i /><i /><i /></div>
          <div className="scan-legend"><span><i />SHAP values</span><span>feature impact</span></div>
        </div>
        <div className="scan-stamp">SHAP<br />+ LIME</div>
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
        <span className="retina-caption">local detail / global context</span>
      </div>
    );
  }

  return (
    <div className="project-art art-gpt" aria-hidden="true">
      <div className="code-window">
        <div className="art-window-bar">
          <span className="window-dots"><i /><i /><i /></span>
          <span>fine_tune.py</span>
          <span className="window-plus">↗</span>
        </div>
        <div className="code-lines">
          <span><i>01</i><b>model</b> = GPT2ForSequenceClassification()</span>
          <span><i>02</i><b>trainer</b> = Trainer(</span>
          <span><i>03</i>&nbsp;&nbsp;gradient_accumulation_steps=<em>4</em>,</span>
          <span><i>04</i>&nbsp;&nbsp;warmup_ratio=<em>0.1</em></span>
          <span><i>05</i>)</span>
        </div>
        <div className="code-result"><span>VALIDATION F1</span><b>0.85+</b><i /></div>
      </div>
    </div>
  );
}

