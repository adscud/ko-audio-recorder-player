import React from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {DEVICE_WIDTH} from "../constant";
import {audioService, RecordingStatusUpdateEvent, timeService} from "../service";

enum RecorderStatus {
    recording = 'recording',
    off = 'off',
}

interface RecorderProps {
    onFinishRecording: (uri: string) => void
}

export const Recorder = (props: RecorderProps) => {
    const [ status, setStatus ] = React.useState<RecorderStatus>(RecorderStatus.off)
    const [ time, setTime ] = React.useState<string>('00:00')

    const onRecordingStatusUpdate = (event: RecordingStatusUpdateEvent) => {
        const { durationMillis } = event
        setTime(timeService.milliToMMSS(durationMillis))
    }

    const toggleRecordingStatus = React.useCallback(
        async () => {
            switch (status) {
                case RecorderStatus.off:
                default:
                    setStatus(RecorderStatus.recording)
                    try {
                        await audioService.recording(onRecordingStatusUpdate)
                    } catch (error) {
                        setStatus(RecorderStatus.off)
                        console.log({error})
                    }
                    break
                case RecorderStatus.recording:
                    setStatus(RecorderStatus.off)
                    try {
                        const uri = await audioService.stopRecording()
                        props.onFinishRecording(uri)
                    } catch (error) {
                        console.log({error})
                    }
                    break
            }
        },
        [ status, onRecordingStatusUpdate ]
    )

    const action = React.useMemo(
        () => {
            switch(status) {
                case RecorderStatus.off:
                default:
                    return 'Start'
                case RecorderStatus.recording:
                    return 'Stop'
            }
        },
        [ status ]
    )

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{time}</Text>
            <TouchableHighlight
                onPress={toggleRecordingStatus}
                underlayColor={'#bc4040'}
                style={styles.recording}
            >
                <Text style={styles.action}>
                    {action} recording
                </Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recording: {
        justifyContent: 'center',
        alignItems: 'center',
        width: DEVICE_WIDTH * 0.4,
        height: 44,
        backgroundColor: '#dd4c4c'
    },
    action: {
        color :'#ffffff',
        fontWeight: 'bold'
    },
    timer: {
        color: '#333333',
        fontSize: 15,
        alignSelf: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    }
})
