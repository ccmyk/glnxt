import React from "react";
import { getHome, getNav } from "@/lib/content";
import NavBar from "@/components/Nav";
import { SplitText } from "@/components/SplitText";

// NOTE:
// - This file renders your *real* home content from /content/pages/home.json
// - OGL components (Tt, Media, Bg, TtF, Loader) can be dropped into the slots below.
// - We keep A* classnames where they matter for CSS parity; elsewhere we keep markup lean.

function AtitleSpan({
  text,
  data,
}: {
  text: string;
  data?: Record<string, string>;
}) {
  // Placeholder wrapper that preserves class hooks; swap with <Tt .../> when the Tt OGL block lands.
  // We emit data-* attributes so your CSS/JS hooks can still read them if needed.
  return (
    <span
      className="Atitle"
      {...Object.fromEntries(
        Object.entries(data || {}).map(([k, v]) => [`data-${k}`, v])
      )}
    >
      {text}
    </span>
  );
}

function HeroSection({ section }: { section: any }) {
  return (
    <section className="home_hero">
      {section.elements.map((el: any, i: number) => {
        if (el.tag === "h2") {
          return (
            <h2 key={i} className={el.class || ""}>
              {el.children.map((child: any, j: number) => (
                <AtitleSpan
                  key={j}
                  text={child.text}
                  data={child.data_attributes}
                />
              ))}
            </h2>
          );
        }
        if (el.tag === "h3") {
          return (
            <h3
              key={i}
              className={el.class || ""}
              dangerouslySetInnerHTML={{ __html: el.content }}
            />
          );
        }
        if (el.tag === "h4") {
          return (
            <h4 key={i} className={el.class}>
              {el.text}
            </h4>
          );
        }
        if (el.tag === "a") {
          return (
            <a
              key={i}
              className={el.class}
              href={el.href}
              {...Object.fromEntries(
                Object.entries(el.data_attributes || {}).map(([k, v]) => [
                  `data-${k}`,
                  v,
                ])
              )}
            >
              {el.text}
            </a>
          );
        }
        return null;
      })}
    </section>
  );
}

function FeaturedSection({ section }: { section: any }) {
  return (
    <section className="home_prjs">
      <header className="home_prjs_header">
        <h2
          className={section.title.class}
          {...Object.fromEntries(
            Object.entries(section.title.data_attributes || {}).map(
              ([k, v]) => [`data-${k}`, v]
            )
          )}
        >
          {section.title.text}
        </h2>
        <span className="home_prjs_count">{section.project_count_text}</span>
      </header>

      <div className="home_prjs_grid">
        {section.projects.map((p: any) => (
          <a key={p.id} href={`/projects/${p.slug}`} className="home_prj">
            <div className="home_prj_media">
              {/* Swap this <video> for <Media src={p.featured_media}/> when Media OGL is finalized */}
              <video
                src={p.featured_media}
                muted
                loop
                playsInline
                aria-label={p.title}
              />
            </div>
            <div className="home_prj_meta">
              <h3 className="home_prj_title">{p.title}</h3>
              <span className="home_prj_link">{p.link_text}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="home_prjs_footer">
        <a className={section.view_all_button.class} href={section.view_all_button.href}>
          {section.view_all_button.text}
        </a>
      </div>
    </section>
  );
}

function AboutSection({ section }: { section: any }) {
  return (
    <section className="home_about">
      <div className="home_about_tt">
        <h2
          className={section.title_1.class}
          {...Object.fromEntries(
            Object.entries(section.title_1.data_attributes || {}).map(
              ([k, v]) => [`data-${k}`, v]
            )
          )}
        >
          {section.title_1.text}
        </h2>
        <h2
          className={section.title_2.class}
          {...Object.fromEntries(
            Object.entries(section.title_2.data_attributes || {}).map(
              ([k, v]) => [`data-${k}`, v]
            )
          )}
        >
          {section.title_2.text}
        </h2>
      </div>
      <p className="home_about_desc">{section.description}</p>
      <a href={section.link.href} className="home_about_link">
        {section.link.text}
      </a>
      <img src={section.image.src} alt={section.image.alt} className="home_about_img" />
    </section>
  );
}

function FooterSection({ section }: { section: any }) {
  return (
    <footer className="home_footer">
      <a className={section.cta.class} href={section.cta.href}>
        {section.cta.text}
      </a>
