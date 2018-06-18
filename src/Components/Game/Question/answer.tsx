import React from 'react'
import styled from "styled-components/native"
import { colors, lighten10l } from '../../../lib/colors'
import { validate } from '../../Onboarding/SignUp/validators';

export interface UserAnswer {
  correct: boolean,
  value: string
}

export interface Props {
  userAnswers: string[],
  choiceTree: any,
  isCorrecting: boolean
}

interface State {}

export default class Answer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }
    
  render() {
    const {
      choiceTree,
      userAnswers,
      isCorrecting
    } = this.props

    const answer = (value: string, idx: number): JSX.Element => <Text 
      correct={value === choiceTree.answers[idx]}
      isCorrecting={isCorrecting}
      key={value}>
      {value}
    </Text>

    const separator = (idx: number): JSX.Element => <Text key={idx}>, </Text> 
    
    return (
      <ContainerView>
        {
          userAnswers
            .map((a, i) => answer(a, i))
            .reduce((accu: (JSX.Element | null)[] | null, elem: JSX.Element | null, idx: number) => {
              return accu === null ? [elem] : [...accu, separator(idx), elem]
            }, null)
        }    
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

interface TextProps {
  missing: boolean,
  correct?: boolean,
  isCorrecting?: boolean
}

const Text = styled.Text`
  font-size: 18;
  color: ${(p: TextProps) => p.isCorrecting ? (p.correct ? colors.green : colors.red) : "black"};
  font-family: BrandonGrotesque-Regular;
  opacity: ${(p: TextProps) => p.missing ? 0 : 1};
`
