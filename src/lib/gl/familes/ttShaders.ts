// src/lib/gl/familes/ttShaders.ts
// This file contains the final, corrected shaders for the 'tt' family.
export const ttVert = /* glsl */ `#version 300 es
precision highp float;
#define attribute in
#define varying out

in vec2 uv;
in vec3 position;
in float id;
in vec3 index;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;
out vec2 vUvR;
out vec3 vPos;
out vec3 vIndex;
out float vId;

void main() {
    vUv = uv;
    vUvR = vec2(gl_VertexID << 1 & 2, gl_VertexID & 2);
    vPos = position;
    vId = id;
    vIndex = index;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ttFrag = /* glsl */ `#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
#define numTextures 64

out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse;
uniform float uPower;
uniform float uCols;
uniform float uColor;
uniform float uStart;
uniform float uKey;
uniform float uPowers[numTextures];

in vec2 vUv;
in vec2 vUvR;
in vec3 vPos;
in float vId;
in vec3 vIndex;

float ripple(float uv, float time, float prog) {
    float distance = length((uv) + time);
    return tan(distance * (prog)) * (-0.01);
}

void main() {
    float time2 = sin(uTime * 0.0008);
    float cols = uCols;
    vec3 tex = vec3(0.);
    float sumac = 0.;
    float mPos = 0.;
    float mPower = 0.;
    highp int index = int(vId);

    if(uKey == -2.0){
      mPower = 1.0 - uStart;
      mPos = (uStart - 1.0) * 1.0;
      float startshit = (((vUvR.y - 1.0) * 7.0 * 0.001)) * uStart;
      sumac = (ripple(vUvR.y, mPos, cols) * (0.4 * (1.0 - mPower + (1.0 * uPower))));
      float rippleUV = (vUv.x + (startshit)) + sumac;
      tex = texture2D(tMap, vec2(rippleUV, vUv.y)).rgb;
    } else {
      mPos = uPowers[index] * -2.0;
      mPower = abs(uPowers[index] * (2.0 - abs(time2 * 0.5)));
      sumac = (ripple(vUvR.y, mPos, cols) * (0.2 * (1.0 - mPower)) * (1.0 - mPower));
      float rippleUV = vUv.x + sumac;
      tex = texture2D(tMap, vec2(rippleUV, vUv.y)).rgb;
    }

    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    FragColor.rgb = vec3(uColor);
    FragColor.a = alpha * (1.0 - uStart * 1.9);
    FragColor.a -= abs(sumac * 8.0);
}
`;