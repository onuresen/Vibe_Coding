import { useState } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import Sidebar from './components/Sidebar'
import BOMPanel from './components/BOMPanel'
import EstimatorPanel from './components/EstimatorPanel'
import { PARTS } from './components/partsData'
import './App.css'

const DEFAULT_VARIANTS = Object.fromEntries(PARTS.map((p) => [p.id, 0]))
const DEFAULT_VISIBLE = Object.fromEntries(PARTS.map((p) => [p.id, true]))

export default function App() {
  // ── Existing state ──────────────────────────────────────
  const [exploded, setExploded] = useState(false)
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(DEFAULT_VISIBLE)

  // ── Tool 2: Variant Switcher ────────────────────────────
  const [selectedVariants, setSelectedVariants] = useState(DEFAULT_VARIANTS)

  // ── Tool 4: Configuration Presets ──────────────────────
  const [activePreset, setActivePreset] = useState(null)

  // ── Tool 1: Assembly Sequence ───────────────────────────
  const [sequenceMode, setSequenceMode] = useState(false)
  const [sequenceStep, setSequenceStep] = useState(0)

  // ── Tool 3: BOM Panel ───────────────────────────────────
  const [showBOM, setShowBOM] = useState(false)

  // ── Tool 6: Cost Estimator ──────────────────────────────
  const [showEstimator, setShowEstimator] = useState(false)

  // ── Tool 5: Dimension Overlay ───────────────────────────
  const [showDimensions, setShowDimensions] = useState(false)

  // ── Tool 7: Section Cut ─────────────────────────────────
  const [sectionCutActive, setSectionCutActive] = useState(false)
  const [sectionCutY, setSectionCutY] = useState(3.5)

  // ── Handlers ────────────────────────────────────────────
  function togglePart(id) {
    setVisible((v) => ({ ...v, [id]: !v[id] }))
    setActivePreset(null)
  }

  function setVariant(partId, variantIdx) {
    setSelectedVariants((v) => ({ ...v, [partId]: variantIdx }))
    setActivePreset(null)
  }

  function applyPreset(preset) {
    setSelectedVariants({ ...DEFAULT_VARIANTS, ...preset.variants })
    setVisible({ ...DEFAULT_VISIBLE, ...preset.visible })
    setActivePreset(preset.id)
    setSelected(null)
  }

  function toggleSequenceMode() {
    if (sequenceMode) {
      setSequenceMode(false)
      setSequenceStep(0)
      setExploded(false)
    } else {
      setSequenceMode(true)
      setSequenceStep(0)
      setExploded(false)
    }
  }

  const maxStep = PARTS.length

  function stepForward() {
    setSequenceStep((s) => Math.min(s + 1, maxStep))
  }

  function stepBack() {
    setSequenceStep((s) => Math.max(s - 1, 0))
  }

  return (
    <div id="root-container">
      <Sidebar
        exploded={exploded}
        onToggleExplode={() => { setExploded((v) => !v); setSequenceMode(false) }}
        visible={visible}
        onToggle={togglePart}
        selected={selected}
        selectedVariants={selectedVariants}
        activePreset={activePreset}
        onApplyPreset={applyPreset}
        sequenceMode={sequenceMode}
        onToggleSequence={toggleSequenceMode}
        sequenceStep={sequenceStep}
        maxStep={maxStep}
        onStepForward={stepForward}
        onStepBack={stepBack}
        showBOM={showBOM}
        onToggleBOM={() => setShowBOM((v) => !v)}
        showEstimator={showEstimator}
        onToggleEstimator={() => setShowEstimator((v) => !v)}
        showDimensions={showDimensions}
        onToggleDimensions={() => setShowDimensions((v) => !v)}
        sectionCutActive={sectionCutActive}
        onToggleSectionCut={() => setSectionCutActive((v) => !v)}
        sectionCutY={sectionCutY}
        onSectionCutY={setSectionCutY}
      />

      <Scene
        isExploded={sequenceMode ? false : exploded}
        visible={visible}
        onSelect={setSelected}
        onClearSelect={() => setSelected(null)}
        selectedVariants={selectedVariants}
        sequenceMode={sequenceMode}
        sequenceStep={sequenceStep}
        showDimensions={showDimensions}
        sectionCutActive={sectionCutActive}
        sectionCutY={sectionCutY}
      />

      <InfoPanel
        selected={selected}
        selectedVariants={selectedVariants}
        onVariantChange={setVariant}
      />

      {showBOM && (
        <BOMPanel
          selectedVariants={selectedVariants}
          visible={visible}
          onClose={() => setShowBOM(false)}
        />
      )}

      {showEstimator && (
        <EstimatorPanel
          selectedVariants={selectedVariants}
          visible={visible}
          onClose={() => setShowEstimator(false)}
        />
      )}
    </div>
  )
}
