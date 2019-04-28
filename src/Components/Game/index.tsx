import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { shuffle } from "lodash"

import Choices, { Guess } from "./Question/choices"
import Prompt from "./Question/prompt"
import Button from "../Common/Button"
import ProgressBar from "./progressBar"

import ReadComponent, { Read } from "./Read"
import { Question, AnswerPart, fetchQuestions } from "../../Models/question"

import { colors, lighten10l } from "../../lib/colors"

export interface Props {
  sequenceId: string
}

interface State {
  elements: any[]
  feedback?: string
  hints: string[]
  guess?: Guess
  choices: AnswerPart[]
  isBetweenQuestions: boolean
  question?: Question
  read?: Read
}

export default class Game extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isBetweenQuestions: false,
      choices: [],
      elements: [],
      hints: [],
    }
  }

  public async componentDidMount() {
    const elements = (await fetchQuestions(this.props.sequenceId)).slice(5)
    this.setState({ elements }, this.nextQuestion)
  }

  private nextQuestion() {
    const { elements } = this.state
    const element = elements.shift()

    if (!element) {
      return
    }

    if ((element as Read).value) {
      this.setState({ read: element as Read, question: undefined })
    } else if ((element as Question).TYPE) {
      const question = element as Question
      const { redHerrings, answer } = question
      const choices = shuffle(redHerrings.concat(answer))
      this.setState({ question, choices, read: undefined })
    }
  }

  private exitGame() {}

  private guessed() {}

  render() {
    const { choices, elements, guess, hints, question, read, feedback, isBetweenQuestions } = this.state

    const questionComponents = (question: Question) => {
      const { prompt, answer, redHerrings, TYPE, interactive, type, multipart, formatAsCode, part } = question

      const noPrompt = prompt.length === 0
      const isInteractive = interactive && interactive.length > 0
      return (
        <View>
          {!noPrompt && (
            <Prompt
              isInteractive={isInteractive}
              formatAsCode={formatAsCode && !isInteractive}
              feedback={feedback}
              TYPE={TYPE}
              type={type}
              hints={[]}
              prompt={prompt}
            />
          )}

          {redHerrings.length > 0 && (
            <Choices
              hide={multipart && part === 1}
              answer={answer}
              isBetweenQuestions={isBetweenQuestions}
              guess={guess}
              guessed={this.guessed.bind(this)}
              id={question._id}
              choices={choices}
              hints={hints}
              redHerrings={redHerrings}
              images={question.images || []}
              type={TYPE}
            />
          )}
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignSelf: "stretch" }}>
        <TopView>
          <View style={{ flex: 1 }}>
            <Icon onPress={this.exitGame.bind(this)} name="exit-to-app" size={30} color={colors.lightGray} />
          </View>

          <ProgressBar completion={0 / elements.length} />

          <View style={{ flex: 1 }} />
        </TopView>

        {question && questionComponents(question)}

        {read && <ReadComponent data={read} nextQuestion={this.nextQuestion.bind(this)} />}

        <BottomView />
      </View>
    )
  }
}

const TopView = styled.View`
  flex: 2;
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`

const BottomView = styled.View`
  flex: 1;
`
