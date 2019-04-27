import { callApi } from "./query"

const attrs = `
  id
  name
  progressBars
  imgSrc
`

export interface Sequence {
  id: string
  name: string
  progressBars: number
  imgSrc?: string
}

export const fetchSequences = (curriculumId: string): Promise<Sequence[]> =>
  callApi(`query { sequences(curriculumId: "${curriculumId}") { ${attrs} } }`, ["sequences"], "sequences")
