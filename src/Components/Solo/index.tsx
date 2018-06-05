import React from 'react'
import { Component } from 'react'
import styled from "styled-components/native"

import { colors, lighten10l } from '../../lib/colors'
import Button from '../Common/Button'

export interface Props {
  navigator: any
}

interface State {}

export default class Solo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    /*this.props.navigator.showModal({
      screen: "example.WelcomeScreen",
      animationType: "none",
      navigatorStyle: {
        navBarHidden: true
      }
    });*/
  }

  startGame() {
    this.props.navigator.showModal({
      screen: "example.SoloScreen",
      animationType: "none",
      navigatorStyle: {
        navBarHidden: true
      }
    });
  }
  
  render() {
    return (
      <ContainerView>
        <Button
          text={"play demo"}
          color={colors.blue}
          onPress={this.startGame.bind(this)}>
        </Button>
      </ContainerView>
    );
  }
}

const ContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
