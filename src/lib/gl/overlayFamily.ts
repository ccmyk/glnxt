// src/lib/gl/overlayFamily.ts
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Texture } from 'ogl'
import { tweenUniform } from '@/lib/anim/spatialTimelines'
import { glRuntime } from './runtime'
import type { GLOverlayFactory } from './registry'
import { createTT } from './families/tt'

export type Overlay = {
    mount(cvs: HTMLCanvasElement): void
    resize(w: number, h: number, dpr: number): void
    show(): void
    hide(): void
    dispose(): void
}

export const overlayFamily: GLOverlayFactory = (gl, key, opts) => {
    const [family] = key.split(':')
    switch (family) {
        case 'tt':
            return createTT(gl, opts as any)
        // ...existing families: default, slider, roll, etc.
        default:
            return null
    }
}

export function createTextOverlay(): Overlay {
    let renderer: Renderer, camera: Camera, scene: Transform, mesh: Mesh
    const uniforms = {
        uTime: { value: 0 },
        uStart:{ value: 1 },
        uPower:{ value: 0 }
    }

    const tick = (t:number, dt:number) => {
        uniforms.uTime.value += dt
        renderer.render({ scene, camera })
    }

    return {
        mount(canvas) {
            renderer = new Renderer({ canvas, dpr: devicePixelRatio })
            const gl = renderer.gl
            camera = new Camera(gl)
            scene = new Transform()

            // plane
            const geo = new Geometry(gl, {
                position: { size: 2, data: new Float32Array([-1,-1, 1,-1, -1,1, 1,1]) },
                uv:       { size: 2, data: new Float32Array([0,0, 1,0, 0,1, 1,1]) },
                index:    { data: new Uint16Array([0,1,2, 2,1,3]) }
            })
            const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms })
            mesh = new Mesh(gl, { geometry: geo, program })
            mesh.setParent(scene)

            glRuntime.add(tick)
            glRuntime.start()
        },
        resize(w,h,dpr){
            renderer.setSize(w,h)
        },
        show(){ tweenUniform(uniforms.uPower, 1, 'reveal') },
        hide(){ tweenUniform(uniforms.uPower, 0, 'reveal') },
        dispose(){
            glRuntime.stop() // or keep running if others are attached; adjust as needed
            // clean up OGL resources
            // @ts-expect-error private gl
            const gl = renderer.gl; gl && gl.getExtension && gl.getExtension('WEBGL_lose_context')?.loseContext?.()
        }
    }
}

// minimal shaders (replace with your family shaders)
const VERT = /* glsl */`
attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`
const FRAG = /* glsl */`
precision highp float; varying vec2 vUv;
uniform float uTime; uniform float uPower;
void main(){
  float vignette = smoothstep(0.8, 0.2, length(vUv - 0.5));
  gl_FragColor = vec4(vec3(vignette) * uPower, 1.0);
}
`