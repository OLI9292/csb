import React from 'react'
import { Component } from 'react'
import styled from "styled-components"
import { colors, lighten10l } from '../../lib/colors';

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-family: BrandonGrotesque-Bold;
`;

interface TouchableHighlightProps {
  _margin: string,
  color: string
}


const StyledButton = styled.TouchableHighlight`
  margin: ${(p: TouchableHighlightProps) => p._margin};
  padding: 10px;
  background-color: ${(p: TouchableHighlightProps) => p.color};
  border-radius: 30px;
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  margin?: string,
  disabled?: boolean,
  color: string,
  text: string,
  onPress: () => void
}

interface State {}

export default class Button extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <StyledButton
        disabled={this.props.disabled}
        _margin={this.props.margin || "0px"}
        color={this.props.color}
        underlayColor={lighten10l(this.props.color)}
        onPress={this.props.onPress.bind(this)}>
        <ButtonText>
          {this.props.text.toUpperCase()}
        </ButtonText>
      </StyledButton>
    );
  }
}
