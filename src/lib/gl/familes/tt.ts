// src/lib/gl/families/tt.ts
import { Renderer, Camera, Transform, Geometry, Program, Mesh, Texture, Vec2 } from 'ogl'
import { gsap } from '@/lib/gsap/gsap'

export type TTOptions = {
    text?: string
    color?: number
    atlasURL?: string        // MSDF atlas (png)
}

export function createTT(gl: WebGLRenderingContext, opts: TTOptions = {}){
    const scene = new Transform()
    const camera = new Camera(gl as any)
    camera.orthographic({ left:-1, right:1, bottom:-1, top:1, near:0, far:1 })

    // TODO: Swap for per-glyph quads with proper layout once atlas JSON is plugged.
    const geom = new Geometry(gl as any, {
        position: { size: 2, data: new Float32Array([-1,-.25, 1,-.25, 1,.25, -1,.25]) },
        uv: { size: 2, data: new Float32Array([0,0, 1,0, 1,1, 0,1]) },
        index: { data: new Uint16Array([0,1,2, 0,2,3]) },
    })

    const tex = new Texture(gl as any) // empty until loaded

    const program = new Program(gl as any, {
        vertex: /* glsl */`
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,
        fragment: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tMap;
      uniform float uPower;
      uniform float uStart;
      uniform float uColor;
      // For now, fallback to a soft fade quad; replace with MSDF decode when atlas ready.
      void main(){
        float mask = smoothstep(0.0, 1.0, vUv.y);
        float a = uStart * (0.6 + 0.4 * uPower);
        gl_FragColor = vec4(vec3(uColor), a * mask);
      }
    `,
        uniforms: {
            tMap:   { value: tex },
            uPower: { value: 0 },
            uStart: { value: 1 },
            uColor: { value: opts.color ?? 0.0 },
            uMouse: { value: new Vec2(0,0) },
            uTime:  { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
    })

    const mesh = new Mesh(gl as any, { geometry: geom, program })
    mesh.setParent(scene)

    // Optional: load atlas image (kept simple; swap for fetch + ImageBitmap if needed)
    if (opts.atlasURL){
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { tex.image = img }
        img.src = opts.atlasURL
    }

    // Drive uniforms with GSAP easing law (power2.inOut)
    function rampPower(to: number, dur = 0.8){
        gsap.to(program.uniforms.uPower, { value: to, duration: dur, ease: 'power2.inOut' })
    }

    return {
        scene, camera, program, mesh,
        render(dt: number){
            program.uniforms.uTime.value += dt
        },
        enter(){
            program.uniforms.uStart.value = 1
            rampPower(1, 0.8)
        },
        leave(){
            rampPower(0, 0.6)
        },
        setMouse(nx: number, ny: number){
            program.uniforms.uMouse.value.set(nx, ny)
        },
        resize(w: number, h: number){
            (gl as any).viewport(0, 0, w, h)
        },
        dispose(){
            try { program.remove() } catch{}
        }
    }
}