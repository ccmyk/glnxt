// src/components/ui/SplitTextNode.tsx
'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { buildTimeline } from '@/lib/gsap/buildTimeline'
import { on as bus } from '@/lib/events'
import { EASE_TEXT } from '@/lib/gsap/easing'

type TypesOption = 'chars' | 'words' | 'lines' | 'chars,words' | 'words,lines' | 'chars,words,lines'
type AsTag = keyof JSX.IntrinsicElements
type TimelineKey = Parameters<typeof buildTimeline>[0]['key']

type Props = {
    as?: AsTag
    className?: string
    /** Provide text, or pass children (string/inline elements). */
    text?: string
    children?: React.ReactNode
    /** Split strategy; default 'chars'. */
    types?: TypesOption
    /** When to animate. */
    animateOn?: 'event' | 'mount' | 'none'
    /** If set, only respond to anim:* events with matching detail.id */
    animId?: string
    /** Manifest key to use for "enter" animation. Default: 'text.charIn' when chars present, 'text.lineIn' when lines. */
    timelineInKey?: TimelineKey
    /** Optional manifest key for "leave" animation. Default: 'text.charOut'. */
    timelineOutKey?: TimelineKey
    /** Called after split with element lists. */
    onSplit?: (parts: { root: HTMLElement; chars: HTMLElement[]; words: HTMLElement[]; lines: HTMLElement[] }) => void
}

/**
 * SplitTextNode:
 * - Replaces SplitType usage with GSAP-friendly DOM:
 *   .char > .f (fake) + .n (real), plus .word, .line wrappers.
 * - Responds to anim:enter / anim:leave events or animates on mount.
 * - Falls back to DIY splitter; if user adds GSAP SplitText plugin, this component can be adapted,
 *   but no plugin is required here (no globals).
 */
export function SplitTextNode({
                                  as: Tag = 'span',
                                  className,
                                  text,
                                  children,
                                  types = 'chars',
                                  animateOn = 'event',
                                  animId,
                                  timelineInKey,
                                  timelineOutKey,
                                  onSplit,
                              }: Props) {
    const hostRef = useRef<HTMLElement | null>(null)
    const originalHTML = useRef<string | null>(null)
    const tlIn = useRef<gsap.core.Timeline | null>(null)
    const tlOut = useRef<gsap.core.Timeline | null>(null)

    // SSR-safe: only compute rawText on client
    const rawText = useMemo(() => {
        if (typeof text === 'string') return text
        if (typeof children === 'string') return children
        return undefined
    }, [text, children])

    // ---- DIY splitter (chars/words + lines grouping) ----
    function clearNode(el: HTMLElement) {
        while (el.firstChild) el.removeChild(el.firstChild)
    }

    function createSpan(className: string, content?: string) {
        const s = document.createElement('span')
        s.className = className
        if (content != null) s.textContent = content
        return s
    }

    function splitChars(text: string) {
        // Preserves spaces as &nbsp; within .n but leaves .f visible (to enable the write/reveal handoff)
        const wrap = document.createDocumentFragment()
        const chars: HTMLElement[] = []
        for (const ch of Array.from(text)) {
            const charEl = createSpan('char')
            const f = createSpan('f', ch === ' ' ? ' ' : ch)
            const n = createSpan('n', ch === ' ' ? '\u00A0' : ch)
            charEl.appendChild(f)
            charEl.appendChild(n)
            wrap.appendChild(charEl)
            chars.push(charEl)
        }
        return { fragment: wrap, chars }
    }

    function splitWords(text: string) {
        const wrap = document.createDocumentFragment()
        const words: HTMLElement[] = []
        const parts = text.split(/(\s+)/)
        for (const part of parts) {
            if (/\s+/.test(part)) {
                wrap.appendChild(document.createTextNode(part))
            } else if (part.length) {
                const w = createSpan('word', part)
                wrap.appendChild(w)
                words.push(w)
            }
        }
        return { fragment: wrap, words }
    }

    function groupLines(container: HTMLElement) {
        // naive line grouping: wrap each word in a temp inline-block, then group by top offset
        const words = Array.from(container.querySelectorAll('.word')) as HTMLElement[]
        if (!words.length) return [] as HTMLElement[]
        const lineGroups: HTMLElement[][] = []
        let currentTop = -1
        let current: HTMLElement[] = []
        words.forEach((w) => {
            const top = Math.round(w.getBoundingClientRect().top)
            if (currentTop === -1) {
                currentTop = top
                current = [w]
            } else if (top === currentTop) {
                current.push(w)
            } else {
                lineGroups.push(current)
                currentTop = top
                current = [w]
            }
        })
        if (current.length) lineGroups.push(current)

        // Wrap groups
        const lines: HTMLElement[] = []
        lineGroups.forEach((group) => {
            const line = createSpan('line')
            // insert before first word
            const first = group[0]
            first.parentElement?.insertBefore(line, first)
            group.forEach((w) => line.appendChild(w))
            lines.push(line)
        })
        return lines
    }

    function performSplit(el: HTMLElement) {
        const needChars = types.includes('chars')
        const needWords = types.includes('words')
        const needLines = types.includes('lines')

        const baseText = rawText ?? el.textContent ?? ''
        originalHTML.current = el.innerHTML
        clearNode(el)

        let chars: HTMLElement[] = []
        let words: HTMLElement[] = []
        let lines: HTMLElement[] = []

        if (needChars && !needWords && !needLines) {
            const { fragment, chars: C } = splitChars(baseText)
            el.appendChild(fragment)
            chars = C
        } else if (needWords && !needChars) {
            const { fragment, words: W } = splitWords(baseText)
            el.appendChild(fragment)
            words = W
            if (needLines) {
                // need layout pass first
                lines = groupLines(el)
            }
        } else {
            // chars,words (and maybe lines)
            // first split into words to preserve spacing, then replace each word's text with char structure
            const { fragment, words: W } = splitWords(baseText)
            el.appendChild(fragment)
            words = W
            W.forEach((w) => {
                const txt = w.textContent || ''
                w.textContent = ''
                const { fragment: frag, chars: CW } = splitChars(txt)
                w.appendChild(frag)
                // NOTE: chars are nested under words; select via .word .char
            })
            if (needLines) {
                lines = groupLines(el)
            }
            chars = Array.from(el.querySelectorAll('.char')) as HTMLElement[]
        }

        // initial state for text reveal parity (chars .n offscreen)
        gsap.set(el.querySelectorAll('.char .n'), { yPercent: 100, opacity: 0 })
        gsap.set(el.querySelectorAll('.char .f'), { opacity: 1 })
        onSplit?.({ root: el, chars, words, lines })
    }

    function revertSplit(el: HTMLElement) {
        if (originalHTML.current != null) {
            el.innerHTML = originalHTML.current
        }
    }

    // ---- mount / unmount ----
    useLayoutEffect(() => {
        const el = hostRef.current!
        if (!el) return

        performSplit(el)

        // Build timelines lazily when needed
        const chooseInKey: TimelineKey =
            timelineInKey ??
            ((types.includes('lines') && 'text.lineIn') ||
                (types.includes('words') && !types.includes('chars') && 'text.wordIn') ||
                'text.charIn')

        const chooseOutKey: TimelineKey = timelineOutKey ?? 'text.charOut'

        tlIn.current = buildTimeline({ root: el, key: chooseInKey, paused: true })
        tlOut.current = buildTimeline({ root: el, key: chooseOutKey, paused: true })

        if (animateOn === 'mount') {
            tlIn.current?.restart()
        }

        const offEnter =
            animateOn === 'event'
                ? bus.animEnter((e) => {
                    const { el: target, id } = e.detail
                    if (animId ? id === animId : target?.contains(el)) {
                        tlOut.current?.pause(0)
                        tlIn.current?.restart()
                    }
                })
                : null

        const offLeave =
            animateOn === 'event'
                ? bus.animLeave((e) => {
                    const { el: target, id } = e.detail
                    if (animId ? id === animId : target?.contains(el)) {
                        tlIn.current?.pause(0)
                        tlOut.current?.restart()
                    }
                })
                : null

        return () => {
            offEnter && offEnter()
            offLeave && offLeave()
            tlIn.current?.kill()
            tlOut.current?.kill()
            tlIn.current = null
            tlOut.current = null
            revertSplit(el)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // one-time (content changes → remount)

    // Host tag
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return useMemo(
        () => <Tag ref={hostRef as any} className={className}>{rawText ?? children ?? null}</Tag>,
        // render raw content once; the splitter will rewrite DOM inside on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [Tag, className, mounted]
    )
}