const API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/question2"

export const fetchQuestions = (): Promise<any> => fetch(API_URL)
  .then(res => res.json())
  .then(json => json)
  .catch(e => ({ error: e.message }))
