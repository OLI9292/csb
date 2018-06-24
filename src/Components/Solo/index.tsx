import React from "react"
import { Component } from "react"
import styled from "styled-components/native"
import get from "lodash/get"

import { colors, lighten10l } from "../../lib/colors"
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
  user?: any
  selectedSubCategory?: string
}

export default class Solo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      questionHistory: [],
      questions: [],
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  onNavigatorEvent(event: any) {
    if (event.id === "willAppear") {
      setTimeout(() => this.loadRedGreen(), 500)
    }
  }

  showWelcomeScreen() {
    this.props.navigator.showModal({
      screen: "example.WelcomeScreen",
      animationType: "none",
      navigatorStyle: { navBarHidden: true },
    })
  }

  loadData = async () => {
    const START_IMMEDIATELY = false
    const questions = await fetchQuestions()

    if (questions.error) {
      console.log(questions.error)
    } else {
      this.setState({ questions }, () => {
        if (START_IMMEDIATELY) {
          this.selected("2.1.4", "math", "lesson 2")
        }
      })
    }
  }

  loadRedGreen = async () => {
    const questionHistory = get(get(await fetchUser(this.state.user.email), "user"), "question2History") || []
    this.setState({ questionHistory })
  }

  async componentDidMount() {
    const user = await getUser()
    this.setState({ user }, this.loadRedGreen)
    if (!user) {
      this.showWelcomeScreen()
    }
    this.loadData()
  }

  selected(text: string, category?: string, subCategory?: string) {
    if (subCategory) {
      const questions = this.state.questions
        .filter(q => q.category === (category as string))
        .filter(q => q.subCategory === (subCategory as string))
        .filter(q => q.identifier >= text)
      this.startGame(questions)
    } else if (category) {
      this.setState({ selectedSubCategory: text })
    } else {
      this.setState({ selectedCategory: text })
    }
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
    let { questions, selectedCategory, selectedSubCategory } = this.state

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

    const selected = selectedSubCategory
      ? _.sortBy(
          questions.filter(q => q.subCategory === selectedSubCategory && q.category === selectedCategory),
          "identifier"
        )
      : _.sortBy(
          _.uniq(
            questions.filter(q => !selectedCategory || q.category === selectedCategory),
            q => q[selectedCategory ? "subCategory" : "category"]
          ),
          q => q[selectedCategory ? "subCategory" : "category"]
        )

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
        <ButtonView>{selected.map(button)}</ButtonView>
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
