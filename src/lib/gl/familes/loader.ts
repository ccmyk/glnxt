// src/lib/gl/families/loader.ts
import { Camera, Geometry, Mesh, Program, Renderer, Texture, Transform } from 'ogl'
import { gsap } from '@/lib/gsap/gsap'

export function createLoader(gl: WebGLRenderingContext){
    const scene = new Transform()
    const camera = new Camera(gl as any)
    camera.orthographic({ left:-1, right:1, bottom:-1, top:1, near:0, far:1 })

    const geom = new Geometry(gl as any, {
        position: { size: 2, data: new Float32Array([-1,-1, 1,-1, 1,1, -1,1]) },
        uv: { size:2, data: new Float32Array([0,0, 1,0, 1,1, 0,1]) },
        index: { data: new Uint16Array([0,1,2, 0,2,3]) }
    })

    const program = new Program(gl as any, {
        vertex: `
      attribute vec2 position; attribute vec2 uv;
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position,0.,1.); }
    `,
        fragment: `
      precision highp float; varying vec2 vUv;
      uniform float uProgress; // 0..1
      void main(){
        float y = smoothstep(0.0, 1.0, vUv.y);
        float bar = step(1.0 - uProgress, vUv.y);
        gl_FragColor = vec4(vec3(0.0), 0.6 * bar * y); // darkening veil from bottom
      }
    `,
        uniforms: { uProgress: { value: 0 } },
        transparent: true, depthTest:false, depthWrite:false
    })

    const mesh = new Mesh(gl as any, { geometry: geom, program })
    mesh.setParent(scene)

    return {
        scene, camera, program, mesh,
        render(){ /* shader is static unless progress changes */ },
        setProgress(p: number){
            gsap.to(program.uniforms.uProgress, { value: p, duration: 0.4, ease: 'power2.inOut' })
        },
        dispose(){ try{ program.remove() } catch{} }
    }
}