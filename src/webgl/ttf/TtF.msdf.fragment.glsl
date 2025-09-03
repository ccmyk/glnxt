#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uScreen;
uniform vec2 uMouse;
uniform float uPower;
uniform float uCols;
uniform float uColor;
uniform float uStart;
uniform float uKey;
uniform float uPowers[100];

varying vec2 vUv;
varying vec2 vUvR;
varying vec3 vPos;
varying float vId;
varying vec3 vIndex;

void main() {
    vec3 tex = texture2D(tMap, vUv).rgb;
    
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);
    
    gl_FragColor.rgb = vec3(uColor);
    gl_FragColor.a = alpha * (1.0 - uStart);
}

