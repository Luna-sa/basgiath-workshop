export default function CodeBlock({ code, filename, language = 'markdown' }) {
  return (
    <div className="border border-border bg-black overflow-hidden">
      {/* Header */}
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-surface/80 border-b border-border">
          <span className="font-mono text-[12px] text-qa-teal tracking-wider">{filename}</span>
        </div>
      )}
      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-[13px] text-text-body leading-relaxed whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
      {/* Copy button */}
      <div className="px-4 py-2 border-t border-border flex justify-end">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="font-mono text-[12px] text-text-dim tracking-wider uppercase hover:text-qa-teal transition-colors cursor-pointer"
        >
          Копировать
        </button>
      </div>
    </div>
  )
}
