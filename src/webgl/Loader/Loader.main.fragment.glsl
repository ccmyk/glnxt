#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform float uTime;
uniform float uStart1;
uniform float uStart0;
uniform float uStart2;
uniform float uStartX;
uniform float uStartY;
uniform float uMultiX;
uniform float uMultiY;
uniform vec2 uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    float time = uTime * 0.001;
    float noise = sin(uv.x * 100.0 + time) * sin(uv.y * 100.0 + time) * 0.5 + 0.5;
    
    float alpha = uStart0 * (1.0 - uStart2) * noise;
    
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}


