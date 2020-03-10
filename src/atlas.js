import * as aH  from './fixi/loaders/atlas';

export default function atlasFrames(assets) {

  assets['magicFrames'] = aH.extractFramesForAnimation(
    assets['magicatlas'],
    `magic %.aseprite`, 6);

  assets['smokeFrames'] = aH.extractFramesForAnimation(
    assets['smokeatlas'],
    `smoke %.aseprite`, 12);

  assets['grassFrames'] = aH.makeHorizontalFrames(
    assets['grassatlas'],
    ['middle', 'top', 'left', 'leftCorner'], 64, 64);
}
