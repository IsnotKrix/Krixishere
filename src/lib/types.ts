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

export type PostSection = {
  id: string
  heading: string
  body: string
  items?: string[]
}

export type DBPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string | null
  content: PostSection[]
  tags: string[]
  is_featured: boolean
  view_count: number
  published_at: string
  created_at: string
}
