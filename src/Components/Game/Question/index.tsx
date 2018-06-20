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
  choices: any[][],
  currentChoices: string[],
  choiceTree?: any,
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
      currentChoices: [],
      choices: [],
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

  cleanChoiceTreeJson(json: any) {
    const choiceTree = JSON.parse(json)

    const clean = (obj: any): any => {
      if (obj.branches) {
        return clean(obj.branches)
      } else if (_.isEmpty(obj)) {
        return undefined
      } else {
        return _.mapObject(obj, (v, k) => clean(v))
      }
    }

    const tree = clean(choiceTree.tree)
    const answers = choiceTree.answers.slice(1)
    return { answers, tree }
  }

  reset(question: any) {
    const choiceTree = question.choiceTreeJson && this.cleanChoiceTreeJson(question.choiceTreeJson)

    this.setState({
      choiceTree: choiceTree,
      choices: question.choices,
      question: question,
      isCorrecting: false,
      userAnswers: []
    }, this.checkInput)
  }

  checkInput() {
    let { choiceTree, choices, userAnswers } = this.state

    if (choiceTree) {
      let { answers, tree } = choiceTree
      
      while (userAnswers.length) {
        const stop = 
          this.state.isCorrecting &&
          userAnswers[0] !== answers[0]
        if (stop) { break }
        tree = tree[userAnswers[0]]
        userAnswers = userAnswers.slice(1)
        answers = answers.slice(1)
      }
  
      if (tree) {
        const currentChoices = _.keys(tree)
        this.setState({ currentChoices })
      } else {
        this.setState(
          { isCorrecting: true },
          () => this.questionDone() ? this.props.questionDone() : this.checkInput()
        )
      }

    } else if (choices) {

      const layer = choices[this.state.isCorrecting 
        ? this.incorrectIndex(false)
        : userAnswers.length]

      if (layer) {
        const currentChoices = layer.map(c => c.value)
        this.setState({ currentChoices })  
      } else {
        this.setState(
          { isCorrecting: true },
          () => this.questionDone(false) ? this.props.questionDone() : this.checkInput()
        )
      }
    }
  }

  questionDone(isUsingChoiceTree: boolean = true): boolean {
    return this.incorrectIndex(isUsingChoiceTree) === -1
  }

  incorrectIndex(isUsingChoiceTree: boolean = true): number {
    if (isUsingChoiceTree) {
      const incorrect = (pair: string[]): boolean => pair[0] !== pair[1]
      return _.findIndex(_.zip(this.state.userAnswers, this.state.choiceTree.answers), incorrect)
    } else {
      const { userAnswers, choices } = this.state
      return _.findIndex(userAnswers, (a, idx) => 
        !_.includes(choices[idx].filter(c => c.correct).map(c => c.value), a))
    }
  }

  guessed(value: string): void {  
    let { choiceTree, choices, isCorrecting, userAnswers } = this.state

    if (choiceTree) {

      if (isCorrecting) {
        const incorrectIndex = this.incorrectIndex()
        userAnswers[incorrectIndex] = value
        isCorrecting = incorrectIndex !== userAnswers.length - 1
      } else {
        userAnswers[userAnswers.length] = value
      }
      
      this.setState({ isCorrecting, userAnswers }, this.checkInput)

    } else if (choices) {

      userAnswers[isCorrecting ? this.incorrectIndex(false) : userAnswers.length] = value
      this.setState({ userAnswers }, this.checkInput)
      
    }
  }

  render() {
    const {
      userAnswers,
      question,
      choiceTree,
      choices,
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
          choices={choices}
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
