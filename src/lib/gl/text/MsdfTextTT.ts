// src/lib/gl/text/MsdfTextTT.ts

//    Builds quads from your BMFont JSON, adds attributes your shader expects.
//    Small, focused class: you control uniforms from React/GSAP.
//    (Matches the earlier WebGL2/MSDF plan recorded in the log.)  [oai_citation:1‡chatgpt_migration_progress_8-25-25-3:08am.txt](file-service://file-NqqVfYVn7kL2qmQupWHqCW)

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Camera, Geometry, Mesh, Program, Texture, Transform } from 'ogl'
import { ttVert, ttFrag } from './ttShaders'

type BMChar = {
    id: number; x: number; y: number; width: number; height: number;
    xoffset: number; yoffset: number; xadvance: number;
}
type BMCommon = { lineHeight: number; scaleW: number; scaleH: number }
type BMFont = { chars: BMChar[]; common: BMCommon; info: { size: number } }

export type MsdfTextTTOpts = {
    gl: WebGL2RenderingContext
    atlasImage: HTMLImageElement
    atlasMeta: BMFont
    text: string
    color?: number        // uColor
    cols?: number         // uCols
    screen?: [number, number] // uScreen in px
}

export class MsdfTextTT {
    mesh: Mesh
    program: Program
    texture: Texture
    camera: Camera
    scene: Transform

    // exposed uniforms (animate with GSAP)
    uTime = 0
    uMouse: [number, number] = [0, 0]
    uPower = 0
    uStart = 0
    uKey = -2
    uPowers = new Float32Array(64) // must match numTextures in the shader

    private glyphCount = 0

    constructor(opts: MsdfTextTTOpts) {
        const { gl, atlasImage, atlasMeta, text } = opts

        const { positions, uvs, ids, indices, indices3, glyphCount } = this.build(text, atlasMeta)
        this.glyphCount = glyphCount

        const geo = new Geometry(gl, {
            position: { size: 3, data: positions },
            uv:       { size: 2, data: uvs },
            id:       { size: 1, data: ids },
            index:    { size: 3, data: indices3 },
            // NOTE: indices for triangles:
            // OGL expects an "index" accessor named 'index' for element array buffer;
            // but we’re already using 'index' vec3 attribute for your vIndex.
            // So we pass triangle indices via 'faces'.
            faces:    { size: 1, data: indices, target: gl.ELEMENT_ARRAY_BUFFER }
        } as any)

        this.texture = new Texture(gl, { image: atlasImage, flipY: false })
        this.program = new Program(gl, {
            vertex: ttVert,
            fragment: ttFrag,
            uniforms: {
                tMap:     { value: this.texture },
                uTime:    { value: 0 },
                uScreen:  { value: opts.screen ?? [1920, 1080] },
                uMouse:   { value: this.uMouse },
                uPower:   { value: this.uPower },
                uCols:    { value: opts.cols ?? 5 },
                uColor:   { value: opts.color ?? 0.0 },
                uStart:   { value: this.uStart },
                uKey:     { value: this.uKey },
                uPowers:  { value: this.uPowers },
                uLength:  { value: glyphCount },
            },
            transparent: true,
            depthTest: true,
            depthWrite: false,
        })

        this.mesh = new Mesh(gl, { geometry: geo, program: this.program })
        this.scene = new Transform()
        this.scene.addChild(this.mesh)

        this.camera = new Camera(gl, { fov: 25 })
        this.camera.position.z = 2
    }

    setSize(width: number, height: number) {
        this.program.uniforms.uScreen.value = [width, height]
        this.camera.perspective({ aspect: width / height })
    }

    update(t: number) {
        this.uTime = t
        this.program.uniforms.uTime.value = t
    }

    dispose() {
        this.mesh?.remove()
        // OGL cleans up on GC, but we can explicitly drop texture/program refs:
        ;(this.texture as any).image = null
    }

    private build(text: string, font: BMFont) {
        const charsById = new Map<number, BMChar>()
        for (const c of font.chars) charsById.set(c.id, c)

        const scaleW = font.common.scaleW
        const scaleH = font.common.scaleH
        const lineHeight = font.common.lineHeight

        const lines = text.split('\n')

        const positions: number[] = []
        const uvs: number[] = []
        const ids: number[] = []
        const indices: number[] = []
        const indices3: number[] = []

        let glyphIndex = 0
        let vertIndex = 0

        lines.forEach((line, lineIdx) => {
            let xCursor = 0
            const yCursor = -lineIdx * lineHeight

            for (let i = 0; i < line.length; i++) {
                const cp = line.codePointAt(i)!
                // Handle surrogate pairs
                if (cp > 0xffff) i++
                const ch = charsById.get(cp)
                if (!ch) continue

                const x = xCursor + ch.xoffset
                const y = yCursor - ch.yoffset
                const w = ch.width
                const h = ch.height

                // quad positions (two triangles) in "font space"
                // z=0, we’ll let Camera/project do the rest
                positions.push(
                    x,     -y,      0,
                    x + w, -y,      0,
                    x + w, -y - h,  0,
                    x,     -y - h,  0,
                )

                const u0 = ch.x / scaleW
                const v0 = ch.y / scaleH
                const u1 = (ch.x + w) / scaleW
                const v1 = (ch.y + h) / scaleH

                uvs.push(
                    u0, v0,
                    u1, v0,
                    u1, v1,
                    u0, v1
                )

                // shader attributes
                const idf = glyphIndex
                ids.push(idf, idf, idf, idf)
                indices3.push(
                    glyphIndex, lineIdx, 0,
                    glyphIndex, lineIdx, 0,
                    glyphIndex, lineIdx, 0,
                    glyphIndex, lineIdx, 0,
                )

                // faces (two triangles per quad)
                indices.push(
                    vertIndex, vertIndex + 1, vertIndex + 2,
                    vertIndex, vertIndex + 2, vertIndex + 3
                )

                vertIndex += 4
                glyphIndex++
                xCursor += ch.xadvance
            }
        })

        return {
            positions: new Float32Array(positions),
            uvs: new Float32Array(uvs),
            ids: new Float32Array(ids),
            indices: new Uint16Array(indices),
            indices3: new Float32Array(indices3),
            glyphCount: glyphIndex,
        }
    }
}