import React from 'react'
import { Component } from 'react'
import styled from "styled-components/native"

export interface Props {
  navigator: any
}

interface State {}

export default class Me extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <ContainerView>
      </ContainerView>
    );
  }
}

const ContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
