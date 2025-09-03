// src/app/page.tsx
'use client';

import { Tt } from '@/webgl/Tt/Tt';
import { Loader } from '@/webgl/Loader/Loader';
import { TtF } from '@/webgl/ttf/TtF';
import { Media } from '@/webgl/Media/Media';
import { Bg } from '@/webgl/Bg/Bg';

export default function Home() {
  return (
    <div className="home-page">
      {/* Background Layer */}
      <Bg className="page-background" />
      
      {/* Loader Section */}
      <section className="loader-section">
        <Loader 
          onComplete={() => console.log('Loader complete')}
        />
      </section>
      
      {/* Hero Section */}
      <section className="hero">
        <Tt 
          text="Interactive Title" 
          className="main-title"
          onReady={() => console.log('Tt component ready')}
        />
      </section>
      
      {/* Media Section */}
      <section className="media-section">
        <Media 
          src="/media/example.jpg"
          className="hero-media"
          onReady={() => console.log('Media ready')}
        />
      </section>
      
      {/* Footer Section */}
      <section className="footer-section">
        <TtF 
          text="Footer Text" 
          className="page-footer"
          onReady={() => console.log('Footer ready')}
        />
      </section>
    </div>
  );
}