// Turbopack-friendly GLSL module (react-ogl/OGL compatible)
// Original source: gl/media/main.fragment.glsl
const frag = String.raw`
precision highp float;

uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform sampler2D tMap;
uniform float uStart;
uniform float uStart1;
uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vPos;

vec2 coverTexture( vec2 imgSize, vec2 ouv, vec2 mouse) {
  vec2 s = uCover;
  vec2 i = imgSize;
  ouv.x-=( (mouse.x) * 1.);
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 newV = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((newV.x - s.x) / 2.0, 0.0) : vec2(0.0, (newV.y - s.y) / 2.0)) / newV;
  vec2 uv = ouv * s / newV + offset;
  return uv;
}

void main() {
float sum = 0.;
vec2 mouse = uMouse;
vec2 tSize = uTextureSize;
mouse.x += (uStart) * -.8;
tSize.x *= 1. + abs(mouse.x); 

vec2 cover = coverTexture(tSize, vUv,mouse);

float cols = 8.;

float timeralpha = 0.;
float alpha = 1.;
vec2 U = cover,
    P = vec2(cols, cols),
    C = floor(U*P)/P;

float centpos = vUv.x + (mouse.x );
    centpos += -.5 + (mouse.x * 2.4 );
    centpos *=2.;
    centpos = abs(centpos);

    float cent = (1. - vUv.x);
    cent += -.5  + (mouse.x * .4 );
    cent *=2.;
    cent = abs(cent);
float otro = floor((cent)*P.x)/P.x;
U.x -= otro;
U.x += (mouse.x * (otro * .2));
U.x += (centpos*1.2) * (mouse.x * (otro * .1));
U.x += otro;
vec2 direction = U;
float distor = 1.;
  distor += (.006 * abs(mouse.x));

  U.x += uMouse.x * .2;
  if(U.x > 1.){}

  if(U.x < 0.){}
vec2 end = U;
float r = texture2D(tMap, vec2(end.x,end.y)).r;
  float g = texture2D(tMap, vec2(end.x,end.y)).g;
  float b = texture2D(tMap, vec2(end.x,end.y)).b;
gl_FragColor = vec4(r , g , b ,alpha);
}
`;

export default frag;
