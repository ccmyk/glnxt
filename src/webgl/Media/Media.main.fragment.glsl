#version 300 es
precision highp float;
#define varying in
#define texture2D texture
out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform float uStart;
uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
    vec2 U = vUv;
    float cols = 8.0;
    float cent = abs((1.0 - U.x) - 0.5 + (uMouse.x * 0.4)) * 2.0;
    float cell = floor(cent * cols) / cols;
    U.x += uMouse.x * (cell * 0.2);

    vec4 tex = texture2D(tMap, U);
    float alpha = 1.0 - clamp(uStart, 0.0, 1.0);
    FragColor = vec4(tex.rgb, tex.a * alpha);
}


