import { z } from "zod";

// --- Shared mini-shapes ------------------------------------------------------
export const zDataAttrs = z.record(z.string(), z.string()).optional();

export const zAtitleChild = z.object({
  type: z.literal("Atitle"),
  text: z.string(),
  data_attributes: zDataAttrs,
});

export const zHeroElementH2 = z.object({
  tag: z.literal("h2"),
  class: z.string().optional(),
  children: z.array(zAtitleChild),
});

export const zHeroElementH3 = z.object({
  tag: z.literal("h3"),
  class: z.string().optional(),
  content: z.string(),
});

export const zHeroElementH4 = z.object({
  tag: z.literal("h4"),
  class: z.string(),
  text: z.string(),
  data_attributes: zDataAttrs,
});

export const zHeroElementA = z.object({
  tag: z.literal("a"),
  class: z.string(),
  text: z.string(),
  href: z.string(),
  data_attributes: zDataAttrs,
});

export const zHeroElement = z.discriminatedUnion("tag", [
  zHeroElementH2,
  zHeroElementH3,
  zHeroElementH4,
  zHeroElementA,
]);

// --- Sections ----------------------------------------------------------------
export const zSectionHero = z.object({
  type: z.literal("hero"),
  elements: z.array(zHeroElement),
});

export const zHomePrjTitle = z.object({
  tag: z.literal("h2"),
  class: z.string(),
  text: z.string(),
  data_attributes: zDataAttrs,
});

export const zHomeProject = z.object({
  id: z.string(),
  slug: z.string(),
  link_text: z.string(),
  title: z.string(),
  featured_media: z.string(),
});

export const zSectionHomePrjs = z.object({
  type: z.literal("home_prjs"),
  title: zHomePrjTitle,
  project_count_text: z.string(),
  projects: z.array(zHomeProject),
  view_all_button: z.object({
    tag: z.literal("a"),
    class: z.string(),
    text: z.string(),
    href: z.string(),
  }),
});

export const zSectionHomeAbout = z.object({
  type: z.literal("home_about"),
  title_1: z.object({
    tag: z.literal("h2"),
    class: z.string(),
    text: z.string(),
    data_attributes: zDataAttrs,
  }),
  title_2: z.object({
    tag: z.literal("h2"),
    class: z.string(),
    text: z.string(),
    data_attributes: zDataAttrs,
  }),
  description: z.string(),
  link: z.object({
    text: z.string(),
    href: z.string(),
  }),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
});

export const zSectionFooter = z.object({
  type: z.literal("footer"),
  cta: z.object({
    tag: z.literal("a"),
    class: z.string(),
    text: z.string(),
    href: z.string(),
    data_attributes: zDataAttrs,
  }),
  social_links: z.array(
    z.object({
      text: z.string(),
      href: z.string(),
    })
  ),
});

export const zHomeSection = z.discriminatedUnion("type", [
  zSectionHero,
  zSectionHomePrjs,
  zSectionHomeAbout,
  zSectionFooter,
]);

export const zHome = z.object({
  template: z.literal("home"),
  id: z.string(),
  sections: z.array(zHomeSection),
});

// --- Nav ---------------------------------------------------------------------
export const zNav = z.object({
  type: z.literal("nav"),
  elements: z.array(z.any()), // keep permissive for now (we render specific fields)
});

