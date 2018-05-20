declare module "speaker" {
  export interface SpeakerOptions {
    channels?: number;
    bitDepth?: number;
    sampleRate?: number;
    signed?: boolean;
    float?: boolean;
    samplesPerFrame?: number;
    device?: string;
  }
  export default class Speaker {
    constructor(opts: SpeakerOptions);
  }
}
