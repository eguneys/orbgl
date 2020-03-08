import { programMap } from './fixi/shaders';
import Renderer from './fixi/renderer';

import { PlaneGeometry } from './fixi/geometry';

export default function initRenderer(canvas) {

  let renderer = new Renderer(canvas);

  let meshMap = {
    'quad': {
      program: 'texture',
      geometry: PlaneGeometry(256, 256)
    }
  };

  renderer.makePrograms(programMap);
  renderer.makeMeshes(meshMap);
  
  return renderer;
  
}
