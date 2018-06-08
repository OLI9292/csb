import React from 'react'
import styled from "styled-components"
import { Animated } from "react-native"

import Prompt from './prompt'
import Answer, { UserAnswer } from './answer'
import Choices from './choices'
import _ from "underscore"

export interface Props {
  question: any,
  questionDone: () => void,
  isInterlude: boolean
}

interface State {
  question?: any,
  opacityAnimation: Animated.Value,
  userAnswers: UserAnswer[],
  layer: number,
  isCorrecting: boolean
}

export default class Question extends React.Component<Props, State> {
  private choicesComponent: React.RefObject<Choices>
  private promptComponent: React.RefObject<Prompt>
  private nextQuestionTimeout: any

  constructor(props: Props) {
    super(props)

    this.state = {
      isCorrecting: false,
      layer: 0,
      userAnswers: [],
      opacityAnimation: new Animated.Value(1)
    }

    this.promptComponent = React.createRef()
    this.choicesComponent = React.createRef()
  }

  componentDidMount() {
    this.reset(this.props.question)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.question && this.props.question !== nextProps.question) {
      Animated.timing(this.state.opacityAnimation, { toValue: 0, duration: 500 }).start()
      this.nextQuestionTimeout = setTimeout(() => {  
        this.reset(nextProps.question)
        Animated.timing(this.state.opacityAnimation, { toValue: 1, duration: 500 }).start()
      }, 500)
    }
  }

  reset(question: any) {
    this.setState({
      question: question,
      layer: 0,
      isCorrecting: false,
      userAnswers: []
    })
  }

  

  guessed(userAnwer: UserAnswer, layer: number) {  
    let {
      userAnswers,
      question,
      isCorrecting
    } = this.state

    userAnswers[layer] = userAnwer
    this.setState({ userAnswers })
    layer = layer + 1
    
    isCorrecting = isCorrecting ||  layer === question.choices.length
    if (isCorrecting) { this.setState({ isCorrecting }) }

    const done = _.every(userAnswers, a => a.correct) &&
      userAnswers.length === question.choices.length

    if (done) {
      this.props.questionDone()
    } else {
      if (isCorrecting) {
        const incorrectLayer = _.findIndex(userAnswers, u => !u.correct)
        if (incorrectLayer > -1) { this.setState({ layer: incorrectLayer }) }
      } else {
        this.setState({ layer })
      }
    }
  }

  render() {
    if (!this.state.question) { 
      return null
    }
    
    const {
      layer,
      userAnswers,
      question,
      isCorrecting
    } = this.state

    return (
      <Animated.View style={[{ opacity: this.state.opacityAnimation, flex: 8, alignSelf: "stretch" }]}>
        <Prompt
          ref={this.promptComponent}
          prompt={question.prompt}
          secondaryPrompt={question.secondaryPrompt} />

        <Answer
          isCorrecting={isCorrecting}
          layer={layer}
          choices={question.choices}
          userAnswers={userAnswers} />          

        <Choices
          isInterlude={this.props.isInterlude}
          ref={this.choicesComponent}
          layer={layer}
          data={question.choices}
          guessed={this.guessed.bind(this)} />
      </Animated.View>
    )
  }
}
