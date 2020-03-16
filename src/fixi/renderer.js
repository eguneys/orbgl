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
             'uMatrix': G.makeUniformM3fvSetter('uMatrix'),
             'uTextureMatrix': G.makeUniformM3fvSetter('uTextureMatrix'),
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

         aPosInfo.set(geometry.vertices, g.gl.STATIC_DRAW);
         aTexCoordInfo.set(geometry.uvs, g.gl.STATIC_DRAW);

         return {
           uTextureInfo,
           drawInfo: mesh
         };
       };
       return new Pool(onNewItem, { warnLeak: 10000 });
     });
  };


  this.makeTransform = (name, transform) => {
    transforms[name] = modelMatrix(transform);
  };

  const textureMatrix = (bounds, width, height) => {

    let clamped = mat3.identity();

    if (!bounds) return clamped;

    let transform = {
      translate: [bounds[0] / width, bounds[1] / height],
      scale: [bounds[2] / width, bounds[3] / height]
    };

    return mat3.transform(clamped, transform);
  };

  const modelMatrix = transform => {
    let matrix = transforms[transform.transform] || mat3.identity();

    return mat3.transform(matrix, transform);
  };

  const mvpMatrix = modelMatrix => {
    let projectionMatrix = mat3.projection(width, height);

    return mat3.multiply(projectionMatrix, modelMatrix);

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

    let { drawInfo, uTextureInfo } = drawInfoPool.acquire();

    const { texture } = uniforms;

    let uTextureMatrix;

    if (texture && texture.src) {
      uTextureMatrix = textureMatrix(texture.frame,
                                     texture.src.width,
                                     texture.src.height);

      uTextureInfo.set(texture.src);
    } else {
      uTextureMatrix = mat3.identity();
      console.warn(`Undefined texture for ${drawInfo.name}`);
    }

    const uMatrix = mvpMatrix(modelMatrix(sizeToScale(transform)));

    uniforms = {
      uMatrix: [uMatrix],
      uTextureMatrix: [uTextureMatrix],
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