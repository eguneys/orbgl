#version 300 es

precision mediump float;

#include fdefs

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 outColor;

#include futil

void main() {

  vec4 col = texture(uTexture, vTexCoord);

  outColor = col;
}
