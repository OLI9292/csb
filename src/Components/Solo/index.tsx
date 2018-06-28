import React from "react"
import { Component } from "react"
import styled from "styled-components/native"
import get from "lodash/get"

import { colors, lighten10l } from "../../lib/colors"
import { cmpQuestionIdentifiers } from "../../lib/helpers"
import Button from "../Common/Button"
import Header from "../Common/Header"

import { fetchQuestions } from "../../Models/question"
import { getUser, fetchUser } from "../../Models/user"
import _ from "underscore"

import mock from "./mock"

export interface Props {
  navigator: any
}

enum DisplayState {
  Category,
  SubCategory,
  Question,
}

interface QuestionHistory {
  id: string
  perfect: boolean
}

interface State {
  questions: any[]
  questionHistory: QuestionHistory[]
  selectedCategory?: string
  isNetworking: boolean
  user?: any
  selectedSubCategory?: string
}

const START_IMMEDIATELY = false

export default class Solo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isNetworking: false,
      questionHistory: [],
      questions: [],
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  async componentDidMount() {
    this.fetchOrUpdateUser()
    const questions = await this.fetchQuestions()
    this.setState({ questions }, () => {
      if (START_IMMEDIATELY) {
        this.selected("2.1.6", "math", "lesson 2")
      }
    })
  }

  onNavigatorEvent(event: any) {
    if (event.id === "willAppear") {
      setTimeout(() => this.fetchOrUpdateUser(), 500)
    }
  }

  fetchOrUpdateUser = async () => {
    if (!this.state.user) {
      const user = await getUser()
      if (user) {
        this.setState({ user })
        this.updateUserQuestionHistory(user.email)
      } else {
        this.showWelcomeScreen()
      }
    } else {
      this.updateUserQuestionHistory(this.state.user.email)
    }
  }

  updateUserQuestionHistory = async (email: any) => {
    const questionHistory = get(get(await fetchUser(email), "user"), "question2History") || []
    this.setState({ questionHistory })
  }

  fetchQuestions = async (ids?: string[]): Promise<any[]> => {
    this.setState({ isNetworking: true })
    const questions = await fetchQuestions(ids)
    this.setState({ isNetworking: false })
    return questions
  }

  selected = async (text: string, category?: string, subCategory?: string) => {
    if (subCategory) {
      const questionIds = this.state.questions
        .filter(q => q.category === (category as string))
        .filter(q => q.subCategory === (subCategory as string))
        .filter(q => q.identifier >= text)
        .map(q => q._id)
      const questions = await this.fetchQuestions(questionIds)
      this.startGame(questions)
    } else if (category) {
      this.setState({ selectedSubCategory: text })
    } else {
      this.setState({ selectedCategory: text })
    }
  }

  showWelcomeScreen() {
    this.props.navigator.showModal({
      screen: "example.WelcomeScreen",
      animationType: "none",
      navigatorStyle: {
        navBarHidden: true,
        screenBackgroundColor: colors.white,
      },
    })
  }

  startGame(questions: any[]) {
    this.props.navigator.showModal({
      screen: "example.GameScreen",
      animationType: "none",
      passProps: { questions: _.sortBy(questions, "identifier") },
      navigatorStyle: {
        navBarHidden: true,
        statusBarHidden: true,
        statusBarHideWithNavBar: true,
        screenBackgroundColor: colors.white,
      },
    })
  }

  back() {
    this.state.selectedSubCategory
      ? this.setState({ selectedSubCategory: undefined })
      : this.setState({ selectedCategory: undefined })
  }

  buttonColor(question: any, selectedCategory?: string, selectedSubCategory?: string): string {
    const { questionHistory, questions } = this.state

    if (selectedSubCategory) {
      const answered = _.find(questionHistory, q => q.id === question._id)
      return answered ? (answered.perfect ? colors.green : colors.yellow) : colors.gray
    } else {
      const selected = (selectedCategory
        ? questions.filter(q => q.category === selectedCategory && q.subCategory === question.subCategory)
        : questions.filter(q => q.category === question.category)
      ).map(q => q._id)
      const matching = _.filter(questionHistory, q => _.includes(selected, q.id))
      const perfect = matching.filter(m => m.perfect)
      return matching.length ? (selected.length === perfect.length ? colors.green : colors.yellow) : colors.gray
    }
  }

  render() {
    let { questions, selectedCategory, selectedSubCategory, isNetworking } = this.state

    const button = (q: any) => {
      const text = selectedSubCategory ? q.identifier : selectedCategory ? q.subCategory : q.category
      return (
        <ButtonContainer key={text}>
          <Button
            margin={"8px 0px"}
            color={colors.blue}
            text={text}
            onPress={() => this.selected(text, selectedCategory, selectedSubCategory)}
          />
          <Circle color={this.buttonColor(q, selectedCategory, selectedSubCategory)} />
        </ButtonContainer>
      )
    }

    const selected = (() => {
      if (selectedSubCategory) {
        return questions
          .filter(q => q.subCategory === selectedSubCategory && q.category === selectedCategory)
          .sort(cmpQuestionIdentifiers)
      } else {
        const filtered = questions.filter(q => !selectedCategory || q.category === selectedCategory)
        const unique = _.uniq(filtered, q => q[selectedCategory ? "subCategory" : "category"])
        return _.sortBy(
          unique,
          q => (selectedCategory ? parseInt(q["subCategory"].replace(/\D/g, ""), 10) : q["category"])
        )
      }
    })()

    return (
      <ContainerView>
        <TopView>
          <FlexView>
            {selectedCategory && <Button color={colors.white} onPress={this.back.bind(this)} small text={"back"} />}
          </FlexView>

          <LongFlexView>
            <Header.m center>{(selectedCategory || "").toUpperCase() || "LESSONS"}</Header.m>
            <Header.sub center>{(selectedSubCategory || "").toUpperCase()}</Header.sub>
          </LongFlexView>

          <FlexView />
        </TopView>
        {isNetworking ? <Text>Loading lessons from server.</Text> : <ButtonView>{selected.map(button)}</ButtonView>}
      </ContainerView>
    )
  }
}

const ContainerView = styled.ScrollView`
  flex: 9;
`

const TopView = styled.View`
  flex-direction: row;
  margin-top: 20px;
`

const ButtonView = styled.View`
  align-items: center;
  margin-top: 20px;
`

const FlexView = styled.View`
  flex: 1;
`

const LongFlexView = styled.View`
  flex: 2;
`

const ButtonContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`

interface CircleProps {
  color: string
}

const Circle = styled.View`
  height: 10px;
  width: 10px;
  margin-left: 10px;
  border-radius: 10px;
  background-color: ${(p: CircleProps) => p.color};
`

const Text = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${colors.gray};
`
