'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useMesh, useProgram, useGeometry, useTexture, useFrame } from 'react-ogl';
import { useGLStore } from '@/webgl/gl.store';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { lerpArr, calcChars, lerp } from '@/types/splitText.d';

import vertexShader from './Tt.vertex.msdf.glsl';
import fragmentShader from './Tt.fragment.msdf.glsl';

// We'll pass these as props now, instead of reading from `el.dataset`
interface TtProps {
    el: HTMLElement;
    text: string;
    size: number;
    letterSpacing: number;
    white?: boolean;
}

export const Tt: React.FC<TtProps> = ({ el, text, size, letterSpacing, white }) => {
    const { gl } = useGLStore();

    // Use refs for imperative OGL objects and GSAP timelines
    const meshRef = useRef<any>(null);
    const programRef = useRef<any>(null);
    const animInRef = useRef<gsap.core.Timeline>();
    const animOutRef = useRef<gsap.core.Timeline>();

    // Use state for declarative uniform values
    const [key, setKey] = useState<number>(-2);
    const [power, setPower] = useState<number>(1);
    const [start, setStart] = useState<number>(1);
    const [mousePos, setMousePos] = useState<number>(0);
    const [mousePower, setMousePower] = useState<number>(1);
    const [powers, setPowers] = useState<number[]>([]);
    const [isReady, setIsReady] = useState(false);

    const mouseEndRef = useRef<number>(0);
    const lastXRef = useRef<number>(0);
    const activeRef = useRef<number>(-1);
    const stoptRef = useRef<number>(0);

    // Intersection Observer hook to handle start/stop logic
    const [targetRef, isIntersecting] = useIntersectionObserver({ threshold: [0] });

    // Use `useEffect` to manage component side effects and GSAP timelines
    useEffect(() => {
        let splitText: SplitText | undefined;
        if (el) {
            splitText = new SplitText(el.querySelector('.Oiel') as HTMLElement, {
                types: 'chars,words',
            });
            setIsReady(true);
        }

        // Initialize GSAP timelines
        animInRef.current = gsap.timeline({ paused: true }).to(programRef.current.uniforms.uPower, {
            value: 1,
            duration: 0.36,
            ease: 'power4.inOut',
        }, 0);

        animOutRef.current = gsap.timeline({ paused: true }).to(programRef.current.uniforms.uPower, {
            value: 0,
            duration: 0.6,
            ease: 'none',
            onComplete: () => {
                setKey(-1);
            },
        }, 0);

        // Clean up SplitText on component unmount
        return () => {
            splitText?.revert();
            animInRef.current?.kill();
            animOutRef.current?.kill();
        };
    }, [el]);

    // Handle visibility based on Intersection Observer
    useEffect(() => {
        if (!programRef.current) return;
        if (isIntersecting) {
            if (activeRef.current === -1) {
                gsap.timeline()
                    .fromTo(programRef.current.uniforms.uStart, { value: 1 }, {
                        value: 0,
                        duration: 0.8,
                        ease: 'power4.inOut',
                    }, 0)
                    .fromTo(programRef.current.uniforms.uPower, { value: 0.5 }, {
                        value: 0,
                        duration: 2,
                        ease: 'power2.inOut',
                    }, 0)
                    .set(programRef.current.uniforms.uKey, {
                        value: -1,
                        onComplete: () => {
                            el.querySelector('.Oiel')?.classList.add('act');
                            stoptRef.current = 1;
                            setKey(-1);
                        },
                    }, '>');
            }
            activeRef.current = 1;
        } else {
            if (activeRef.current < 1) return;
            activeRef.current = 0;
        }
    }, [isIntersecting, el]);

    // Use useMemo to prevent re-creating geometry unless text or sizes change
    const textChars = el?.querySelector('.Oiel')?.querySelectorAll('.char');
    const geometry = useMemo(() => {
        if (!gl || !isReady || !textChars) return null;

        // GSAP SplitText is a prerequisite for this logic
        const chars = new SplitText(el.querySelector('.Oiel') as HTMLElement, { types: 'chars' }).chars;

        const charWidths: number[] = [];
        const charPositions: number[] = [];
        let totalWidth = 0;

        chars.forEach((char) => {
            charWidths.push(char.clientWidth);
            charPositions.push(totalWidth);
            totalWidth += char.clientWidth;
        });

        const ogText = new Text({
            gl,
            font: '', // This font data should be provided via a prop or context
            text: text,
            align: 'center',
            letterSpacing: letterSpacing,
            size: size,
            lineHeight: 1,
        });

        return new Geometry(gl, {
            position: { size: 3, data: ogText.buffers.position },
            uv: { size: 2, data: ogText.buffers.uv },
            id: { size: 1, data: ogText.buffers.id },
            index: { data: ogText.buffers.index },
        });
    }, [gl, isReady, textChars, text, letterSpacing, size]);

    // Use react-ogl hooks to create and manage the WebGL mesh
    const program = useProgram(gl, {
        vertex: vertexShader,
        fragment: fragmentShader.replaceAll('PITO', text.length.toString()),
        uniforms: {
            uTime: { value: 0 },
            uKey: { value: key },
            uPower: { value: power },
            uPowers: { value: powers },
            uCols: { value: 1.5 },
            uStart: { value: start },
            uColor: { value: white ? 1 : 0 },
            tMap: { value: useTexture(gl, {
                    src: '/public/PPNeueMontreal-Medium.png', // Assuming this is served from the public directory
                    generateMipmaps: false,
                })},
            uMouse: { value: [0, 0] },
            uWidth: { value: [] },
            uHeight: { value: [] },
        },
        transparent: true,
        cullFace: null,
        depthWrite: false,
    });

    const mesh = useMesh(gl, { geometry, program });

    useEffect(() => {
        if (mesh) {
            meshRef.current = mesh;
            programRef.current = program;
        }
    }, [mesh, program]);

    // Use useFrame for the animation loop, replacing the `update` method
    useFrame(({ time }) => {
        if (!meshRef.current || activeRef.current !== 1) return;

        // Imperative GSAP logic is handled by a declarative `useRef`
        mouseEndRef.current = lerp(mouseEndRef.current, mousePos, 0.06);

        // Update uniforms declaratively via state or useRef values
        programRef.current.uniforms.uMouse.value = [mouseEndRef.current, 0];
        programRef.current.uniforms.uTime.value = time;

        setPowers((prevPowers) => lerpArr(prevPowers, mousePowers, 0.03));
    });

    const mouseMoveHandler = (e: React.MouseEvent | React.TouchEvent) => {
        stoptRef.current = 0;
        animInRef.current?.play();
        animOutRef.current?.pause();

        const isTouch = 'touches' in e;
        const lX = isTouch ? (e.touches[0]?.pageX - el.getBoundingClientRect().left) : e.nativeEvent.offsetX;

        setPowers(calcChars(el, lX));
        setMousePos(lX);
    };

    const mouseLeaveHandler = (e: React.MouseEvent | React.TouchEvent) => {
        const isTouch = 'touches' in e;
        const lX = isTouch ? (e.touches[0]?.pageX - el.getBoundingClientRect().left) : e.nativeEvent.offsetX;

        setPowers(calcChars(el, lX, lX < 60 ? 0.5 : -0.5));
        animInRef.current?.pause();

    };

    // Attach event listeners to the component's DOM element
    useEffect(() => {
        const ttEl = el.querySelector('.Oiel') as HTMLElement;
        if (!ttEl) return;

        ttEl.addEventListener('mouseenter', mouseMoveHandler);
        ttEl.addEventListener('mousemove', mouseMoveHandler);
        ttEl.addEventListener('mouseleave', mouseLeaveHandler);

        return () => {
            ttEl.removeEventListener('mouseenter', mouseMoveHandler);
            ttEl.removeEventListener('mousemove', mouseMoveHandler);
            ttEl.removeEventListener('mouseleave', mouseLeaveHandler);
        };
    }, [el]);

    return (
        <div ref={targetRef as React.Ref<HTMLDivElement>} className="gl-container">
            {/* The canvas is rendered by the provider, we just need to provide a DOM node to observe */}
            {/* The actual canvas element is rendered in a higher-level provider. This component
          handles the logic and passes data to the OGL context. */}
        </div>
    );
};