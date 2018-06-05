import { Step } from "./data"
import { BlockOverflowProperty } from "csstype";

type ValidatorResult = [boolean, string]

export const emailValidator = (str: string): ValidatorResult => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const valid = re.test(String(str).toLowerCase())
  const error = "Please use a valid email."
  return [valid, error]
}

export const passwordValidator = (str: string): ValidatorResult => {
  const valid = str.length >= 6 && str.length <= 20
  const error = "Password must be between 6 and 20 characters."
  return [valid, error]
}

export const usernameValidator = (str: string): ValidatorResult => {
  const valid = str.length >= 4 && str.length <= 16
  const error = "Password must be between 4 and 16 characters."
  return [valid, error]
}

export const validate = (str: string, step: Step): ValidatorResult => {
  switch (step) {
    case Step.Email: return emailValidator(str)
    case Step.Password: return passwordValidator(str)
    default: return usernameValidator(str)
  }
}
