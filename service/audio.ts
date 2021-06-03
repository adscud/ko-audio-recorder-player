import {Alert} from "react-native";
import {Audio as AudioAV, AVPlaybackStatus,} from "expo-av";

export type RecordingStatusUpdateEvent = AudioAV.RecordingStatus
export type PlayingStatusUpdateEvent = AVPlaybackStatus

interface I_Audio {
    recording: (onRecordingStatusUpdate: (event: RecordingStatusUpdateEvent) => void) => Promise<void>
    stopRecording: () => Promise<string>
    playing: (uri: string, onPlayingStatusUpdate: (event: PlayingStatusUpdateEvent) => void) => Promise<void>
    pause: () => Promise<void>
    resume: (position: number) => Promise<void>
}

class Audio implements I_Audio {
    _instancePlaying: AudioAV.Sound | undefined
    _instanceRecording: AudioAV.Recording | undefined
    _options = {
        isMeteringEnabled: false,
        android: {
            extension: '.m4a',
            outputFormat: AudioAV.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: AudioAV.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: '.m4a',
            outputFormat: AudioAV.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: AudioAV.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    }

    recording = async (onRecordingStatusUpdate: (event: RecordingStatusUpdateEvent) => void) => {
        const {granted} = await AudioAV.requestPermissionsAsync();

        if (!granted) {
            Alert.alert('', 'Cannot recording without permission.')
            throw Error()
        }

        await AudioAV.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        if (!this._instanceRecording) {
            this._instanceRecording = new AudioAV.Recording()
            await this._instanceRecording.prepareToRecordAsync(this._options);
        }

        await this._instanceRecording.startAsync();
        await this._instanceRecording.setOnRecordingStatusUpdate(onRecordingStatusUpdate)
    }

    stopRecording = async () => {
        await this._instanceRecording?.stopAndUnloadAsync()
        const uri =  this._instanceRecording?.getURI() as string
        this._instanceRecording = undefined
        return uri
    }

    playing = async (uri: string, onPlayingStatusUpdate: (event: PlayingStatusUpdateEvent) => void) => {
        const { sound } = await AudioAV.Sound.createAsync({uri})

        this._instancePlaying = sound

        await this._instancePlaying.playAsync()
        await this._instancePlaying.setVolumeAsync(1)
        await this._instancePlaying.setOnPlaybackStatusUpdate(onPlayingStatusUpdate)
    }

    pause = async () => {
        await this._instancePlaying?.pauseAsync()
    }

    resume = async (position: number) => {
        await this._instancePlaying?.setPositionAsync(position)
        await this._instancePlaying?.playAsync()
    }
}

export const audioService = new Audio()
