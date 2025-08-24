// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Map markdown to your class contract
        h1: (props) => <h1 className="cnt_tt" {...props} />,
        h2: (props) => <h2 className="tt3" {...props} />,
        h3: (props) => <h3 className="tt3" {...props} />,

        p:  (props) => <p className="Awrite" {...props} />,
        ul: (props) => <ul className="Awrite" {...props} />,
        ol: (props) => <ol className="Awrite" {...props} />,
        li: (props) => <li className="Awrite" {...props} />,
        a:  (props) => <a className="Awrite ivi" {...props} />,

        // allow local overrides
        ...components,
    }
}