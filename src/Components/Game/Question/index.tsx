import React from 'react'
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
  userAnswers: string[],
  answers: string[],
  currentChoices: string[],
  choiceTree?: any,
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
      answers: [],
      currentChoices: [],
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
    const choiceTree = question.choiceTreeJson && JSON.parse(question.choiceTreeJson)
    let answers = choiceTree.answers
    answers.shift()

    this.setState({
      choiceTree: choiceTree,
      answers: answers,
      question: question,
      isCorrecting: false,
      userAnswers: []
    }, this.checkInput)
  }

  checkInput() {
    let { choiceTree } = this.state
    let tree = this.state.choiceTree.tree
    let userAnswers = _.clone(this.state.userAnswers)
    let answers = _.clone(this.state.answers)

    while (userAnswers.length) {
      if (this.state.isCorrecting) {
        const correct = userAnswers[0] === answers[0]
        if (correct) {
          tree = tree.branches[userAnswers[0]]
          userAnswers.shift()
          answers.shift()  
        } else {
          userAnswers = []
        }
      } else {
        tree = tree.branches[userAnswers[0]]
        userAnswers.shift()  
      }
    }
    
    if (tree.branches) {
      const currentChoices = _.keys(tree.branches)
      this.setState({ currentChoices })
    } else {
      if (this.questionDone()) {
        console.log("questionDone2")
        this.setState({ isCorrecting: true }, this.props.questionDone)
      } else {
        this.setState({ isCorrecting: true }, this.checkInput)        
      }
    }
  }

  questionDone() {
    return this.incorrectIndex() === -1
  }

  incorrectIndex() {
    const incorrect = (pair: string[]): boolean => pair[0] !== pair[1]
    return _.findIndex(_.zip(this.state.userAnswers, this.state.answers), incorrect)
  }

  guessed(value: string) {  
    let {
      choiceTree,
      isCorrecting,
      userAnswers
    } = this.state

    if (choiceTree) {
      if (isCorrecting) {
        const incorrectIndex = this.incorrectIndex()
        userAnswers[incorrectIndex] = value
        if (this.questionDone()) {
          this.setState({ userAnswers }, this.props.questionDone)
        } else {
          this.setState({ userAnswers }, this.checkInput)
        }
      } else {
        userAnswers = userAnswers.concat(value)
        this.setState({ userAnswers }, this.checkInput)  
      }
    }
  }

  render() {
    const {
      layer,
      userAnswers,
      question,
      choiceTree,
      isCorrecting,
      currentChoices
    } = this.state

    if (!question) { 
      return null
    }

    return (
      <Animated.View style={[{
        opacity: this.state.opacityAnimation,
        flex: 12,
        alignSelf: "stretch",
        marginLeft: 10,
        marginRight: 10
        }]}>
        
        <Prompt
          ref={this.promptComponent}
          prompt={question.prompt}
          secondaryPrompt={question.secondaryPrompt} />

        <Answer
          isCorrecting={isCorrecting}
          choiceTree={choiceTree}
          userAnswers={userAnswers} />          

        <Choices
          isInterlude={this.props.isInterlude}
          ref={this.choicesComponent}
          data={currentChoices}
          guessed={this.guessed.bind(this)} />
      </Animated.View>
    )
  }
}
