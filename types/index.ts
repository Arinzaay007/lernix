export interface Course {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  outline_json: LessonOutline[]
  created_at: string
  updated_at: string
}

export interface LessonOutline {
  order_index: number
  title: string
  description: string
}

export interface Lesson {
  id: string
  course_id: string
  order_index: number
  title: string
  content_md: string
  is_generated: boolean
  created_at: string
}

export interface ChatMessage {
  id: string
  course_id: string | null
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface UIMessage {
  role: 'user' | 'assistant'
  content: string
}
