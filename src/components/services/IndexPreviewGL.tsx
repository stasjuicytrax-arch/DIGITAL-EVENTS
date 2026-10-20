import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

// cover-подгонка, лёгкая «жидкая» волна и RGB-сдвиг от скорости курсора, crossfade между кадрами
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uAspA;
uniform float uAspB;
uniform float uAsp;
uniform float uMix;
uniform float uTime;
uniform vec2 uVel;

vec2 cover(vec2 uv, float img) {
  vec2 s = uAsp > img ? vec2(1.0, img / uAsp) : vec2(uAsp / img, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec3 sampleShift(sampler2D t, vec2 uv, vec2 d) {
  return vec3(texture2D(t, uv + d).r, texture2D(t, uv).g, texture2D(t, uv - d).b);
}
void main() {
  float v = length(uVel);
  vec2 uv = vUv;
  uv += vec2(sin(uv.y * 9.0 + uTime * 2.2), cos(uv.x * 7.0 + uTime * 1.8)) * 0.012 * v;
  vec2 d = uVel * 0.025;
  vec3 a = sampleShift(uA, cover(uv, uAspA), d);
  vec3 b = sampleShift(uB, cover(uv, uAspB), d);
  // uMix −0.3 → 1.2: новая картинка (uA) проявляется шторкой сверху вниз поверх старой (uB)
  float wipe = 1.0 - smoothstep(uMix - 0.25, uMix + 0.25, 1.0 - vUv.y + sin(vUv.x * 5.0 + uTime) * 0.04);
  gl_FragColor = vec4(mix(b, a, wipe), 1.0);
}
`

const W = 440
const H = 290

/**
 * Превью направления за курсором в индексе каталога (одна WebGL-плоскость, three.js).
 * Плоскость летит за курсором с инерцией, при движении — лёгкое liquid-искажение и RGB-сдвиг,
 * кадры направления сменяются шторкой. Вне наведения цикл отрисовки остановлен.
 */
export default function IndexPreviewGL({ sets, active, reduced }: { sets: string[][]; active: number | null; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ show: (i: number | null) => void } | null>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(W, H, false)
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const empty = new THREE.DataTexture(new Uint8Array([18, 18, 18, 255]), 1, 1)
    empty.needsUpdate = true
    const uniforms = {
      uA: { value: empty as THREE.Texture }, uB: { value: empty as THREE.Texture },
      uAspA: { value: 1.5 }, uAspB: { value: 1.5 }, uAsp: { value: W / H },
      uMix: { value: 1.2 }, uTime: { value: 0 }, uVel: { value: new THREE.Vector2() },
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }))
    scene.add(mesh)

    const loader = new THREE.TextureLoader()
    const cache = new Map<string, Promise<THREE.Texture>>()
    const load = (url: string) => {
      if (!cache.has(url)) cache.set(url, loader.loadAsync(url).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; return t }))
      return cache.get(url)!
    }
    const asp = (t: THREE.Texture) => { const im = t.image as { width: number; height: number }; return im.width / im.height }

    // позиция за курсором с инерцией
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, target = { ...pos }
    const vel = new THREE.Vector2()
    const onMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0, visible = false, set = -1, frame = 0, cycle = 0, last = performance.now()
    const swap = async (url: string) => {
      const tex = await load(url)
      uniforms.uB.value = uniforms.uA.value; uniforms.uAspB.value = uniforms.uAspA.value
      uniforms.uA.value = tex; uniforms.uAspA.value = asp(tex)
      uniforms.uMix.value = -0.3
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = reduced ? 1 : 1 - Math.pow(1 - 0.14, dt * 60)
      const dx = target.x - pos.x, dy = target.y - pos.y
      pos.x += dx * k; pos.y += dy * k
      vel.set(reduced ? 0 : dx / 260, reduced ? 0 : -dy / 260).clampLength(0, 1)
      uniforms.uVel.value.lerp(vel, 0.2)
      uniforms.uTime.value = now / 1000
      if (uniforms.uMix.value < 1.2) uniforms.uMix.value = Math.min(1.2, uniforms.uMix.value + dt * (reduced ? 10 : 2.4))
      el.style.transform = `translate3d(${pos.x - W / 2}px, ${pos.y - H / 2}px, 0) rotate(${(uniforms.uVel.value.x * 6).toFixed(2)}deg)`
      renderer.render(scene, camera)
      if (visible || uniforms.uVel.value.length() > 0.01) raf = requestAnimationFrame(tick)
      else raf = 0
    }
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) } }

    api.current = {
      show: (i) => {
        window.clearInterval(cycle)
        visible = i !== null
        el.dataset.visible = visible ? 'true' : 'false'
        if (i === null) return
        start()
        if (i !== set) { set = i; frame = 0; swap(sets[i][0]) }
        // на одной строке кадры направления сменяются сами
        if (sets[i].length > 1) cycle = window.setInterval(() => { frame = (frame + 1) % sets[i].length; swap(sets[i][frame]) }, 1400)
      },
    }
    // прогрев первых кадров каждого направления
    sets.forEach((s) => s[0] && load(s[0]))

    return () => {
      window.clearInterval(cycle)
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      cache.forEach((p) => p.then((t) => t.dispose()))
      mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); empty.dispose()
      renderer.dispose()
      api.current = null
    }
  }, [sets, reduced])

  useEffect(() => { api.current?.show(active) }, [active])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      data-visible="false"
      width={W}
      height={H}
      style={{ width: W, height: H }}
      className="index-preview pointer-events-none fixed left-0 top-0 z-30 rounded-md"
    />
  )
}
