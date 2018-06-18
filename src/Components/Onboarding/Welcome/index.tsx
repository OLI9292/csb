import React from 'react'
import styled from "styled-components/native"

import { colors, lighten10l } from '../../../lib/colors'
import Button from "../../Common/Button"
import Text from "../../Common/Text"

export interface Props {
  navigator: any
}

interface State {}

export default class Welcome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  continue() {
    this.props.navigator.showModal({
      screen: "example.SignUpScreen",
      animationType: "none",
      passProps: { step: "email" },
      navigatorStyle: {
        navBarHidden: true
      }
    })    
  }
  
  render() {
    return (
      <ContainerView>
        <WordcraftHeader>
          WORDCRAFT
        </WordcraftHeader>

        <ImageContainer>
          <Image
            source={require("../../../lib/assets/images/animals.png")} />
        </ImageContainer>
 
        <BottomContainer>
          <Text.l>
            Learn the world.
          </Text.l>

        <Button
          text={"get started"}
          color={colors.green}
          onPress={this.continue.bind(this)} />   
        </BottomContainer>
      </ContainerView>
    )
  }
}

const WordcraftHeader = styled.Text`
  font-family: BrandonGrotesque-Bold
  font-size: 32px
  color: ${colors.yellow}
  letter-spacing: 1px
  flex: 1
`

const ImageContainer = styled.View`
  flex: 3
  align-self: stretch
  padding: 10px 0px
`

const Image = styled.Image`
  flex: 1
  max-height: 100%
  max-width: 100%
  height: auto
  width: auto
`

const ContainerView = styled.View`
  flex: 1
  align-items: center
  height: 70%
  margin-top: 15%
`

const BottomContainer = styled.View`
  flex: 2
  align-items: center
  justify-content: space-evenly
`
