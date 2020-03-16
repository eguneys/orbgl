#version 300 es

precision mediump float;

in vec2 vTexCoord;
in float vTextureId;

uniform sampler2D uSamplers[10];

out vec4 outColor;

void main() {

  vec4 col;

  color = texture(uSamplers[vTextureId], vTexCoord);

  outColor = col;
}
