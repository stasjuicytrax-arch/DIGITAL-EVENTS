import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { logoPolygons } from './logo-geometry'

type Props = {
  /** рендер идёт только пока hero в зоне видимости */
  active: boolean
  reduced: boolean
  touch: boolean
  onReady?: () => void
}

const pointer = { x: 0, y: 0 }

/** Знак, выдавленный в объём: три детали с зазорами, фаски, полированный хром с лёгкой иризацией (DESIGN §7.3) */
function LogoMesh({ reduced }: { reduced: boolean }) {
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

  // на широких экранах знак слева от колонки с текстом, на узких — по центру
  const wide = size.width >= 1200
  const x = wide ? -viewport.width * 0.17 : 0
  const scale = Math.min(1.15, (viewport.height / 3.2) * (wide ? 1.15 : 1.05), viewport.width / 2.6)

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    if (reduced) { g.rotation.set(0.12, -0.32, 0); return }
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-dt * 3)
    const ry = Math.sin(t * 0.35) * 0.42 + pointer.x * 0.5
    const rx = Math.sin(t * 0.27) * 0.08 - pointer.y * 0.32
    g.rotation.y += (ry - g.rotation.y) * k
    g.rotation.x += (rx - g.rotation.x) * k
    g.position.y = Math.sin(t * 0.8) * 0.05
  })

  return (
    <group position={[x, 0, 0]} scale={scale}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#f4f4f2"
            metalness={1}
            roughness={0.13}
            iridescence={0.55}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[180, 820]}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            envMapIntensity={1.35}
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
export default function Logo3D({ active, reduced, touch, onReady }: Props) {
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
      <LogoMesh reduced={reduced} />
    </Canvas>
  )
}
