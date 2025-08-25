// src/lib/gl/loadMsdf.ts
export async function loadMsdf(base: string) {
    // base example: '/fonts/msdf/PPNeueMontreal-Medium/PPNeueMontreal-Medium'
    const [image, metrics] = await Promise.all([
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = `${base}.png`;
        }),
        fetch(`${base}.json`).then((res) => res.json()),
    ]);
    return { image, metrics };
}