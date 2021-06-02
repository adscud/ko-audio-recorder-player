import {Alert} from "react-native";
import {Audio as AudioAV} from "expo-av";

interface I_Audio {
    recording: () => Promise<void>
    stopRecording: () => Promise<string>
}

class Audio implements I_Audio {
    _instance: AudioAV.Recording | undefined
    _options = {
        isMeteringEnabled: true,
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

    recording = async () => {
        const {granted} = await AudioAV.requestPermissionsAsync();

        if (!granted) {
            Alert.alert('', 'Cannot recording without permission.')
            throw Error()
        }

        await AudioAV.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        if (!this._instance) {
            this._instance = new AudioAV.Recording()
            await this._instance.prepareToRecordAsync(this._options);
        }

        await this._instance.startAsync();
    }

    stopRecording = async () => {
        await this._instance?.stopAndUnloadAsync()
        return this._instance?.getURI() as string
    }
}

export const audioService = new Audio()
