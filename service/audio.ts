import {Alert} from "react-native";
import {Audio as AudioAV} from "expo-av";

interface I_Audio {
    _askPermission: () => Promise<boolean>

    recording: () => Promise<string>
}

class Audio implements I_Audio {
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

        return 'OK'
    }
}

export const audioService = new Audio()
