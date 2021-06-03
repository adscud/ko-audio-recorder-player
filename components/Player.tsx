import React from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {DEVICE_WIDTH} from "../constant";
import {audioService, PlayingStatusUpdateEvent, timeService} from "../service";

enum PlayerStatus {
    playing = 'playing',
    paused = 'paused',
    off = 'off'
}

interface PlayerProps {
    uri: string
}

export const Player = (props: PlayerProps) => {
    const [ status, setStatus ] = React.useState<PlayerStatus>(PlayerStatus.off)
    const [ time, setTime ] = React.useState<string>('00:00')
    const [ millis, setMillis ] = React.useState<number>(0)

    const action = React.useMemo(
        () => status === PlayerStatus.off ? 'Play' : 'Pause',
        [ status ]
    )

    const onPlayingStatusUpdate = (event: PlayingStatusUpdateEvent) => {
        if (event.didJustFinish) {
            setStatus(PlayerStatus.off)
            return
        }

        setMillis(event.positionMillis)
        setTime(timeService.milliToMMSS(event.positionMillis))
    }

    const togglePlayingStatus = React.useCallback(
        async () => {
            switch (status) {
                case PlayerStatus.off:
                default:
                    setStatus(PlayerStatus.playing)
                    try {
                        await audioService.playing(props.uri, onPlayingStatusUpdate)
                    } catch (error) {
                        console.log({error})
                    }
                    break
                case PlayerStatus.paused:
                    setStatus(PlayerStatus.playing)
                    try {
                        await audioService.resume(millis)
                    } catch (error) {
                        console.log({error})
                    }
                    break
                case PlayerStatus.playing:
                    setStatus(PlayerStatus.paused)
                    try {
                        await audioService.pause()
                    } catch (error) {
                        console.log({error})
                    }
                    break
            }
        },
        [ millis, status, props.uri ]
    )

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{time}</Text>
            <TouchableHighlight
                onPress={togglePlayingStatus}
                underlayColor={'#bc4040'}
                style={styles.recording}
            >
                <Text style={styles.action}>
                    {action} audio
                </Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    recording: {
        justifyContent: 'center',
        alignItems: 'center',
        width: DEVICE_WIDTH * 0.4,
        height: 44,
        backgroundColor: '#4c6bdd'
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
