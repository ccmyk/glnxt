// Minimal shim so TypeScript doesn't complain if you import/register SplitText
declare module "gsap/SplitText" {
  const SplitText: any;
  export default SplitText;
}
declare module "gsap-trial/SplitText" {
  const SplitText: any;
  export default SplitText;
}
declare namespace gsap {
  const SplitText: any;
}
