import React from "react"
import { Component } from "react"
import styled from "styled-components/native"
import { colors, lighten10l } from "../../lib/colors"

interface ButtonTextProps {
  color: string
}

const ButtonText = styled.Text`
  color: ${(p: ButtonTextProps) => p.color};
  font-size: 14px;
  font-family: BrandonGrotesque-Bold;
`

interface TouchableHighlightProps {
  _margin: string
  color: string
  small: boolean
}

const StyledButton = styled.TouchableHighlight`
  margin: ${(p: TouchableHighlightProps) => p._margin};
  padding: 10px 15px;
  background-color: ${(p: TouchableHighlightProps) => p.color};
  border-radius: 30px;
  min-width: ${(p: TouchableHighlightProps) => (p.small ? "50px" : "150px")};
  display: flex;
  align-items: center;
  justify-content: center;
`

interface Props {
  margin?: string
  disabled?: boolean
  small?: boolean
  highlight?: boolean
  color: string
  text: string
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
        small={this.props.small || false}
        underlayColor={lighten10l(this.props.color)}
        onPress={this.props.onPress.bind(this)}
      >
        <ButtonText color={this.props.small ? (this.props.highlight ? colors.blue : colors.gray) : "white"}>
          {this.props.text.toUpperCase()}
        </ButtonText>
      </StyledButton>
    )
  }
}
