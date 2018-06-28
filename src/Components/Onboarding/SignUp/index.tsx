import React from "react"
import styled from "styled-components/native"
import _ from "underscore"

import { colors, lighten10l } from "../../../lib/colors"

import Button from "../../Common/Button"
import Text from "../../Common/Text"
import TextInput from "../../Common/TextInput"
import { Step, InputText, textForStep } from "./data"
import { validate } from "./validators"
import { fetchUser, loginUser, createUser, saveUser } from "../../../Models/user"

interface Props {
  step: Step
  navigator: any
}

interface State {
  step: Step
  userInput: string
  userInputValid: boolean
  error?: string
  email?: string
  password?: string
  username?: string
  isNetworking: boolean
  isShowingPassword: boolean
}

export default class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      step: Step.Email,
      userInputValid: false,
      userInput: "",
      isShowingPassword: false,
      isNetworking: false,
    }
  }

  handleUserInput(userInput: string) {
    const [userInputValid, error] = validate(userInput, this.state.step)
    this.setState({ userInput: userInput, userInputValid: userInputValid })
  }

  continue() {
    const { userInput, step, email, password } = this.state
    const [userInputValid, error] = validate(userInput, step)

    if (!userInputValid) {
      this.setState({ error })
    } else if (step === Step.Email) {
      this.setState({ isNetworking: true })
      this.fetchUser(userInput)
    } else if (step === Step.Password) {
      this.setState({ isNetworking: true })
      this.loginUser((email as string).toLowerCase(), userInput)
    } else if (step === Step.CreatePassword) {
      this.setState({ password: userInput })
      this.nextStep(Step.Username)
    } else if (step === Step.Username) {
      this.setState({ isNetworking: true })
      this.createUser((email as string).toLowerCase(), password as string, userInput)
    }
  }

  nextStep(step: Step) {
    this.setState({
      step: step,
      userInput: "",
      userInputValid: false,
      isShowingPassword: false,
      error: undefined,
    })
  }

  fetchUser(email: string) {
    fetchUser(email.toLowerCase())
      .then(res => {
        this.setState({ isNetworking: false })
        const step = res.success ? Step.Password : Step.CreatePassword
        this.setState({ email })
        this.nextStep(step)
      })
      .catch(e => this.setState({ error: "Something bad happened" }))
  }

  loginUser(email: string, password: string) {
    loginUser(email, password)
      .then(res => {
        this.setState({ isNetworking: false })
        res.error
          ? this.setState({ error: res.error })
          : this.saveUserAndExit(email, password, res.user.username, res.user._id)
      })
      .catch(e => this.setState({ error: "Something bad happened" }))
  }

  createUser(email: string, password: string, username: string) {
    createUser(email, password, username)
      .then(res => {
        this.setState({ isNetworking: false })
        res.error ? this.setState({ error: res.error }) : this.saveUserAndExit(email, password, username, res._id)
      })
      .catch(e => {
        this.setState({ error: "Something bad happened" })
      })
  }

  saveUserAndExit(email: string, password: string, username: string, _id: string) {
    saveUser(email, password, username, _id)
    this.props.navigator.dismissAllModals()
  }

  showPassword() {
    const isShowingPassword = !this.state.isShowingPassword
    this.setState({ isShowingPassword })
  }

  render() {
    const { step, userInput, userInputValid, error, isShowingPassword, isNetworking } = this.state

    const { header, subheader, placeholder } = textForStep(step)

    const isEnteringPassword = _.includes([1, 2], step)

    return (
      <ContainerView>
        <Text.xxl>{header}</Text.xxl>

        <Text.m color={colors.gray} margin={"10px 0px"}>
          {subheader}
        </Text.m>

        <InputContainerView>
          <TextInput
            text={userInput}
            secureTextEntry={isEnteringPassword && !isShowingPassword}
            onChangeText={this.handleUserInput.bind(this)}
            margin={"0px"}
            placeholder={placeholder}
          />

          {isEnteringPassword && (
            <ShowPasswordContainer>
              <Button
                small
                text={"show"}
                highlight={isShowingPassword}
                color={colors.transparent}
                onPress={this.showPassword.bind(this)}
              />
            </ShowPasswordContainer>
          )}
        </InputContainerView>

        <Button
          text={"next"}
          margin={"0 auto"}
          disabled={!userInputValid || isNetworking}
          color={userInputValid && !isNetworking ? colors.blue : colors.gray}
          onPress={this.continue.bind(this)}
        />

        <Text.m error margin={"20px 0px 0px 0px"}>
          {error}
        </Text.m>
      </ContainerView>
    )
  }
}

const InputContainerView = styled.View`
  position: relative;
  margin: 30px 0px 20px 0px;
`

const ShowPasswordContainer = styled.View`
  position: absolute;
  right: 0;
`

const ContainerView = styled.View`
  flex: 1;
  width: 92.5%;
  margin: 0 auto;
  margin-top: 40px;
`
