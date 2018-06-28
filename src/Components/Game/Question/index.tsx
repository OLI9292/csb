import React from "react"
import { Animated } from "react-native"

import Prompt from "./prompt"
import Answer, { UserAnswer } from "./answer"
import Choices from "./choices"
import _ from "underscore"
import { getUser, logQuestionHistory } from "../../../Models/user"
import { logQuestions } from "../../../Models/question"
import { secondsDiff } from "../../../lib/helpers"

export interface Props {
  question: any
  questionDone: () => void
  isInterlude: boolean
  questionSequenceEnded: boolean
}

export interface QuestionLog {
  id: string
  questionCategory: string
  questionSubCategory: string
  questionIdentifier: string
  questionPrompt: string
  questionSecondaryPrompt: string
  startTime: Date
  endTime?: Date
  secondsTaken?: number
  guesses: string
  userId: string
  email: string
  correct: boolean
  finished: boolean
}

interface State {
  question?: any
  user?: any
  startTime?: Date
  opacityAnimation: Animated.Value
  userAnswers: string[]
  choices: any[][]
  currentChoices: string[]
  choiceTree?: any
  questionsLog: QuestionLog[]
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
      questionsLog: [],
      opacityAnimation: new Animated.Value(1),
    }

    this.promptComponent = React.createRef()
    this.choicesComponent = React.createRef()
  }

  async componentDidMount() {
    const user = await getUser() // TODO: - implement better state mgmt and remove
    this.setState({ user })
    this.reset(this.props.question)
  }

  componentWillUnmount() {
    const questionsLog = this.props.questionSequenceEnded
      ? (this.updateRecord("finished", undefined, true) as QuestionLog[])
      : this.state.questionsLog

    if (questionsLog.length === 0) {
      return
    }

    // Save in question 2 table
    logQuestions(questionsLog)

    // Save under user model
    const _id = this.state.user._id
    const question2History = questionsLog.filter(q => q.finished).map(q => ({ id: q.id, perfect: q.correct }))
    logQuestionHistory(JSON.stringify({ _id, question2History }))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.question && this.props.question !== nextProps.question) {
      Animated.timing(this.state.opacityAnimation, { toValue: 0, duration: 500 }).start()

      this.updateRecord("finished")

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
      } else if (_.isEmpty(obj) || _.isEqual(_.keys(obj), ["choiceSetId"])) {
        return undefined
      } else {
        return _.mapObject(obj, (v, k) => clean(v))
      }
    }

    const answers = choiceTree.answers.slice(1)
    const tree = clean(choiceTree.tree)
    return { answers, tree }
  }

  record(question: any) {
    const { user, questionsLog } = this.state

    const mapText = (prompt: any[]) =>
      prompt.map(c => (c.highlight ? `***${c.value as string}***` : (c.value as string))).join(" ")

    const questionLog: QuestionLog = {
      id: question._id,
      questionCategory: question.category,
      questionSubCategory: question.subCategory,
      questionIdentifier: question.identifier,
      questionPrompt: mapText(question.prompt),
      questionSecondaryPrompt: mapText(question.secondaryPrompt),
      startTime: new Date(),
      guesses: "",
      userId: user._id,
      email: user.email,
      correct: true,
      finished: false,
    }

    questionsLog.push(questionLog)
    this.setState({ questionsLog })
  }

  updateRecord(attr: string, value?: string, dismounting: boolean = false): QuestionLog[] | undefined {
    const questionsLog = this.state.questionsLog
    const log = _.last(questionsLog) as QuestionLog

    if (attr === "guess") {
      log.guesses.length && (log.guesses += "; ")
      log.guesses += value
    } else if (attr === "correct") {
      log.correct = false
    } else if (attr === "finished") {
      log.finished = true
      log.endTime = new Date()
      log.secondsTaken = secondsDiff(log.startTime, log.endTime)
    }

    if (dismounting) {
      return questionsLog
    } else {
      this.setState({ questionsLog })
    }
  }

  reset(question: any) {
    const choiceTree = question.choiceTreeJson && this.cleanChoiceTreeJson(question.choiceTreeJson)
    this.record(question)

    this.setState(
      {
        startTime: new Date(),
        choiceTree: choiceTree,
        choices: question.choices,
        question: question,
        isCorrecting: false,
        userAnswers: [],
      },
      this.checkInput
    )
  }

  checkInput() {
    let { choiceTree, choices, userAnswers } = this.state

    if (choiceTree) {
      let { answers, tree } = choiceTree

      while (userAnswers.length) {
        const stop = this.state.isCorrecting && userAnswers[0] !== answers[0]
        if (stop) {
          break
        }
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
          () => (this.questionDone() ? this.props.questionDone() : this.checkInput())
        )
      }
    } else if (choices) {
      const layer = choices[this.state.isCorrecting ? this.incorrectIndex(false) : userAnswers.length]

      if (layer) {
        const currentChoices = layer.map(c => c.value)
        this.setState({ currentChoices })
      } else {
        this.setState(
          { isCorrecting: true },
          () => (this.questionDone(false) ? this.props.questionDone() : this.checkInput())
        )
      }
    }
  }

  questionDone(isUsingChoiceTree: boolean = true): boolean {
    return this.incorrectIndex(isUsingChoiceTree) === -1
  }

  incorrectIndex(isUsingChoiceTree: boolean = true): number {
    const { userAnswers, choices, choiceTree } = this.state

    let index, slicedUserAnswers

    if (isUsingChoiceTree) {
      slicedUserAnswers = userAnswers.slice(0, choiceTree.answers.length)
      index = _.findIndex(
        _.zip(slicedUserAnswers, choiceTree.answers),
        (pair: string[]): boolean => pair[0] !== pair[1]
      )
    } else {
      index = _.findIndex(
        userAnswers,
        (a: string, idx: number) => !_.includes(choices[idx].filter(c => c.correct).map(c => c.value), a)
      )
    }

    if (index === -1 && isUsingChoiceTree) {
      this.setState({ userAnswers: slicedUserAnswers || userAnswers })
    } else {
      this.updateRecord("correct")
    }

    return index
  }

  guessed(value: string): void {
    let { choiceTree, choices, isCorrecting, userAnswers } = this.state
    this.updateRecord("guess", value)

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
    const { userAnswers, question, choiceTree, choices, isCorrecting, currentChoices } = this.state

    if (!question) {
      return null
    }

    return (
      <Animated.View
        style={[
          {
            opacity: this.state.opacityAnimation,
            flex: 12,
            alignSelf: "stretch",
            marginLeft: 10,
            marginRight: 10,
          },
        ]}
      >
        <Prompt ref={this.promptComponent} prompt={question.prompt} secondaryPrompt={question.secondaryPrompt} />

        <Answer isCorrecting={isCorrecting} choiceTree={choiceTree} choices={choices} userAnswers={userAnswers} />

        <Choices
          isInterlude={this.props.isInterlude}
          ref={this.choicesComponent}
          data={currentChoices}
          guessed={this.guessed.bind(this)}
        />
      </Animated.View>
    )
  }
}
