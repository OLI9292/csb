const API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/auth/user"
const CREATE_API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/user"
const LOGIN_API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/login"

export function fetchUser(email: string) {
  const query = "?email=" + email
  const url = API_URL + query

  console.log(url)
  
  return fetch(url)
    .then(res => res.json())
    .then(json => json)
    .catch(e => console.log(e))
}

export function loginUser(email: string, password: string) {
  const url = LOGIN_API_URL
  const body = JSON.stringify({ email: email, password: password })
  
  return fetch(LOGIN_API_URL, {
    body: body,
    method: "POST",
    headers: { "content-type": "application/json" }
  })
  .then(res => res.json())
  .then(json => json)
  .catch(e => console.log(e))
}

export function createUser(email: string, password: string, username: string) {
  const url = CREATE_API_URL
  const body = JSON.stringify({
    email: email,
    password: password,
    username: username,
    signUpMethod: "email",
    firstName: "dummy" // TODO: - remove
  })
  
  return fetch(CREATE_API_URL, {
    body: body,
    method: "POST",
    headers: { "content-type": "application/json" }
  })
  .then(res => res.json())
  .then(json => json)
  .catch(e => console.log(e))  
}
