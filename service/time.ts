interface I_Time {
    milliToMMSS: (millis: number) => string
}

class Time implements  I_Time {
    milliToMMSS = (millis: number) => {
        const totalSeconds = millis / 1000
        const seconds = Math.floor(totalSeconds % 60)
        const minutes = Math.floor(totalSeconds / 60)

        const padWithZero = (n: number) => {
            const string = n.toString()
            if (n < 10) {
                return '0' + string
            }
            return string
        };

        return padWithZero(minutes) + ':' + padWithZero(seconds)
    }
}

export const timeService = new Time()
