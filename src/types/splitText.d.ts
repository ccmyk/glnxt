import { SplitText } from 'gsap/SplitText';

export function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}

export function lerpArr(value1: number[], value2: number[], t: number): number[] {
    if (typeof value1 === 'number' && typeof value2 === 'number') {
        return [lerp(value1, value2, t)];
    } else {
        const len = Math.min(value1.length, value2.length);
        const out: number[] = new Array(len);
        for (let i = 0; i < len; i++) {
            out[i] = lerp(value1[i], value2[i], t);
        }
        return out;
    }
}

export function calcChars(el: HTMLElement, x: number, out?: number): number[] {
    const chars = new SplitText(el.querySelector('.Oiel') as HTMLElement, { types: 'chars' }).chars;
    const charWidths: number[] = [];
    const charPositions: number[] = [];
    let totalWidth = 0;

    for(const char of chars) {
        charWidths.push(char.clientWidth);
        charPositions.push(totalWidth);
        totalWidth += char.clientWidth;
    }

    const arr: number[] = [];
    if (out !== undefined) {
        for (let i = 0; i < chars.length; i++) {
            arr.push(out);
        }
    } else {
        for (let i = 0; i < chars.length; i++) {
            let tot = x - charPositions[i];
            tot = tot / charWidths[i];
            tot -= 0.5;
            tot = Math.min(Math.max(tot, -0.5), 0.5);
            arr.push(tot);
        }
    }
    return arr;
}