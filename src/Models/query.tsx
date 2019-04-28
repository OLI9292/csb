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
      const { data, error, errors } = json

      if (error || errors) {
        const err = error || errors[0].message
        console.log(route, schemas, `ERR: ${err}`)
        throw new Error(err)
      }

      if (data[route]) {
        // console.log(route, schemas.join(", "), data[route])
        if (parseJson) return JSON.parse(data[route])
        return data[route]
      }
    })
    .catch(error => {
      console.log("ERR:", error)
      throw new Error(error.message)
    })
}
