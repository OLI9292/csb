import React from "react"
import { Navigation } from "react-native-navigation"
import { Component } from "react"
import styled from "styled-components/native"

import { colors, lighten10l } from "../../lib/colors"
import Button from "../Common/Button"
import Header from "../Common/Header"

import { fetchSequences, Sequence } from "../../Models/sequence"

export interface Props {
  navigator: any
  componentId: string
}

interface State {
  sequences: Sequence[]
  isNetworking: boolean
}

export default class Solo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isNetworking: false,
      sequences: [],
    }
  }

  async componentDidMount() {
    this.setState({ isNetworking: true })
    const sequences = await fetchSequences("5cba0492bc0e050022fd531e")
    this.play(sequences[0])
    this.setState({ sequences, isNetworking: false })
  }

  private play(sequence: Sequence) {
    Navigation.setRoot({
      root: {
        component: {
          name: "Game",
          passProps: {
            sequenceId: sequence.id,
          },
        },
      },
    })
  }

  render() {
    const { sequences, isNetworking } = this.state

    const button = (sequence: Sequence) => (
      <Button key={sequence.id} onPress={() => this.play(sequence)} text={sequence.name} color={colors.blue} />
    )

    return (
      <ContainerView>
        {isNetworking ? <Text>Loading lessons from server.</Text> : <ButtonView>{sequences.map(button)}</ButtonView>}
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
