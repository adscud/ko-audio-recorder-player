import React from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {DEVICE_WIDTH} from "../constant";

enum RecorderStatus {
    recording = 'recording',
    off = 'off',
}

export const Recorder = () => {
    const [ status, setStatus ] = React.useState<RecorderStatus>(RecorderStatus.off)

    const toggleRecordingStatus = React.useCallback(
        () => {
            switch (status) {
                case RecorderStatus.off:
                default:
                    setStatus(RecorderStatus.recording)
                    break
                case RecorderStatus.recording:
                    setStatus(RecorderStatus.off)
                    break
            }
        },
        [ status ]
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
    }
})
