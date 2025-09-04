#version 300 es
precision highp float;
#define attribute in
#define varying out

attribute vec2 uv;
attribute vec3 position;

uniform vec2 uCover;
uniform vec2 uTextureSize;

varying vec2 vUv;

vec2 resizeUvCover(vec2 uvn, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );
    return vec2(
        uvn.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uvn.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
}

void main() {
    vUv = resizeUvCover(uv, uTextureSize, uCover);
    gl_Position = vec4(position, 1.0);
}


