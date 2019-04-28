import { callApi } from "./query"

export interface Source {
  value: string
  id: string
}

export interface Sources {
  word?: Source
  passage?: Source
}

export interface PromptPart {
  value?: string
  highlight?: boolean
  hide?: boolean
  hint?: string
}

export interface AnswerPart {
  value?: string
  prefill?: boolean
  hint?: string
}

export interface InteractivePart {
  correct?: boolean
  value: string
  decoration?: string
  hint?: string
}

export interface Question {
  _id: string
  TYPE: string
  type: string
  multipart: boolean
  part?: number
  prompt: PromptPart[]
  secondaryPrompt?: PromptPart[]
  answer: AnswerPart[]
  redHerrings: AnswerPart[]
  interactive?: InteractivePart[]
  sources: Sources
  answerCount: number
  experience?: number
  formatAsCode: boolean
  images: string[]
}

export const fetchQuestions = (id: string): Promise<any[]> =>
  callApi(`query { questionsForSequence(id: "${id}") }`, ["questions"], "questionsForSequence", null, true)
