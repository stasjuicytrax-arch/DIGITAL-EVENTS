import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { logoPolygons } from './logo-geometry'
import type { LogoVariant } from './HeroLogo'

type Props = {
  variant: LogoVariant
  /** рендер идёт только пока hero в зоне видимости */
  active: boolean
  reduced: boolean
  touch: boolean
  onReady?: () => void
}

const pointer = { x: 0, y: 0 }

// мышь: наклон ±17°, инерция lerp 0.08 на кадр 60 fps
const TILT = 0.3
const LERP = 0.08

/** Знак, выдавленный в объём: три детали с зазорами, фаски, полированный хром (DESIGN §7.3). desktop — лаймовый хром */
function LogoMesh({ variant, reduced, touch }: { variant: LogoVariant; reduced: boolean; touch: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { viewport, size } = useThree()

  const geometry = useMemo(() => {
    const shapes = logoPolygons(1).map((poly) => new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x, y))))
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.3, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.022, bevelSegments: 8, curveSegments: 1,
    })
    g.translate(0, 0, -0.15)
    g.computeVertexNormals()
    return g
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const desktop = variant === 'desktop'
  // desktop: знак строго по центру, ~55% высоты hero (высота знака — 2 единицы); mobile — по центру своей зоны
  const x = 0
  const scale = desktop
    ? Math.min((viewport.height * 0.55) / 2, viewport.width / 4)
    : Math.min(1.15, (viewport.height / 3.2) * 1.05, viewport.width / 2.6)
  void size

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    if (reduced) { g.rotation.set(0.12, desktop ? 0.32 : -0.32, 0); g.scale.setScalar(1); return }
    const t = state.clock.elapsedTime
    // «дыхание» в покое: лёгкое парение и пульс масштаба
    g.position.y = Math.sin(t * 0.8) * 0.05
    g.scale.setScalar(1 + Math.sin(t * 1.1) * 0.012)
    if (touch) {
      // телефоны и планшеты: медленное авто-вращение
      g.rotation.y += dt * 0.35
      g.rotation.x = Math.sin(t * 0.4) * 0.1
      return
    }
    const k = 1 - Math.pow(1 - LERP, dt * 60)
    const ry = pointer.x * TILT + Math.sin(t * 0.35) * 0.06
    const rx = -pointer.y * TILT + Math.sin(t * 0.27) * 0.04
    g.rotation.y += (ry - g.rotation.y) * k
    g.rotation.x += (rx - g.rotation.x) * k
  })

  return (
    <group position={[x, 0, 0]} scale={scale}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={desktop ? '#B6FC46' : '#f4f4f2'}
            metalness={1}
            roughness={desktop ? 0.16 : 0.13}
            iridescence={desktop ? 0 : 0.55}
            // лаймовый хром: собственное слабое свечение держит цвет в тенях, тон-маппинг не выбеливает его
            emissive={desktop ? '#B6FC46' : '#000000'}
            emissiveIntensity={desktop ? 0.07 : 0}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[180, 820]}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            envMapIntensity={desktop ? 0.95 : 1.35}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 3D-логотип для hero. Студия для отражений собрана из Lightformer (без внешних HDR):
 * белые полосы-софтбоксы, холодная полоса и один лаймовый софтбокс.
 */
export default function Logo3D({ variant, active, reduced, touch, onReady }: Props) {
  useEffect(() => {
    if (reduced || touch) return
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, touch])

  return (
    <Canvas
      dpr={[1, touch ? 1.5 : 2]}
      camera={{ position: [0, 0, 6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
        requestAnimationFrame(() => onReady?.())
      }}
      aria-hidden="true"
    >
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#1c1c1f']} />
        {/* большой мягкий софтбокс перед знаком: лицевые грани ловят свет, при повороте по ним бежит блик */}
        <Lightformer form="rect" intensity={1.6} position={[1.5, 1.5, 7]} rotation-y={Math.PI} scale={[7, 5, 1]} />
        <Lightformer form="rect" intensity={4} position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[9, 2.5, 1]} />
        <Lightformer form="rect" intensity={3.5} position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[1.6, 9, 1]} />
        <Lightformer form="rect" intensity={2} color="#dfe6ff" position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[1.2, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#B6FC46" position={[4.5, -2.2, 2.5]} rotation-y={-Math.PI / 3} scale={[3.5, 3.5, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[0, -3.5, -3]} rotation-x={-Math.PI / 2} scale={[12, 1, 1]} />
      </Environment>
      <LogoMesh variant={variant} reduced={reduced} touch={touch} />
    </Canvas>
  )
}
