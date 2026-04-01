import { useState, useMemo } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import { allQuestions, categories } from '../../data/index.js'
import Card from '../shared/Card.jsx'
import Badge from '../shared/Badge.jsx'

/**
 * Dedicated references page showing all quiz-linked sources.
 * Deduplicates references globally, grouped by category.
 */
function ReferencesPage() {
  const [filterCategory, setFilterCategory] = useState('all')

  // Extract and deduplicate all references
  const allRefs = useMemo(() => {
    const refMap = new Map()

    allQuestions.forEach((q) => {
      const refs = Array.isArray(q.references) ? q.references : (q.references ? [{ label: q.references }] : [])
      refs.forEach((ref) => {
        const key = ref.label || ref
        if (!refMap.has(key)) {
          refMap.set(key, {
            label: ref.label || ref,
            url: ref.url || null,
            type: ref.type || null,
            jurisdiction: ref.jurisdiction || q.jurisdiction || null,
            categories: new Set(),
            questionCount: 0,
          })
        }
        const entry = refMap.get(key)
        entry.categories.add(q.category)
        entry.questionCount++
      })

      // Also capture sourceShort as a separate reference if present and different
      if (q.sourceShort && q.sourceShort.trim()) {
        const alreadyCovered = refs.some((r) => (r.label || r).includes(q.sourceShort))
        if (!alreadyCovered) {
          if (refMap.has(q.sourceShort)) {
            // Update existing entry — accumulate categories and count
            const existing = refMap.get(q.sourceShort)
            existing.categories.add(q.category)
            existing.questionCount++
          } else {
            refMap.set(q.sourceShort, {
              label: q.sourceShort,
              url: null,
              type: null,
              jurisdiction: q.jurisdiction || null,
              categories: new Set([q.category]),
              questionCount: 1,
            })
          }
        }
      }
    })

    // Convert sets to arrays and sort
    return [...refMap.values()]
      .map((r) => ({ ...r, categories: [...r.categories] }))
      .filter((r) => r.label && r.label.trim())
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [])

  // Filter by category
  const filteredRefs = filterCategory === 'all'
    ? allRefs
    : allRefs.filter((r) => r.categories.includes(filterCategory))

  const activeCategories = categories.filter((c) =>
    allQuestions.some((q) => q.category === c.id)
  )

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <BookOpen className="w-10 h-10 text-accent-teal mx-auto mb-3" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Scientific References
          </h1>
          <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            This quiz draws on peer-reviewed literature, regulatory documents, and authoritative scientific sources. The references below support the questions and explanations throughout the quiz.
          </p>
        </div>

        {/* Category filter */}
        <Card>
          <h2 className="font-display font-semibold text-sm text-text-primary mb-3">
            Filter by category
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-accent-teal text-ocean-950'
                  : 'bg-ocean-700 text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({allRefs.length})
            </button>
            {activeCategories.map((cat) => {
              const count = allRefs.filter((r) => r.categories.includes(cat.id)).length
              if (count === 0) return null
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-accent-teal text-ocean-950'
                      : 'bg-ocean-700 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              )
            })}
          </div>
        </Card>

        {/* Reference list */}
        <div className="space-y-3">
          {filteredRefs.length === 0 ? (
            <Card className="text-center">
              <p className="text-text-tertiary text-sm">No references found for this filter.</p>
            </Card>
          ) : (
            filteredRefs.map((ref, i) => (
              <Card key={i} className="py-4 px-5 sm:py-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-teal hover:text-accent-teal/80 transition-colors inline-flex items-start gap-1.5"
                      >
                        <span>{ref.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      </a>
                    ) : (
                      <p className="text-sm text-text-primary">{ref.label}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {ref.type && (
                        <span className="text-text-tertiary text-[10px] italic">
                          {ref.type.replace(/_/g, ' ')}
                        </span>
                      )}
                      {ref.jurisdiction && (
                        <Badge color="cyan" className="text-[10px] px-1.5 py-0">
                          {ref.jurisdiction}
                        </Badge>
                      )}
                      <span className="text-text-tertiary text-[10px] font-mono">
                        {ref.questionCount} question{ref.questionCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ReferencesPage
