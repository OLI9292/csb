const API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/question2"
const LOG_API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/loggedQuestion2"

import { QuestionLog } from "../Components/Game/Question"

export const fetchQuestions = (): Promise<any> => fetch(API_URL)
  .then(res => res.json())
  .then(json => json)
  .catch(e => ({ error: e.message }))

export const logQuestions = (log: QuestionLog[]): Promise<any> => fetch(LOG_API_URL,
  { body: JSON.stringify(log), method: "POST", headers: { "content-type": "application/json" } })
  .then(res => res.json())
  .then(json => json)
  .catch(e => console.log(e))  
