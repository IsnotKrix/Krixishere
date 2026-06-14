import type { ContentSection } from "@/lib/types"

export function ContentRenderer({ sections }: { sections: ContentSection[] }) {
  if (!sections?.length) return null
  return (
    <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
      {sections.map((section, i) => (
        <div key={i}>
          <h3 className="text-white font-semibold text-base mb-1.5">
            {section.heading}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            {section.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
