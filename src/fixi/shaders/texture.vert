#version 300 es

precision mediump float;

in vec2 aPosition;

in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat3 uMatrix;

uniform mat3 uTextureMatrix;

void main() {


  vec4 position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0, 1);

  vTexCoord = (uTextureMatrix * vec3(aTexCoord, 1.0)).xy;

  gl_Position = position;

}
