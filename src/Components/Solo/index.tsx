import React from 'react'
import { Component } from 'react'
import styled from "styled-components/native"

import { colors, lighten10l } from '../../lib/colors'
import Button from '../Common/Button'
import Header from '../Common/Header'

import { fetchQuestions } from '../../Models/question'
import { getUser } from "../../Models/user"
import _ from "underscore"

import mock from './mock'

export interface Props {
  navigator: any
}

enum DisplayState {
  Category,
  SubCategory,
  Question
}

interface State {
  questions: any[],
  selectedCategory?: string,
  selectedSubCategory?: string
}


export default class Solo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  showWelcomeScreen() {
    this.props.navigator.showModal({
      screen: "example.WelcomeScreen",
      animationType: "none",
      navigatorStyle: { navBarHidden: true }
    })    
  }

  loadData = async () => {
    const START_IMMEDIATELY = true
    const questions = await fetchQuestions()

    if (questions.error) {
      console.log(questions.error)
    } else {
      this.setState({ questions }, () => {
        if (START_IMMEDIATELY) { this.selected("1.1.1", "latin textbook","unit 2 morphology review test") } 
      })
    }
  }

  async componentDidMount() {
    const user = await getUser()
    !user && this.showWelcomeScreen()
    this.loadData()
  }

  selected(text: string, category?: string, subCategory?: string) {
    if (subCategory) {
      const questions = this.state.questions
        .filter(q => q.category === category as string)
        .filter(q => q.subCategory === subCategory as string)
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
        statusBarHideWithNavBar: true
      }
    });
  }

  back() {
    this.state.selectedSubCategory
      ? this.setState({ selectedSubCategory: undefined })
      : this.setState({ selectedCategory: undefined })
  }
  
  render() {
    let {
      questions,
      selectedCategory,
      selectedSubCategory
    } = this.state

    const button = (text: string) => <Button
      margin={"10px 0px"}
      key={text}
      color={colors.blue}
      text={text}
      onPress={() => this.selected(text, selectedCategory, selectedSubCategory)} />

    const title = (selectedSubCategory
      ? selectedCategory + " - " + selectedSubCategory
      : selectedCategory || "").toUpperCase();

    const buttons: JSX.Element[] = (selectedSubCategory
      ? questions
        .filter(q => q.subCategory === selectedSubCategory && q.category === selectedCategory)
        .map(q => q.identifier)
      : _.uniq(questions
        .filter(q => !selectedCategory || q.category === selectedCategory)
        .map(q => selectedCategory ? q.subCategory : q.category))
    ).sort().map(button)

    return (
      <ContainerView>
        <TopView>   
          <FlexView>
            {selectedCategory &&
              <Button
                color={colors.white}
                onPress={this.back.bind(this)}
                small
                text={"back"} />
            }
          </FlexView>

          <LongFlexView>
            <Header.m center>
              {title}
            </Header.m>
          </LongFlexView>

          <FlexView />
        </TopView>
        <ButtonView>
          {buttons}
        </ButtonView>
      </ContainerView>
    );
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
