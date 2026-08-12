import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { ReactElement } from 'react'

interface MarkdownTextProps {
  text: string
}

function MarkdownText({ text }: MarkdownTextProps) {
  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          pre: ({ children }) => {
            const element = children as ReactElement<{ className?: string }>
            const className = element?.props?.className ?? ''
            const match = /language-(\w+)/.exec(className)
            const language = match ? match[1] : ''
            return (
              <div className="code-block">
                <span className="code-block-label">
                  {language || 'código'}
                </span>
                <pre className="code-block-pre">{children}</pre>
              </div>
            )
          },
        }}
      >
        {text}
      </Markdown>
    </div>
  )
}

export default MarkdownText
