// src/app/projects/page.tsx
import fs from 'node:fs/promises'
import path from 'node:path'
import { compileMDX } from 'next-mdx-remote/rsc'

const CONTENT_DIR = path.join(process.cwd(), 'content/projects')

type Item = {
    slug: string
    title: string
    image?: string
    year?: string
    category?: string
    featured?: boolean
}

export default async function ProjectsIndex() {
    const files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.mdx'))

    const items: Item[] = []
    for (const f of files) {
        const slug = f.replace(/\.mdx$/, '')
        const source = await fs.readFile(path.join(CONTENT_DIR, f), 'utf8')
        const { frontmatter } = await compileMDX({ source, options: { parseFrontmatter: true } })
        const meta = (frontmatter?.meta as any) ?? {}
        items.push({
            slug,
            title: meta.title ?? slug,
            image: meta.image,
            year: meta.year,
            category: meta.category,
            featured: !!meta.featured,
        })
    }

    return (
        <section className="projects_intro cnt">
            <h1 className="cnt_tt">Projects</h1>
            <ul className="Awrite">
                {items.map(p => (
                    <li key={p.slug}>
                        <a className="Awrite ivi" href={`/projects/${p.slug}`}>
                            {p.title} {p.year ? `· ${p.year}` : ''} {p.category ? `· ${p.category}` : ''}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}