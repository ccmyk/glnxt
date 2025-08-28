// src/lib/gl/families/tt.ts
// This file contains all the OGL logic for creating and managing an MSDF text mesh.
// It is the direct translation of the vanilla project's `gl/💬/base.js` and `position.js`.
import { Camera, Geometry, Mesh, Program, Texture, Transform } from 'ogl';
import { ttVert, ttFrag } from './ttShaders';
import { gsap } from '@/lib/anim/gsap';
import { OGLAssets } from '@/components/gl/GLCanvas';

// Type definitions for the BMFont JSON structure
type BMChar = { id: number; x: number; y: number; width: number; height: number; xoffset: number; yoffset: number; xadvance: number; };
type BMFont = { chars: BMChar[]; common: { scaleW: number; scaleH: number; lineHeight: number }; info: { size: number } };

export class OGLText {
    mesh: Mesh;
    program: Program;
    scene: Transform;
    camera: Camera;

    // Uniforms that can be animated externally via GSAP
    uniforms = {
        uPower: { value: 0 },
        uStart: { value: 1 }, // Start at 1 for the initial reveal
        uKey: { value: -2 }, // Default state from vanilla code
        uPowers: { value: new Float32Array(64).fill(0) },
        uMouse: { value: [0, 0] },
        uTime: { value: 0 },
    };

    constructor(gl: WebGL2RenderingContext, { atlasImage, atlasMeta, text }: OGLAssets & { text: string }) {
        const texture = new Texture(gl, { image: atlasImage, flipY: false });
        const { positions, uvs, ids, indices3, elementIndices, glyphCount } = this.buildGeometry(text, atlasMeta);

        const geometry = new Geometry(gl, {
            position: { size: 3, data: positions },
            uv: { size: 2, data: uvs },
            id: { size: 1, data: ids },
            index: { size: 3, data: indices3 }, // Note: 'index' is a vec3 attribute in your shader
        });
        geometry.setIndex(elementIndices);

        this.program = new Program(gl, {
            vertex: ttVert,
            fragment: ttFrag,
            uniforms: {
                tMap: { value: texture },
                uCols: { value: 5.0 },
                uColor: { value: 0.0 }, // Black text
                uLength: { value: glyphCount },
                ...this.uniforms,
            },
            transparent: true,
            depthWrite: false,
        });

        this.mesh = new Mesh(gl, { geometry, program: this.program });

        this.scene = new Transform();
        this.scene.addChild(this.mesh);
        this.camera = new Camera(gl, { fov: 15 });
        this.camera.position.z = 10; // Adjust Z based on mesh size
    }

    // Animate the text into view (translates logic from vanilla `position.js`)
    enter() {
        gsap.to(this.uniforms.uStart, { value: 0, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(this.uniforms.uPower, { value: 1, duration: 2.0, ease: 'power2.inOut' });
    }

    resize(width: number, height: number) {
        this.camera.perspective({ aspect: width / height });
    }

    update(time: { t: number, dt: number }) {
        this.uniforms.uTime.value = time.t;
    }

    dispose() {
        // OGL will garbage collect, but explicit disposal is good practice
    }

    private buildGeometry(text: string, font: BMFont) {
        const map = new Map<number, BMChar>();
        for (const ch of font.chars) map.set(ch.id, ch);

        const positions = [];
        const uvs = [];
        const ids = [];
        const elementIndices = [];
        const indices3 = [];

        let xCursor = 0;
        let vertIndex = 0;
        let glyphIndex = 0;
        const fontScale = 0.05; // Scale down to a manageable size in WebGL space

        for (const char of text) {
            const id = char.codePointAt(0)!;
            const bmChar = map.get(id);
            if (!bmChar) {
                xCursor += font.info.size * 0.3 * fontScale;
                continue;
            }

            const x = xCursor + bmChar.xoffset * fontScale;
            const y = -bmChar.yoffset * fontScale;
            const w = bmChar.width * fontScale;
            const h = bmChar.height * fontScale;

            positions.push(x, y, 0,  x + w, y, 0,  x + w, y - h, 0,  x, y - h, 0);

            const u0 = bmChar.x / font.common.scaleW;
            const v0 = bmChar.y / font.common.scaleH;
            const u1 = (bmChar.x + w) / font.common.scaleW;
            const v1 = (bmChar.y + h) / font.common.scaleH;
            uvs.push(u0, v0, u1, v0, u1, v1, u0, v1);

            ids.push(glyphIndex, glyphIndex, glyphIndex, glyphIndex);
            indices3.push(glyphIndex, 0, 0, glyphIndex, 0, 0, glyphIndex, 0, 0, glyphIndex, 0, 0);

            elementIndices.push(vertIndex, vertIndex + 1, vertIndex + 2, vertIndex, vertIndex + 2, vertIndex + 3);

            vertIndex += 4;
            glyphIndex++;
            xCursor += bmChar.xadvance * fontScale;
        }

        // Center the geometry
        const textWidth = xCursor;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] -= textWidth / 2;
        }

        return {
            positions: new Float32Array(positions),
            uvs: new Float32Array(uvs),
            ids: new Float32Array(ids),
            indices3: new Float32Array(indices3),
            elementIndices: new Uint16Array(elementIndices),
            glyphCount: glyphIndex,
        };
    }
}