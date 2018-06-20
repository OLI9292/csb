import { AsyncStorage } from 'react-native'

const API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/auth/user"
const CREATE_API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/user"
const LOGIN_API_URL = "https://desolate-plains-35942.herokuapp.com/api/v2/login"

export async function getUser() {
  const user = await AsyncStorage.getItem("@Storage:user")
  if (user) {
    return JSON.parse(user)
  }
}

export function saveUser(email: string, password: string, username: string, _id: string) {
  const user = JSON.stringify({ email, password, username, _id })
  AsyncStorage.setItem("@Storage:user", user)
}

export function logoutUser() {
  AsyncStorage.removeItem("@Storage:user")
}

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
    firstName: username
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
