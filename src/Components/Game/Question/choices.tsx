import React from 'react'
import styled from "styled-components/native"
import _ from "underscore"
import { Animated } from "react-native"

import { colors, lighten10l } from '../../../lib/colors'
import { chunk } from '../../../lib/helpers'
import { UserAnswer } from './answer'

export interface Props {
  ref: React.RefObject<Choices>,
  data: string[],
  guessed: (value: string) => void,
  isInterlude: boolean
}

interface State {
  hintAnimation: Animated.Value
}

export default class Choices extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
      this.state = {
      hintAnimation: new Animated.Value(0)
    }
  }  

  render() {
    const {
      data,
      isInterlude
    } = this.props

    const choice = (value: string, idx: number) => <Button
      key={idx}
      color={colors.blue}
      underlayColor={colors.blue10l}
      onPress={() => this.props.guessed(value)}>
      <Text>
        {value.toUpperCase()}
      </Text>
    </Button>

    const choices = this.props.data
      .map((d: string, i: number) => choice(d, i))

    return (
      <ScrollView>
        <ContainerView>
          {!isInterlude && choices}
        </ContainerView>
      </ScrollView>
    )
  }
}

const ScrollView = styled.ScrollView`
  flex: 3;
`

const ContainerView = styled.View`
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-direction: row;  
`;


interface ButtonProps {
  color: string
}

const Button = styled.TouchableHighlight`
  margin: 3px;
  padding: 0px 10px;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${(p: ButtonProps) => p.color};
  border-radius: 5;
`;

const Text = styled.Text`
  color: white; 
  font-family: BrandonGrotesque-Regular;
  font-size: 12px;
`;
