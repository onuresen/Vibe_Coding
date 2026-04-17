import { useState, useEffect, useRef } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import Sidebar from './components/Sidebar'
import BOMPanel from './components/BOMPanel'
import EstimatorPanel from './components/EstimatorPanel'
import GameScorePanel from './components/GameScorePanel'
import CarbonPanel from './components/CarbonPanel'
import { PARTS } from './components/partsData'
import { PRESETS } from './components/presets'
import './App.css'

const DEFAULT_VARIANTS = Object.fromEntries(PARTS.map((p) => [p.id, 0]))
const DEFAULT_VISIBLE = Object.fromEntries(PARTS.map((p) => [p.id, true]))

export default function App() {
  // ── Existing state ──────────────────────────────────────
  const [exploded, setExploded] = useState(false)
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(DEFAULT_VISIBLE)

  const [selectedVariants, setSelectedVariants] = useState(DEFAULT_VARIANTS)
  const [activePreset, setActivePreset] = useState(null)

  const [sequenceMode, setSequenceMode] = useState(false)
  const [sequenceStep, setSequenceStep] = useState(0)

  const [showBOM, setShowBOM] = useState(false)
  const [showEstimator, setShowEstimator] = useState(false)
  const [showCarbon, setShowCarbon] = useState(false)
  const [showDimensions, setShowDimensions] = useState(false)

  const [sectionCutActive, setSectionCutActive] = useState(false)
  const [sectionCutY, setSectionCutY] = useState(3.5)

  // ── Site mode ───────────────────────────────────────────
  const [siteMode, setSiteMode] = useState(false)
  const [placedUnits, setPlacedUnits] = useState([])
  const [selectedUnitType, setSelectedUnitType] = useState(PRESETS[0].id)

  // ── Game mode ───────────────────────────────────────────
  const [gameMode, setGameMode] = useState(false)
  const [gamePhase, setGamePhase] = useState('idle') // 'idle' | 'playing' | 'complete'
  const [gameStep, setGameStep] = useState(1)
  const [gameMistakes, setGameMistakes] = useState(0)
  const [gameElapsed, setGameElapsed] = useState(0)
  const gameStartTimeRef = useRef(null)

  // Live timer while playing
  useEffect(() => {
    if (gamePhase !== 'playing') return
    gameStartTimeRef.current = Date.now()
    const interval = setInterval(() => {
      setGameElapsed(Date.now() - gameStartTimeRef.current)
    }, 100)
    return () => clearInterval(interval)
  }, [gamePhase])

  // ── Existing handlers ────────────────────────────────────
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

  function stepForward() { setSequenceStep((s) => Math.min(s + 1, maxStep)) }
  function stepBack() { setSequenceStep((s) => Math.max(s - 1, 0)) }

  // ── Site mode handlers ───────────────────────────────────
  function toggleSiteMode() {
    if (!siteMode) {
      setExploded(false)
      setSequenceMode(false)
      setSequenceStep(0)
      setGameMode(false)
      setGamePhase('idle')
    }
    setSiteMode(v => !v)
  }

  function placeUnit(col, row, presetId) {
    setPlacedUnits(prev => [...prev, { col, row, presetId }])
  }

  function removeUnit(col, row) {
    setPlacedUnits(prev => prev.filter(u => !(u.col === col && u.row === row)))
  }

  // ── Game mode handlers ───────────────────────────────────
  function startGame() {
    setGameMode(true)
    setGamePhase('playing')
    setGameStep(1)
    setGameMistakes(0)
    setGameElapsed(0)
    setExploded(false)
    setSequenceMode(false)
    setSequenceStep(0)
    setSiteMode(false)
    setShowBOM(false)
    setShowEstimator(false)
    setShowCarbon(false)
    setSelected(null)
  }

  function exitGame() {
    setGameMode(false)
    setGamePhase('idle')
    setGameStep(1)
    setGameMistakes(0)
    setGameElapsed(0)
  }

  function handleGameClick({ id, correct }) {
    if (!correct) {
      setGameMistakes(m => m + 1)
      return
    }
    const nextStep = gameStep + 1
    if (nextStep > PARTS.length) {
      // Capture exact final time before interval stops
      setGameElapsed(Date.now() - gameStartTimeRef.current)
      setGamePhase('complete')
      setGameStep(nextStep)
    } else {
      setGameStep(nextStep)
    }
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
        showCarbon={showCarbon}
        onToggleCarbon={() => setShowCarbon((v) => !v)}
        showDimensions={showDimensions}
        onToggleDimensions={() => setShowDimensions((v) => !v)}
        sectionCutActive={sectionCutActive}
        onToggleSectionCut={() => setSectionCutActive((v) => !v)}
        sectionCutY={sectionCutY}
        onSectionCutY={setSectionCutY}
        siteMode={siteMode}
        onToggleSiteMode={toggleSiteMode}
        placedUnits={placedUnits}
        selectedUnitType={selectedUnitType}
        onSelectUnitType={setSelectedUnitType}
        gameMode={gameMode}
        gamePhase={gamePhase}
        gameStep={gameStep}
        gameMistakes={gameMistakes}
        gameElapsed={gameElapsed}
        onStartGame={startGame}
        onExitGame={exitGame}
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
        siteMode={siteMode}
        placedUnits={placedUnits}
        onPlaceUnit={placeUnit}
        onRemoveUnit={removeUnit}
        selectedUnitType={selectedUnitType}
        gameMode={gameMode}
        gameStep={gameStep}
        onGameClick={handleGameClick}
      />

      {!siteMode && !gameMode && (
        <InfoPanel
          selected={selected}
          selectedVariants={selectedVariants}
          onVariantChange={setVariant}
        />
      )}

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

      {showCarbon && (
        <CarbonPanel
          selectedVariants={selectedVariants}
          visible={visible}
          onClose={() => setShowCarbon(false)}
        />
      )}

      {gameMode && gamePhase === 'complete' && (
        <GameScorePanel
          mistakes={gameMistakes}
          elapsed={gameElapsed}
          onPlayAgain={startGame}
          onExit={exitGame}
        />
      )}
    </div>
  )
}
