// src/lib/gl/text/MsdfTextTT.ts
import { Geometry, Program, Mesh, Texture, Camera, Transform } from 'ogl';
import { ttVert, ttFrag } from './ttShaders';

type BMChar = {
    id: number; x: number; y: number; width: number; height: number;
    xoffset: number; yoffset: number; xadvance: number;
};
type BMCommon = { lineHeight: number; scaleW: number; scaleH: number };
type BMFont = { chars: BMChar[]; common: BMCommon; info: { size: number } };

export type MsdfTextTTOpts = {
    gl: WebGL2RenderingContext;
    atlasImage: HTMLImageElement;
    atlasMeta: BMFont;
    text: string;
    color?: number;             // your shader expects float uColor; 0=black/1=white in your code
    cols?: number;              // uCols
    screen?: [number, number];  // uScreen (px)
};

export class MsdfTextTT {
    mesh: Mesh;
    program: Program;
    texture: Texture;
    camera: Camera;
    scene: Transform;

    // external uniforms you’ll modulate via GSAP:
    uTime = 0;
    uMouse: [number, number] = [0, 0];
    uPower = 0;
    uStart = 0;
    uKey = -2; // your defaults used -2 / -1 branches
    uPowers = new Float32Array(64); // must match `#define numTextures 64`

    constructor(opts: MsdfTextTTOpts) {
        const { gl, atlasImage, atlasMeta, text } = opts;
        const { positions, uvs, ids, indices, indices3, glyphCount } = this.build(text, atlasMeta);

        const geo = new Geometry(gl, {
            position: { size: 3, data: new Float32Array(positions) },
            uv:       { size: 2, data: new Float32Array(uvs) },
            id:       { size: 1, data: new Float32Array(ids) },        // float
            index:    { size: 3, data: new Float32Array(indices3) },   // vec3 (placeholder: [glyphIndex, 0, 0])
            // NOTE: do NOT pass the element indices as "index" here, OGL reserves that name for EBO.
            // We already stored EBO below as "gl_index".
            gl_index: { data: new Uint16Array(indices) },
        } as any);

        // Remap "gl_index" to the actual index buffer key OGL expects
        (geo as any.attributes.index = (geo as any.attributes.gl_index)) && delete (geo as any.attributes.gl_index);

        this.texture = new Texture(gl, { image: atlasImage, flipY: false });

        this.program = new Program(gl, {
            vertex: ttVert,
            fragment: ttFrag,
            uniforms: {
                tMap:      { value: this.texture },
                uTime:     { value: this.uTime },
                uMouse:    { value: this.uMouse },
                uPower:    { value: this.uPower },
                uCols:     { value: opts.cols ?? 5.0 },
                uColor:    { value: opts.color ?? 0.0 }, // your shader uses float uColor
                uStart:    { value: this.uStart },
                uKey:      { value: this.uKey },
                uPowers:   { value: this.uPowers },
                uScreen:   { value: opts.screen ?? [gl.drawingBufferWidth, gl.drawingBufferHeight] },
                uLength:   { value: glyphCount },
            },
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        this.mesh = new Mesh(gl, { geometry: geo, program: this.program });

        // Minimal scene/camera for modelViewMatrix/projectionMatrix
        this.camera = new Camera(gl, { fov: 18 });
        this.camera.position.z = 1000;     // large enough so your px plane is in front
        this.scene = new Transform();

        // Put mesh at origin; since your shader uses model/projection, we keep units as px.
        this.scene.addChild(this.mesh);
    }

    setMouse(x: number, y: number) {
        this.uMouse = [x, y];
        this.program.uniforms.uMouse.value = this.uMouse;
    }
    setTime(t: number) {
        this.uTime = t;
        this.program.uniforms.uTime.value = t;
    }
    setStart(v: number) {
        this.uStart = v;
        this.program.uniforms.uStart.value = v;
    }
    setPower(v: number) {
        this.uPower = v;
        this.program.uniforms.uPower.value = v;
    }
    setKey(v: number) {
        this.uKey = v;
        this.program.uniforms.uKey.value = v;
    }
    setPowers(arr: number[]) {
        this.uPowers.set(arr.slice(0, this.uPowers.length));
        this.program.uniforms.uPowers.value = this.uPowers;
    }

    render(gl: WebGL2RenderingContext) {
        this.camera.perspective({ aspect: gl.drawingBufferWidth / gl.drawingBufferHeight });
        this.mesh.program.uniforms.uScreen.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
        this.mesh.program.uniforms.uTime.value = this.uTime;
        this.mesh.program.uniforms.uMouse.value = this.uMouse;
        this.mesh.program.uniforms.uPower.value = this.uPower;
        this.mesh.program.uniforms.uStart.value = this.uStart;
        this.mesh.program.uniforms.uKey.value = this.uKey;
        // uPowers is already a Float32Array bound by reference
    }

    dispose() {
        this.mesh?.geometry?.dispose();
        this.mesh?.program?.remove();
        this.texture?.destroy?.();
    }

    private build(text: string, meta: BMFont) {
        const map = new Map<number, BMChar>();
        for (const ch of meta.chars) map.set(ch.id, ch);

        const positions: number[] = [];
        const uvs: number[] = [];
        const ids: number[] = [];
        const indices: number[] = [];
        const indices3: number[] = [];

        const atlasW = meta.common.scaleW;
        const atlasH = meta.common.scaleH;

        let penX = 0;
        let penY = 0;
        let idx = 0;
        let glyphIndex = 0;

        for (const cp of Array.from(text)) {
            const code = cp.codePointAt(0)!;
            const c = map.get(code);
            if (!c) { penX += meta.info.size * 0.3; continue; }

            const x = penX + c.xoffset;
            const y = penY - c.yoffset;

            const x0 = x, y0 = y;
            const x1 = x + c.width, y1 = y + c.height;

            const u0 = c.x / atlasW, v0 = c.y / atlasH;
            const u1 = (c.x + c.width) / atlasW, v1 = (c.y + c.height) / atlasH;

            // 4 verts: position (z=0), uv, id, index(vec3)
            positions.push(
                x0, y0, 0,
                x1, y0, 0,
                x1, y1, 0,
                x0, y1, 0
            );
            uvs.push(
                u0, v0,
                u1, v0,
                u1, v1,
                u0, v1
            );
            ids.push(glyphIndex, glyphIndex, glyphIndex, glyphIndex);
            indices3.push(
                glyphIndex, 0, 0,
                glyphIndex, 0, 0,
                glyphIndex, 0, 0,
                glyphIndex, 0, 0
            );

            indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
            idx += 4;
            glyphIndex += 1;
            penX += c.xadvance;
        }

        return { positions, uvs, ids, indices, indices3, glyphCount: glyphIndex };
    }
}