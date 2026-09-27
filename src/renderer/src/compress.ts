import type { CompressExport } from '../../common/types';

export const compressOutFormat = 'mp4';

// Scale so that the shortest side is at most `maxSize` (works for both landscape and portrait/vertical video).
// Never scales up. -2 keeps aspect ratio and makes sure the dimension is even (required by yuv420p)
// Note: autorotation is applied before filters, so iw/ih are the displayed dimensions.
export function getScaleFilter(maxSize: number) {
  return `scale=w='if(gte(iw,ih),-2,min(${maxSize},iw))':h='if(gte(iw,ih),min(${maxSize},ih),-2)'`;
}

export function getCompressEncodeArgs({ videoCodec, resolution, fps }: Pick<CompressExport, 'videoCodec' | 'resolution' | 'fps'>) {
  const filters: string[] = [];
  if (resolution !== 'original') filters.push(getScaleFilter(resolution));
  if (fps !== 'original') filters.push(`fps=${fps}`);

  const videoArgs = videoCodec === 'h265'
    // hvc1 tag is needed for playback on Apple devices
    ? ['-c:v', 'libx265', '-preset', 'medium', '-crf', '24', '-tag:v', 'hvc1']
    : ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high'];

  return [
    ...(filters.length > 0 ? ['-vf', filters.join(',')] : []),
    ...videoArgs,
    // 8 bit 4:2:0 for maximum compatibility (e.g. 10 bit sources from DJI cameras)
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
  ];
}
