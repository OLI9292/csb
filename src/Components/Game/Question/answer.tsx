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
      <ContainerText adjustsFontSizeToFit={true} numberOfLines={6}>
        {userAnswers
          .map((a, i) => answer(a, i))
          .reduce((accu: (JSX.Element | null)[] | null, elem: JSX.Element | null, idx: number) => {
            return accu === null ? [elem] : [...accu, separator(idx), elem]
          }, null)}
      </ContainerText>
    )
  }
}

const AnswerSpace = styled.View`
  margin: 0px 10px;
`

const ContainerText = styled.Text`
  font-size: 20;
  text-align: center;
  flex: 1;
  width: 100%;
  height: 100%;
  font-family: BrandonGrotesque-Regular;
`

interface TextProps {
  correct?: boolean
  isCorrecting?: boolean
}

const Text = styled.Text`
  color: ${(p: TextProps) => (p.isCorrecting ? (p.correct ? colors.green : colors.red) : "black")};
`
