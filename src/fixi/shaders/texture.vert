#version 300 es

precision mediump float;

in vec2 aPosition;

in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat3 uMatrix;

void main() {


  vec4 position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0, 1);

  vTexCoord = aTexCoord;

  gl_Position = position;

}
