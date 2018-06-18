import React from 'react'
import styled from "styled-components/native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors, lighten10l } from '../../lib/colors'
import Question from './Question/index'
import ProgressBar from './progressBar'

export interface Props {
  questions: any[],
  navigator: any
}

interface State {
  questionIndex: number,
  questionDone: boolean
}

export default class Game extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      questionIndex: 0,
      questionDone: false
    }
  }

  questionDone() {
    this.setState({ questionDone: true })
  }

  nextQuestion() {
    const questionIndex = this.state.questionIndex + 1
    
    this.setState({
      questionIndex: questionIndex,
      questionDone: false
    })

    if (questionIndex === this.props.questions.length) {
      setTimeout(() => this.exitGame(), 500)
    }
  }

  exitGame() {
    this.props.navigator.dismissModal({
      animationType: "none"
    })
  }

  render() {
    const {
      questionIndex,
      questionDone
    } = this.state

    const {
      questions
    } = this.props

    return (
      <ContainerView>
        <TopContainerView>
          <FlexedView>
            <Icon
              onPress={this.exitGame.bind(this)}
              name="exit-to-app"
              size={30}
              color={colors.lightGray} />
          </FlexedView>

          <ProgressBar
            completion={questionIndex / questions.length} />

          <FlexedView />
        </TopContainerView>

        <Question
          isInterlude={questionDone}
          questionDone={this.questionDone.bind(this)}
          question={questions[questionIndex]} />

        {
          questionDone &&
          <Button
            underlayColor={colors.green10l}
            onPress={this.nextQuestion.bind(this)}>
            <Text>
              CONTINUE
            </Text>
          </Button>
        }
      </ContainerView>
    )
  }
}

const FlexedView = styled.View`
  flex: 1;
`

const Button = styled.TouchableHighlight`
  width: 100px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: ${colors.green};
`;

const Text = styled.Text`
  color: white;
  font-family: BrandonGrotesque-Bold;
`;

const ContainerView = styled.View`
  flex: 1;
  align-self: stretch;
`;

const TopContainerView = styled.View`
  flex: 1;
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`
