import { PARTS } from './partsData'
import { PRESETS } from './presets'

function EyeOpen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeClosed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function Sidebar({
  exploded, onToggleExplode,
  visible, onToggle,
  selected, selectedVariants,
  activePreset, onApplyPreset,
  sequenceMode, onToggleSequence, sequenceStep, maxStep, onStepForward, onStepBack,
  showBOM, onToggleBOM,
  showEstimator, onToggleEstimator,
  showDimensions, onToggleDimensions,
  sectionCutActive, onToggleSectionCut, sectionCutY, onSectionCutY,
}) {
  const currentSequencePart = sequenceMode && sequenceStep > 0
    ? PARTS.find((p) => p.sequence === sequenceStep)
    : null

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">IC Configurator</div>

      {/* ── View Controls ── */}
      <div className="sidebar-section-label">View</div>
      <div className="btn-row">
        <button
          className={`view-btn ${!sequenceMode && exploded ? 'view-btn--active' : ''}`}
          onClick={onToggleExplode}
          disabled={sequenceMode}
          title="Explode / Assemble view"
        >
          {exploded && !sequenceMode ? 'ASSEMBLE' : 'EXPLODE'}
        </button>
        <button
          className={`view-btn ${sequenceMode ? 'view-btn--active' : ''}`}
          onClick={onToggleSequence}
          title="Step through assembly sequence"
        >
          SEQUENCE
        </button>
      </div>

      {/* ── Sequence Step Controls ── */}
      {sequenceMode && (
        <div className="sequence-controls">
          <div className="seq-label">
            {sequenceStep === 0
              ? 'Press NEXT to start'
              : currentSequencePart
              ? `Step ${sequenceStep}/${maxStep}: ${currentSequencePart.id}`
              : `Complete (${maxStep}/${maxStep})`}
          </div>
          <div className="btn-row">
            <button className="seq-btn" onClick={onStepBack} disabled={sequenceStep === 0}>
              ← PREV
            </button>
            <button className="seq-btn" onClick={onStepForward} disabled={sequenceStep === maxStep}>
              NEXT →
            </button>
          </div>
        </div>
      )}

      <div className="sidebar-divider" />

      {/* ── Presets ── */}
      <div className="sidebar-section-label">Presets</div>
      <div className="preset-row">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-btn ${activePreset === preset.id ? 'preset-btn--active' : ''}`}
            onClick={() => onApplyPreset(preset)}
            title={preset.description}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* ── Components ── */}
      <div className="sidebar-section-label">Components</div>
      <ul className="parts-list">
        {PARTS.map((part) => {
          const variantIdx = selectedVariants[part.id] ?? 0
          const activeColor = part.variants[variantIdx].color
          const isActive = selected?.id === part.id
          const isHidden = !visible[part.id]
          return (
            <li
              key={part.id}
              className={[
                'part-item',
                isActive ? 'part-item--active' : '',
                isHidden ? 'part-item--hidden' : '',
              ].join(' ')}
            >
              <div className="part-swatch" style={{ background: activeColor }} />
              <span className="part-name">{part.id}</span>
              <button
                className="part-toggle"
                onClick={() => onToggle(part.id)}
                title={isHidden ? 'Show' : 'Hide'}
              >
                {isHidden ? <EyeClosed /> : <EyeOpen />}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-divider" />

      {/* ── Tools ── */}
      <div className="sidebar-section-label">Tools</div>
      <div className="tools-grid">
        <button
          className={`tool-btn ${showBOM ? 'tool-btn--active' : ''}`}
          onClick={onToggleBOM}
          title="Bill of Materials"
        >
          BOM
        </button>
        <button
          className={`tool-btn ${showEstimator ? 'tool-btn--active' : ''}`}
          onClick={onToggleEstimator}
          title="Weight & Cost Estimator"
        >
          COST
        </button>
        <button
          className={`tool-btn ${showDimensions ? 'tool-btn--active' : ''}`}
          onClick={onToggleDimensions}
          title="Dimension Overlay"
        >
          DIMS
        </button>
        <button
          className={`tool-btn ${sectionCutActive ? 'tool-btn--active' : ''}`}
          onClick={onToggleSectionCut}
          title="Section Cut"
        >
          CUT
        </button>
      </div>

      {/* ── Section Cut Slider ── */}
      {sectionCutActive && (
        <div className="section-slider-wrap">
          <div className="section-slider-label">
            Cut height: {sectionCutY.toFixed(1)} m
          </div>
          <input
            type="range"
            className="section-slider"
            min="-0.5"
            max="3.5"
            step="0.05"
            value={sectionCutY}
            onChange={(e) => onSectionCutY(parseFloat(e.target.value))}
          />
          <div className="section-slider-ends">
            <span>Bottom</span>
            <span>Top</span>
          </div>
        </div>
      )}

      <div className="sidebar-hint">Click a part to inspect</div>
    </aside>
  )
}
