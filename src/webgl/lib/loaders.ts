export async function loadMSDF(): Promise<any> {
  const response = await fetch('/fonts/PPNeueMontreal-Medium.json');
  return response.json();
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function loadVideo(url: string): Promise<HTMLVideoElement> {
