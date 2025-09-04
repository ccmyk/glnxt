#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;

void main() {
    vec4 tex = texture2D(tMap, vUv);
    
    // Simple post-processing effect
    float wave = sin(vUv.x * 10.0 + uTime * 0.001) * 0.1;
    vec2 uv = vUv + vec2(wave, 0.0);
    
    gl_FragColor = texture2D(tMap, uv);
    gl_FragColor.a *= uProgress;
}


