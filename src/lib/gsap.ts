// src/lib/gsap.ts
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register all GSAP plugins to be used in the project
gsap.registerPlugin(SplitText, useGSAP);

// Export the configured gsap instance for use in other files
export { gsap };