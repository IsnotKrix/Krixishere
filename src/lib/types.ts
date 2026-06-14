export type ContentSection = { heading: string; items: string[] }

export type DBRelease = {
  id: string
  version: string
  title: string
  date: string
  image: string
  excerpt: string
  content: ContentSection[]
  contributors: string[]
  tags: string[]
  author_note: string | null
  created_at: string
}
