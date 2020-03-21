import { objMap } from './util2';

export default function Graphics(gl) {

  gl.clearColor(0, 0, 0, 1);
  // https://stackoverflow.com/questions/57612782/how-to-render-objects-without-blending-with-transparency-enabled-in-webgl/57613578#57613578
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  // gl.enable(gl.DEPTH_TEST);

  this.gl = gl;

  this.minibatch = [];

  this.makeDraw = ({
    name,
    program,
    uniforms,
    textureInfos,
    bufferInfos,
    indices
  }) => {

    textureInfos = textureInfos || [];

    let vao = makeVao(gl, 
                      indices,
                      bufferInfos
                      .map(_ => _.apply(gl, program)));



    return {
      name,
      program,
      vao,
      textureInfos: textureInfos.map(_ => _.apply(gl, program)),
      uniforms: objMap(uniforms, (_, v) => v(gl, program)),
      numElements: indices.length
    };
  };


  this.addDrawInfo = (drawInfo, uniforms, numElements) => {
    addDrawInfo(drawInfo, uniforms, numElements);
  };

  const addDrawInfo = (drawInfo, uniformArgs, numElements) => {
    const cookUniforms = Object.keys(drawInfo.uniforms).map(key => {
      let setter = drawInfo.uniforms[key];
      let args = uniformArgs[key];
      return () => {
        if (!args) {
          throw new Error("undefined uniform " + key);
        }
        setter(...args);
      };
    });
    this.minibatch.push({...drawInfo, uniforms: cookUniforms, numElements });
  };
  
  this.render = () => {

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.minibatch.forEach(({
      program,
      uniforms,
      textureInfos,
      vao,
      numElements
    }) => {

      gl.useProgram(program);

      gl.bindVertexArray(vao);

      textureInfos.forEach(({ glTexture, index }) => {
        gl.uniform1i(index, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
      });

      uniforms.forEach(_ => _());

      // gl.drawArrays(gl.TRIANGLES, 0, numVertices);

      gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_SHORT, 0);

    });

    this.minibatch = [];
  };
}

const makeVao = (gl, indices, bufferInfos) => {
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  bufferInfos.forEach(({
    buffer,
    size,
    index
  }) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.vertexAttribPointer(index,
                           size,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.enableVertexAttribArray(index);

  });

  let indexBuffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // https://stackoverflow.com/questions/38948908/vbo-and-ebo-state-in-webgl
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices),
                gl.STATIC_DRAW);
  

  gl.bindVertexArray(null);

  return vao;
};


export function makeTextureInfoForUniform(name) {

  let gl, glTexture;

  this.apply = (_gl, program) => {
    gl = _gl;
    glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    return {
      glTexture,
      index: gl.getUniformLocation(program, name)
    };

  };

  this.set = (texture) => {
    gl.bindTexture(gl.TEXTURE_2D, glTexture);

    const format = gl.RGBA,
          type = gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, type, texture);

    //gl.generateMipmap(gl.TEXTURE_2D);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  };
}

export function makeBufferInfoForAttribute(name, {
  size }) {
  let gl, buffer;

  this.set = (array, {
    drawType = gl.STATIC_DRAW
  }) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawType);
  },

  this.apply = (_gl, program) => {
    gl = _gl;
    buffer = gl.createBuffer();
    return {
      buffer,
      size,
      index: gl.getAttribLocation(program, name)
    };
  };
};


const withGLLocation = f => name => (gl, program) => {
  return f(gl, gl.getUniformLocation(program, name));
};

export const makeUniform1fSetter = withGLLocation((gl, location) => (...args) => gl.uniform1f(location, ...args));


export const makeUniform2fSetter = withGLLocation((gl, location) => (...args) => gl.uniform2f(location, ...args));

export const makeUniform2fvSetter = withGLLocation((gl, location) => (vec) => gl.uniform2fv(location, vec));

export const makeUniform3fvSetter = withGLLocation((gl, location) => (vec) => gl.uniform3fv(location, vec));

export const makeUniformM3fvSetter = withGLLocation((gl, location) => (matrix) => gl.uniformMatrix3fv(location, false, matrix));

export const makeUniformM4fvSetter = withGLLocation((gl, location) => (matrix) => gl.uniformMatrix4fv(location, false, matrix));


export const makeProgram = (gl, vSource, fSource) => {
  let vShader = createShader(gl, gl.VERTEX_SHADER, vSource);
  let fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource);

  let program = createProgram(gl, vShader, fShader);

  return program;
};

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error('Cannot create shader: [' + source + '] ' + gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

function createProgram(gl, vShader, fShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
