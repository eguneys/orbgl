import { objMap, objForeach } from './util2';

import Graphics from './graphics';
import * as G from './graphics';

import * as mat3 from './mat3';
import * as v from './vec2';

import Pool from 'poolf';

const { vec2 } = v;

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
     {
       const onNewItem = id => {
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
         ("aPosition", { size: 2 });

         const aTexCoordInfo = new G.makeBufferInfoForAttribute
         ("aTexCoord", { size: 2 });


         const mesh = g.makeDraw({
           name,
           program,
           uniforms: {
             'uMatrix': G.makeUniformM3fvSetter('uMatrix')
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
         // aTexCoordInfo.set(geometry.uvs, g.gl.STATIC_DRAW);

         return {
           uTextureInfo,
           aTexCoordInfo,
           drawInfo: mesh
         };
       };
       return new Pool(onNewItem, { warnLeak: 10000 });
     });
  };


  this.makeTransform = (name, transform) => {
    transforms[name] = modelMatrix(transform);
  };

  const modelMatrix = transform => {
    let matrix = transforms[transform.transform] || mat3.identity();

    return mat3.transform(matrix, transform);
  };

  const mvpMatrix = modelMatrix => {
    let projectionMatrix = mat3.projection(width, height);

    return mat3.multiply(projectionMatrix, modelMatrix);

  };

  const uvs = (src, frame) => {
    const tw = src.width,
          th = src.height;

    const getTexelCoords = (x, y) => {
      return [(x + 0.5) / tw, (y + 0.5) / th];
    };

    let frameLeft = frame[0],
        frameRight = frame[0] + frame[2] - 1,
        frameTop = frame[1],
        frameBottom = frame[1] + frame[3] - 1;
    
    let p0 = getTexelCoords(frameLeft, frameTop),
        p1 = getTexelCoords(frameRight, frameTop),
        p2 = getTexelCoords(frameRight, frameBottom),
        p3 = getTexelCoords(frameLeft, frameBottom);

    return [
      p0[0], p0[1],
      p1[0], p1[1],
      p3[0], p3[1],
      p2[0], p2[1]
    ];    
  };

  const sizeToScale = transform => {
    if (transform.size) {
      let tScale = transform.scale||[1,1];

      transform.scale = [Math.sign(tScale[0]) * 
                         transform.size[0] / 256,
                         Math.sign(tScale[1]) * 
                         transform.size[1] / 256, 
                         1];
    }
    return transform;
  };

  this.drawMesh = (name, uniforms, transform = {}) => {
    
    let drawInfoPool = drawInfos[name];
    
    if (!drawInfoPool) {
      throw new Error("undefined mesh " + name);
    }

    let { drawInfo, uTextureInfo, aTexCoordInfo } = drawInfoPool.acquire();

    const { texture } = uniforms;

    if (texture && texture.src) {
      uTextureInfo.set(texture.src);

      aTexCoordInfo.set(uvs(texture.src, texture.frame), g.gl.STATIC_DRAW);
    } else {
      console.warn(`Undefined texture for ${drawInfo.name}`);
    }

    const uMatrix = mvpMatrix(modelMatrix(sizeToScale(transform)));

    uniforms = {
      uMatrix: [uMatrix],
      ...uniforms
    };


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
