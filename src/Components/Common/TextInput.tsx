import React from 'react'
import { Component } from 'react'
import styled from "styled-components"
import { colors } from '../../lib/colors';

interface StyledProps {
  _margin?: string
}

const StyledTextInput = styled.TextInput`
  height: 40;
  borderBottomColor: black;
  borderBottomWidth: 1;
  margin: ${(p: StyledProps) => p._margin || "0px"};
  font-family: BrandonGrotesque-Regular;
  font-size: 16px;
`

export interface Props {
  margin: string,
  placeholder: string,
  text: string,
  onChangeText: (str: string) => void
}

interface State {}

export default class TextInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return <StyledTextInput
      autoFocus={true}
      _margin={this.props.margin}
      placeholder={this.props.placeholder}
      placeholderTextColor={colors.lightGray}
      onChangeText={this.props.onChangeText.bind(this)}
      value={this.props.text}
    />
  }
}
