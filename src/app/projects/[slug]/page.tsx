// src/app/projects/[slug]/page.tsx
import fs from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/../mdx-components' // root import

const CONTENT_DIR = path.join(process.cwd(), 'content/projects')

export async function generateStaticParams() {
    const files = await fs.readdir(CONTENT_DIR)
    return files
        .filter(f => f.endsWith('.mdx'))
        .map(f => ({ slug: f.replace(/\.mdx$/, '') }))
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const filePath = path.join(CONTENT_DIR, `${params.slug}.mdx`)
    let source: string
    try {
        source = await fs.readFile(filePath, 'utf8')
    } catch {
        notFound()
    }

    const { content, frontmatter } = await compileMDX({
        source,
        options: { parseFrontmatter: true },
        components: useMDXComponents({}) // apply the class mapping
    })

    const title = (frontmatter?.meta as any)?.title ?? params.slug
    const image = (frontmatter?.meta as any)?.image as string | undefined

    return (
        <section className="project_intro cnt">
            <h1 className="cnt_tt">{title}</h1>

            {image && (
                <figure className="project_hero">
                    <img src={image} alt={title} />
                </figure>
            )}

            {/* MDX content – gets .Awrite/.tt3/etc via mdx-components.tsx */}
            <article className="Awrite">{content}</article>
        </section>
    )
}