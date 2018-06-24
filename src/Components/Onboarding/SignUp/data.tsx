export type InputText = {
  header: string
  subheader: string
  placeholder: string
}

export enum Step {
  Email,
  Password,
  CreatePassword,
  Username,
}

export const textForStep = function(step: Step): InputText {
  switch (step) {
    case Step.Email:
      return {
        header: "Enter your email address",
        subheader: "If you don't have a Wordcraft account we'll get one set up",
        placeholder: "Email",
      }
    case Step.Password:
      return {
        header: "Enter your password",
        subheader: "",
        placeholder: "Password",
      }
    case Step.CreatePassword:
      return {
        header: "Create a password",
        subheader: "Must be 6 characters or longer",
        placeholder: "Create a password",
      }
    default:
      return {
        header: "Create a username",
        subheader: "Must be 6 characters or longer",
        placeholder: "Create a username",
      }
  }
}
