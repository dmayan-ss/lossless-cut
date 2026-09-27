import { describe, expect, test } from 'vitest';

import { getCompressEncodeArgs } from './compress';

describe('getCompressEncodeArgs', () => {
  test('h264 original', () => {
    expect(getCompressEncodeArgs({ videoCodec: 'h264', resolution: 'original', fps: 'original' })).toEqual([
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k',
    ]);
  });

  test('h265 720p 50fps', () => {
    expect(getCompressEncodeArgs({ videoCodec: 'h265', resolution: 720, fps: 50 })).toEqual([
      '-vf', 'scale=w=\'if(gte(iw,ih),-2,min(720,iw))\':h=\'if(gte(iw,ih),min(720,ih),-2)\',fps=50',
      '-c:v', 'libx265', '-preset', 'medium', '-crf', '24', '-tag:v', 'hvc1',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k',
    ]);
  });
});
