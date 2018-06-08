import React from 'react'
import styled from "styled-components/native"
import { colors, lighten10l } from '../../../lib/colors'
import { validate } from '../../Onboarding/SignUp/validators';

export interface UserAnswer {
  correct: boolean,
  value: string
}

export interface Props {
  userAnswers: UserAnswer[],
  choices: any[][],
  layer: number,
  isCorrecting: boolean
}

interface State {}

export default class Answer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps: Props) {    
  }
    
  render() {
    const {
      choices,
      userAnswers,
      layer,
      isCorrecting
    } = this.props

    const answerSpace = (value: string, correct: boolean, missing: boolean) => <AnswerSpace 
      key={value}>
      <Text
        missing={missing}>
        {value.toUpperCase()}
      </Text>
      <Underline
        isCorrecting={isCorrecting}
        correct={correct}
        missing={missing} />
    </AnswerSpace>
    
    const filled = userAnswers
      .map(a => answerSpace(a.value, a.correct, false))

    const unfilled = choices.slice(filled.length)
      .map(layer => {
        const value = layer.filter(c => c.correct)[0].value as string
        return answerSpace(value, true, true)
      })

    return (
      <ContainerView>
        {filled.concat(unfilled)}    
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
`

interface MissingProps {
  missing: boolean,
  correct?: boolean,
  isCorrecting?: boolean
}

const Text = styled.Text`
  font-size: 24;
  font-family: BrandonGrotesque-Bold;
  opacity: ${(p: MissingProps) => p.missing ? 0 : 1};
`

const Underline = styled.View`
  background-color: ${(p: MissingProps) => p.isCorrecting 
    ?  p.correct ? colors.green : colors.red
    : "black"};
  height: 4px;
  border-radius: 2px;
  margin: 0px -2px;
`
