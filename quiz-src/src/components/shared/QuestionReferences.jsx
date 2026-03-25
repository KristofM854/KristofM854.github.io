import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, BookOpen } from 'lucide-react'
import Badge from './Badge.jsx'

/**
 * Expandable references component for question feedback and results review.
 * Supports both structured array references and plain-text fallback.
 */
function QuestionReferences({ references, sourceShort, jurisdiction }) {
  const [expanded, setExpanded] = useState(false)

  // Normalize: support both structured array and plain string
  const isStructured = Array.isArray(references)
  const hasContent = isStructured ? references.length > 0 : !!references

  if (!hasContent) return null

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-text-tertiary hover:text-text-secondary transition-colors text-xs cursor-pointer group"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>References</span>
        {sourceShort && (
          <span className="text-text-tertiary/70">({sourceShort})</span>
        )}
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-text-tertiary group-hover:text-text-secondary" />
        ) : (
          <ChevronDown className="w-3 h-3 text-text-tertiary group-hover:text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 pl-5 space-y-2 border-l-2 border-white/5">
          {isStructured ? (
            references.map((ref, i) => (
              <div key={i} className="text-xs text-text-tertiary">
                <div className="flex items-start gap-2">
                  <span className="flex-1">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-teal/80 hover:text-accent-teal transition-colors inline-flex items-center gap-1"
                      >
                        {ref.label}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <span>{ref.label}</span>
                    )}
                  </span>
                  {(ref.jurisdiction || jurisdiction) && (
                    <Badge color="cyan" className="text-[10px] px-1.5 py-0">
                      {ref.jurisdiction || jurisdiction}
                    </Badge>
                  )}
                </div>
                {ref.type && (
                  <span className="text-text-tertiary/60 text-[10px] italic">
                    {ref.type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            ))
          ) : (
            // Plain-text fallback
            <p className="text-xs text-text-tertiary italic">{references}</p>
          )}
          {!isStructured && jurisdiction && (
            <Badge color="cyan" className="text-[10px] px-1.5 py-0">
              {jurisdiction}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionReferences
