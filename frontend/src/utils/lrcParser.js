
/**
 * Parses an LRC string into an array of lyric objects.
 * Format expected: [mm:ss.xx]Lyric text
 * 
 * @param {string} lrcString - The raw content of the .lrc file
 * @returns {Array<{time: number, text: string}>} - Sorted array of lyric objects
 */
export function parseLRC(lrcString) {
    if (!lrcString) return [];

    const lines = lrcString.split('\n');
    const lyrics = [];

    // Regex to match timestamp [mm:ss.xx] or [mm:ss:xx]
    const timeRegex = /\[(\d{2}):(\d{2})[.:](\d{2,3})\]/;

    lines.forEach(line => {
        const match = timeRegex.exec(line);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);

            // Calculate total time in seconds
            // If milliseconds is 2 digits, it's usually hundredths (10ms)
            // If 3 digits, it's thousandths (1ms)
            const msMultiplier = match[3].length === 2 ? 0.01 : 0.001;
            const time = minutes * 60 + seconds + (milliseconds * (match[3].length === 2 ? 10 : 1)) / 1000;

            const text = line.replace(timeRegex, '').trim();

            if (text) {
                lyrics.push({
                    time,
                    text
                });
            }
        }
    });

    // Sort by time to ensure order
    lyrics.sort((a, b) => a.time - b.time);

    // Calculate duration for each line
    for (let i = 0; i < lyrics.length; i++) {
        if (i < lyrics.length - 1) {
            lyrics[i].duration = lyrics[i + 1].time - lyrics[i].time;
        } else {
            lyrics[i].duration = 999; // Last line lasts "forever" or until song end
        }
    }

    return lyrics;
}
