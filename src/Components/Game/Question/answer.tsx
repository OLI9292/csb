import React from "react"
import styled from "styled-components/native"
import { colors, lighten10l } from "../../../lib/colors"
import { validate } from "../../Onboarding/SignUp/validators"
import Choices from "./choices"
import _ from "underscore"

export interface UserAnswer {
  correct: boolean
  value: string
}

export interface Props {
  userAnswers: string[]
  choiceTree?: any
  choices?: any[][]
  isCorrecting: boolean
}

interface State {}

export default class Answer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  correct(value: string, idx: number) {
    const { choices, choiceTree } = this.props
    if (choiceTree) {
      return value === choiceTree.answers[idx]
    } else if (choices) {
      return _.includes(choices[idx].filter(c => c.correct).map(c => c.value), value)
    }
  }

  render() {
    const { userAnswers, isCorrecting } = this.props

    const answer = (value: string, idx: number): JSX.Element => (
      <Text correct={this.correct(value, idx)} isCorrecting={isCorrecting} key={value}>
        {value}
      </Text>
    )

    const separator = (idx: number): JSX.Element => <Text key={idx}>, </Text>

    return (
      <ContainerView>
        {userAnswers
          .map((a, i) => answer(a, i))
          .reduce((accu: (JSX.Element | null)[] | null, elem: JSX.Element | null, idx: number) => {
            return accu === null ? [elem] : [...accu, separator(idx), elem]
          }, null)}
      </ContainerView>
    )
  }
}

const AnswerSpace = styled.View`
  margin: 0px 10px;
`

const ContainerView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  width: 100%;
`

interface TextProps {
  missing: boolean
  correct?: boolean
  isCorrecting?: boolean
}

const Text = styled.Text`
  font-size: 20;
  color: ${(p: TextProps) => (p.isCorrecting ? (p.correct ? colors.green : colors.red) : "black")};
  font-family: BrandonGrotesque-Regular;
  opacity: ${(p: TextProps) => (p.missing ? 0 : 1)};
`
