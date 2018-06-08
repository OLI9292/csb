import React from 'react'
import styled from "styled-components/native"
import { colors, lighten10l } from '../../lib/colors'
import { Animated } from "react-native"

export interface Props {
  completion: number
}

interface State {
  animation: Animated.Value,
  width?: any
}

export default class ProgressBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      animation: new Animated.Value(0)
    }
  }

  componentWillReceiveProps(nextProps: Props) {    
    if (this.props.completion !== nextProps.completion) {
      this.animate(nextProps.completion)
    }
  }  

  animate(completion: number) {
    const toValue = (this.state.width || 0.5) * completion
    Animated.timing(this.state.animation, { toValue: toValue, duration: 500 }).start()
  }

  render() {
    return (
      <ContainerView>
        
        <Background
          onLayout={event => this.setState({ width: event.nativeEvent.layout.width })} />
        
        <Animated.View style={[{ width: this.state.animation }]}>
          <Progress />
        </Animated.View>
        
      </ContainerView>
    )
  }
}

const ContainerView = styled.View`
  flex: 8;
  justify-content: center;
  margin: 0px 25px;
`;

const Background = styled.View`
  height: 10px;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.lightGray};
`

const Progress = styled.View`
  height: 10px;
  margin-top: -10px;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.yellow};
`
