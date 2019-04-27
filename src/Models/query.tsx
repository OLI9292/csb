import { extend } from "lodash"
import CONFIG from "../lib/config"

export const callApi = (
  query: string,
  schemas: string[] = [],
  route: string,
  session: any = {},
  parseJson: boolean = false
) => {
  const body = JSON.stringify({ query })
  const headers = extend({}, { "Content-Type": "application/json" }, session)
  const method = "POST"

  return fetch(CONFIG.API_URL, { body, headers, method })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      const { data } = json
      const result: any = { isLoading: false }

      if (json.error || json.errors) {
        const error = json.error || json.errors[0].message
        console.log(route, schemas, `ERR: ${error}`)
        throw new Error(error)
      }

      if (data[route]) {
        console.log(route, schemas.join(", "), data[route])
        return data[route]
      }
    })
    .catch(error => {
      console.log("ERR:", error)
      throw new Error(error.message)
    })
}
