import React from 'react'
import styled from "styled-components/native"
import _ from "underscore"
import { Animated } from "react-native"

import { colors, lighten10l } from '../../../lib/colors'
import { chunk } from '../../../lib/helpers'
import { UserAnswer } from './answer'

export interface Props {
  ref: React.RefObject<Choices>,
  data: any[],
  guessed: (userAnswer: UserAnswer, layer: number) => void,
  layer: number,
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
      layer,
      isInterlude
    } = this.props

    const choice = (value: string, correct: boolean, idx: number) => {
      return <Button
        key={idx}
        color={colors.blue}
        underlayColor={colors.blue10l}
        onPress={() => this.props.guessed({ value: value, correct: correct }, layer)}>
        <TextContainer>
          <Text>
            {value.toUpperCase()}
          </Text>
        </TextContainer>
      </Button>
    }

    const choices = chunk(this.props.data[layer], 2)
      .map((group, i) => <SplitView 
        key={i}>
        {group.map((d, i) => choice(d.value as string, d.correct as boolean, i))}
      </SplitView>)

    return (
      <ContainerView>
        {!isInterlude && choices}
      </ContainerView>
    )
  }
}


const ContainerView = styled.View`
  flex: 3;
`;

const SplitView = styled.View`
  flex-direction: row;
`;

interface ButtonProps {
  color: string
}

const Button = styled.TouchableHighlight`
  margin: 10px;
  padding: 10px;
  height: 50px;
  flex: 1
  align-items: center;
  justify-content: center;
  background-color: ${(p: ButtonProps) => p.color};
  border-radius: 10;
`;

const TextContainer = styled.View`
`;

const Text = styled.Text`
  color: white;
  text-align: center;
  font-family: BrandonGrotesque-Bold;
`;
