#version 300 es

precision mediump float;

in vec4 aPosition;

in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat4 uMatrix;

void main() {


  vec4 position = uMatrix * aPosition;

  vTexCoord = aTexCoord;

  gl_Position = position;

}
