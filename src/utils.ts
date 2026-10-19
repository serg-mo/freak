export function formatTime({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  return [
    hours && String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ]
    .filter(Boolean)
    .join(':');
}

export function formatTimeFromSeconds(totalSeconds: number | string): string {
  const value = Number(totalSeconds);
  const hours = Math.floor(value / (60 * 60));
  const minutes = Math.floor((value % (60 * 60)) / 60);
  const seconds = value % 60;

  return formatTime({ hours, minutes, seconds });
}
