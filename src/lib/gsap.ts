// Optional gsap init if you want a single import point elsewhere.
// You can register custom effects or global defaults here.
import { gsap } from "gsap";
export { gsap };

// NOTE: We do NOT import SplitText here because it's a Club GreenSock plugin.
// If you include it in your project, register it in your app bootstrap like:
// import { gsap } from "gsap";
// import SplitText from "gsap/SplitText"; // depending on your setup
// gsap.registerPlugin(SplitText);
