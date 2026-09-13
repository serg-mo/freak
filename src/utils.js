export function formatTime({ hours, minutes, seconds }) {
    return [
        hours && String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0'),
    ]
        .filter(Boolean)
        .join(':');
}

export function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return formatTime({ hours, minutes, seconds });
}
