#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Background pattern effect
    float time = uTime * 0.001;
    float pattern = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time) * 0.5 + 0.5;
    
    vec3 color = mix(vec3(0.1, 0.1, 0.1), vec3(0.3, 0.3, 0.3), pattern);
    
    gl_FragColor = vec4(color, uProgress);
}


