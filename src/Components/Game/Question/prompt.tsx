import React from 'react'
import styled from "styled-components/native"
import { colors, lighten10l } from '../../../lib/colors'
import { Animated } from "react-native"

export interface Props {
  ref: React.RefObject<Prompt>,
  prompt: any[],
  secondaryPrompt: any[]
}

interface State {}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  } 

  render() {
    const {
      prompt,
      secondaryPrompt
    } = this.props

    const text = (str: string, highlight: boolean, i: number) => <Text
      key={i}
      highlight={highlight}>
      {str + (["?",".",",",";"].indexOf(str) > 0 ? "" : " ")}
    </Text>

    const convertToText = (arr: any[]) => arr
      .map((p, i) => text(p.value as string, p.highlight as boolean, i))

    const prompts = secondaryPrompt
      ? [
          convertToText(this.props.prompt),
          convertToText([{ value: "\n" }]),
          convertToText([{ value: "\n" }]),
          convertToText(this.props.secondaryPrompt)
        ]
      : convertToText(this.props.prompt)

    return (
      <ContainerView>
        <Text
          highlight={false}>
          {prompts}
        </Text>
      </ContainerView>
    )
  }
}

const ContainerView = styled.View`
  flex: 2;
  width: 100%;
  justify-content: center;
`;

interface TextProps {
  highlight: boolean
}

const Text = styled.Text`
  text-align: center;
  font-size: 20px;
  font-family: ${(p: TextProps) => p.highlight ? "BrandonGrotesque-Bold" : "BrandonGrotesque-Regular"};
  color: ${(p: TextProps) => p.highlight ? colors.yellow : "black"};
`;
