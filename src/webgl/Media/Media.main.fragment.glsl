#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform sampler2D tMap;
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Simple media effect
    float wave = sin(uv.x * 5.0 + uTime * 0.001) * 0.02;
    uv += vec2(wave, 0.0);
    
    vec4 tex = texture2D(tMap, uv);
    
    gl_FragColor = tex;
    gl_FragColor.a *= uProgress;
}

