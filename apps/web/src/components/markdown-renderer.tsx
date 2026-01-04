"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
        h1: ({ children }) => (
          <h2 className="text-2xl font-bold text-foreground mt-6 mb-4">{children}</h2>
        ),
        h2: ({ children }) => (
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
        ),
        h3: ({ children }) => (
          <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-foreground leading-7 mb-4">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground leading-7">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent/40 pl-4 italic text-foreground-muted my-4">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-background/60 px-1.5 py-0.5 rounded text-sm font-mono text-accent">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-background/60 p-4 rounded-lg overflow-x-auto my-4 text-sm">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-accent hover:text-accent/80 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="border-border my-6" />,
      }}
    >
      {content}
      </ReactMarkdown>
    </div>
  )
}
