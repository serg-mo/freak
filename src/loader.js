const PAGE_SIZE = 256;
const RECORD_SIZE = 36;
const RECORDS_PER_PAGE = 7;

const decoder = new TextDecoder('ascii');

const INTENSITY = ['Slow', 'Medium', 'Fast', 'Reserved'];
const TIMER_START = ['Immediate', 'At Temperature', 'Prompt', 'Reserved'];
const TIMER_END = ['Continue', 'Stop', 'Keep Warm', 'Repeat'];

async function loadFile(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`loadFile: ${response.status} ${response.statusText}`);
    }

    return new DataView(await response.arrayBuffer());
}

function parseName(view, offset) {
    const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, 30);

    let end = 0;

    while (end < bytes.length) {
        const b = bytes[end];

        if (b === 0x00 || b === 0xff || b < 0x20 || b > 0x7e) {
            break;
        }

        end++;
    }

    return decoder.decode(bytes.subarray(0, end)).trim();
}

function parseFile(view) {
    const recipes = [];

    for (let page = 0; page < view.byteLength; page += PAGE_SIZE) {
        for (let slot = 0; slot < RECORDS_PER_PAGE; slot++) {
            const offset = page + slot * RECORD_SIZE;

            if (offset + RECORD_SIZE > view.byteLength) {
                break;
            }

            const name = parseName(view, offset);

            if (!name) {
                continue;
            }

            const tempLow = view.getUint8(offset + 30);
            const flags = view.getUint8(offset + 31);
            const hours = view.getUint8(offset + 32);
            const minutes = view.getUint8(offset + 33);
            const seconds = view.getUint8(offset + 34);

            recipes.push({
                name,
                temp: tempLow + (flags & 0x80 ? 256 : 0),
                intensity: INTENSITY[(flags >> 2) & 0b11],
                timerStart: TIMER_START[flags & 0b11],
                timerEnd: TIMER_END[(flags >> 5) & 0b11],
                hours,
                minutes,
                seconds,
                totalSeconds: hours * 3600 + minutes * 60 + seconds,
            });
        }
    }

    return recipes;
}

export default async function loadRecipes(url) {
    // NOTE: url must be relative
    return loadFile(url).then(parseFile).then(recipes => recipes.filter((recipe) => recipe.totalSeconds < 20 * 60));
}
