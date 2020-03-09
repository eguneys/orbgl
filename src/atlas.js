import extractFramesForAnimation from './fixi/loaders/atlas';

export default function atlasFrames(assets) {

  assets['magicFrames'] = extractFramesForAnimation(
    assets['magicatlas'],
    `magic %.aseprite`, 6);
}
