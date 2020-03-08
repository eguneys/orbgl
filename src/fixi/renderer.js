import { objMap, objForeach } from './util2';

import Graphics from './graphics';
import * as G from './graphics';

import * as mat4 from './mat4';

import Pool from 'poolf';

export default function Renderer(canvas) {

  const { gl, width, height } = canvas;

  let g = new Graphics(gl);

  let prCache = {},
      drawInfos = {},
      transforms = {};

  this.makePrograms = (prs) => {

    Object.keys(prs).forEach(key => {
      let { vSource, fSource } = prs[key];

      prCache[key] = G.makeProgram(g.gl, vSource, fSource);
    });

  };

  this.makeMeshes = (mess) => {

    drawInfos = objMap
    (mess, (_, { name = _, 
                 program: programName,
                 geometry,
                 material }) => 
     new Pool(id => {
       
       let program = prCache[programName];
       if (!program) {
         throw new Error("Undefined program name " + programName);
       }

       if (!geometry) {
         console.warn("Undefined geometry for mesh " + name);
       }


       const uTextureInfo = 
             new G.makeTextureInfoForUniform("uTexture");

       const aPosInfo = new G.makeBufferInfoForAttribute
       ("aPosition", { size: 3 });

       const aTexCoordInfo = new G.makeBufferInfoForAttribute
       ("aTexCoord", { size: 3 });


       const mesh = g.makeDraw({
         name,
         program,
         uniforms: {
           'uMatrix': G.makeUniformM4fvSetter('uMatrix')
         },
         textureInfos: [
           uTextureInfo
         ],
         bufferInfos: [
           aPosInfo,
           aTexCoordInfo
         ],
         indices: geometry.indices
       });

       // uTextureInfo.set(material);

       aPosInfo.set(geometry.vertices, g.gl.STATIC_DRAW);
       aTexCoordInfo.set(geometry.uvs, g.gl.STATIC_DRAW);
       
       return {
         uTextureInfo,
         drawInfo: mesh
       };
     })
    );    
  };


  this.makeTransform = (name, transform) => {
    transforms[name] = modelMatrix(transform);
  };

  const modelMatrix = transform => {
    let matrix = transforms[transform.transform] || mat4.identity();

    return mat4.transform(matrix, transform);
  };

  const mvpMatrix = modelMatrix => {
    let projectionMatrix = mat4.projection(width, height, 2);
    
    return mat4.multiply(projectionMatrix, modelMatrix);

  };

  const sizeToScale = transform => {
    if (transform.size) {
      transform.scale = [transform.size[0] / 256, 
                         transform.size[1] / 256, 
                         1];
    }
    return transform;
  };

  this.drawMesh = (name, uniforms, transform = {}) => {
    
    const uMatrix = mvpMatrix(modelMatrix(sizeToScale(transform)));
    
    let drawInfoPool = drawInfos[name];
    
    
    if (!drawInfoPool) {
      throw new Error("undefined mesh " + name);
    }

    let { drawInfo, uTextureInfo } = drawInfoPool.acquire();

    uniforms = {
      uMatrix: [uMatrix],
      ...uniforms
    };

    if (uniforms.texture) {
      uTextureInfo.set(uniforms.texture);
    }

    g.addDrawInfo(drawInfo, uniforms, drawInfo.numElements);

  };


  this.render = () => {
    g.render();
    release();
  };


  const release = () => {
    objForeach(drawInfos, (_, pool) => pool.releaseAll());
  };
}
