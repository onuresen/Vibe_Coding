import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { gsap } from 'gsap'
import Part from './Part'
import DimensionLines from './DimensionLines'
import SiteGrid from './SiteGrid'
import { PARTS } from './partsData'

// Animates camera + orbit target when switching modes
function CameraController({ siteMode, controlsRef }) {
  const { camera } = useThree()

  useEffect(() => {
    const pos = siteMode ? { x: 2, y: 20, z: 10 } : { x: 8, y: 8, z: 8 }
    gsap.to(camera.position, { ...pos, duration: 1.2, ease: 'expo.inOut' })

    if (controlsRef.current) {
      const targetY = siteMode ? 0.5 : 0
      gsap.to(controlsRef.current.target, {
        x: 0, y: targetY, z: 0,
        duration: 1.2, ease: 'expo.inOut',
        onUpdate: () => controlsRef.current?.update(),
      })
    }
  }, [siteMode, camera, controlsRef])

  return null
}

export default function Scene({
  isExploded,
  visible,
  onSelect,
  onClearSelect,
  selectedVariants,
  sequenceMode,
  sequenceStep,
  showDimensions,
  sectionCutActive,
  sectionCutY,
  siteMode,
  placedUnits,
  onPlaceUnit,
  onRemoveUnit,
  selectedUnitType,
  gameMode,
  gameStep,
  onGameClick,
}) {
  const controlsRef = useRef()

  return (
    <Canvas
      shadows
      style={{ position: 'absolute', inset: 0, background: siteMode ? '#eef2f7' : '#f4f4f4' }}
      gl={{ localClippingEnabled: true }}
    >
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={45} />
      <OrbitControls ref={controlsRef} enableDamping />
      <CameraController siteMode={siteMode} controlsRef={controlsRef} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* ── Site grid mode ─────────────────────────────── */}
      {siteMode && (
        <SiteGrid
          placedUnits={placedUnits}
          onPlace={onPlaceUnit}
          onRemove={onRemoveUnit}
          selectedUnitType={selectedUnitType}
        />
      )}

      {/* ── Regular parts (hidden in site mode) ────────── */}
      {!siteMode && PARTS.map((part) => {
        const variantIdx = selectedVariants[part.id] ?? 0
        const activeVariant = part.variants[variantIdx]
        return (
          <Part
            key={part.id}
            data={part}
            isExploded={isExploded}
            isVisible={visible[part.id]}
            onSelect={onSelect}
            activeVariant={activeVariant}
            sequenceMode={sequenceMode}
            sequenceStep={sequenceStep}
            sectionCutActive={sectionCutActive}
            sectionCutY={sectionCutY}
            gameMode={gameMode}
            gameStep={gameStep}
            onGameClick={onGameClick}
          />
        )
      })}

      {!siteMode && showDimensions && <DimensionLines selectedVariants={selectedVariants} />}

      {/* Background click to deselect */}
      {!siteMode && (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClearSelect}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      <ContactShadows position={[0, -0.26, 0]} opacity={0.4} scale={siteMode ? 40 : 12} blur={2} />
    </Canvas>
  )
}
