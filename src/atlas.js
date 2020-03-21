import * as aH  from './fixi/loaders/atlas';

export default function atlasFrames(assets) {

  assets['tileFrames'] = {
    'black': [0, 0, 32, 32],
    'white': [0, 32 * 1, 32, 32],
    'black2': [0, 32 * 2, 32, 32],
    'white2': [0, 32 * 3, 32, 32]
  };

  assets['borderFrames'] = aH.extractNineSlice(0, 0, 32);
}
