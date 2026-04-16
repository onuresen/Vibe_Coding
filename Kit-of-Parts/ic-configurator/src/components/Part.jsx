import { useRef, useEffect, useState, useMemo } from 'react'
import { Edges, Html } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

export default function Part({
  data,
  isExploded,
  isVisible,
  onSelect,
  activeVariant,
  sequenceMode,
  sequenceStep,
  sectionCutActive,
  sectionCutY,
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const prevSequenceStep = useRef(-1)

  const color = activeVariant?.color ?? data.variants[0].color
  const isWire = data.wire ?? false
  const isTrans = data.transparent ?? false

  // ── Clipping plane for section cut ──────────────────────
  // Plane normal (0,-1,0), constant = sectionCutY → clips everything above Y
  const clippingPlanes = useMemo(
    () => sectionCutActive ? [new THREE.Plane(new THREE.Vector3(0, -1, 0), sectionCutY)] : [],
    [sectionCutActive, sectionCutY]
  )

  // ── Explode / Assemble animation ────────────────────────
  useEffect(() => {
    if (sequenceMode) return  // sequence controls position when in sequence mode
    const target = isExploded ? data.exp : data.pos
    gsap.to(meshRef.current.position, {
      x: target[0], y: target[1], z: target[2],
      duration: 1, ease: 'expo.out',
    })
  }, [isExploded, sequenceMode])

  // ── Assembly sequence animation ─────────────────────────
  useEffect(() => {
    if (!sequenceMode) {
      // Exiting sequence mode: snap back to assembled position
      gsap.to(meshRef.current.position, {
        x: data.pos[0], y: data.pos[1], z: data.pos[2],
        duration: 0.6, ease: 'expo.out',
      })
      prevSequenceStep.current = -1
      return
    }

    const mySeq = data.sequence

    if (sequenceStep < mySeq) {
      // This part hasn't appeared yet — park it way below so it's hidden
      gsap.set(meshRef.current.position, {
        x: data.exp[0], y: data.exp[1] - 6, z: data.exp[2],
      })
    } else if (sequenceStep === mySeq && prevSequenceStep.current < mySeq) {
      // Just became visible — fly in from exploded position
      gsap.set(meshRef.current.position, {
        x: data.exp[0], y: data.exp[1], z: data.exp[2],
      })
      gsap.to(meshRef.current.position, {
        x: data.pos[0], y: data.pos[1], z: data.pos[2],
        duration: 1, ease: 'expo.out',
      })
    } else if (sequenceStep > mySeq) {
      // Already placed — ensure it's at assembled position
      gsap.to(meshRef.current.position, {
        x: data.pos[0], y: data.pos[1], z: data.pos[2],
        duration: 0.5, ease: 'expo.out',
      })
    }

    prevSequenceStep.current = sequenceStep
  }, [sequenceMode, sequenceStep])

  // ── Pointer cursor ───────────────────────────────────────
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  function handleClick(e) {
    e.stopPropagation()
    gsap.fromTo(
      meshRef.current.scale,
      { x: 1, y: 1, z: 1 },
      { x: 1.05, y: 1.05, z: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
    )
    onSelect({ ...data, meta: activeVariant?.meta ?? data.variants[0].meta })
  }

  const showLabel = hovered || isExploded || (sequenceMode && sequenceStep === data.sequence)
  const labelY = data.size[1] / 2 + 0.25

  // In sequence mode, hide parts that haven't been placed yet
  const seqVisible = !sequenceMode || sequenceStep >= data.sequence
  const finalVisible = isVisible && seqVisible

  return (
    <mesh
      ref={meshRef}
      position={data.pos}
      visible={finalVisible}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      castShadow={!isWire}
      receiveShadow
    >
      <boxGeometry args={data.size} />
      <meshStandardMaterial
        color={color}
        transparent={isWire || isTrans}
        opacity={isWire ? 0.06 : isTrans ? 0.6 : 1}
        depthWrite={!isWire}
        emissive={color}
        emissiveIntensity={hovered ? 0.25 : 0}
        clippingPlanes={clippingPlanes}
        clipShadows
      />
      <Edges threshold={15} color={hovered ? '#ffffff' : isWire ? color : 'black'} />

      {showLabel && (
        <Html position={[0, labelY, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="part-label">{data.id}</div>
        </Html>
      )}
    </mesh>
  )
}
