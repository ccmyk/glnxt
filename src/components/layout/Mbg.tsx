// src/components/layout/Mbg.tsx
'use client'
import React from 'react'

/**
 * Matches CSS expectations for .Mbg rails & dev alignment checks.
 * Keeps a simple DOM that CSS positions and animates.
 */
export function Mbg() {
    return (
        <div className="Mbg" aria-hidden>
            {/* Rails scaffolding; exact DOM depth isn’t mandated by CSS, class is */}
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
            <div className="Mbg_r" />
        </div>
    )
}