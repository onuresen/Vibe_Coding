import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import Part from './Part'
import DimensionLines from './DimensionLines'
import { PARTS } from './partsData'

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
}) {
  return (
    <Canvas
      shadows
      style={{ position: 'absolute', inset: 0, background: '#f4f4f4' }}
      gl={{ localClippingEnabled: true }}
    >
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={45} />
      <OrbitControls enableDamping />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {PARTS.map((part) => {
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
          />
        )
      })}

      {showDimensions && <DimensionLines selectedVariants={selectedVariants} />}

      {/* Invisible plane to catch background clicks */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClearSelect}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <ContactShadows position={[0, -0.26, 0]} opacity={0.4} scale={12} blur={2} />
    </Canvas>
  )
}
