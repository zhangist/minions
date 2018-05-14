declare module "web-audio-api" {
  import Speaker from "speaker";

  export class AudioContext {
    constructor(opts?: object);

    bitDepth: number;
    currentTime: number;
    destination: AudioDestinationNode;
    numberOfChannels: number;
    outStream: null|Speaker;
    sampleRate: number;
    format: {
      numberOfChannels: number;
      bitDepth: number;
      sampleRate: number;
    }

    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    decodeAudioData(audioData: any, successCallback: (audioBuffer: AudioBuffer) => void, errorCallback: (err: any) => void): void;
    createBufferSource(): AudioBufferSourceNode;
    createGain(): GainNode;
    createScriptProcessor(buffSize: number, numberOfInputChannels: number, numberOfOutputChannels: number): ScriptProcessorNode;
  }
}
