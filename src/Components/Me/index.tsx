import React from "react"
import { Component } from "react"
import styled from "styled-components/native"

import { getUser, logoutUser } from "../../Models/user"
import Text from "../Common/Text"
import Button from "../Common/Button"
import { colors } from "../../lib/colors"

export interface Props {
  navigator: any
}

interface State {
  user?: any
}

export default class Me extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentDidMount() {
    this.loadUser()
  }

  onNavigatorEvent(event: any) {
    this.loadUser()
  }

  loadUser = async () => {
    if (this.state.user) {
      return
    }
    const user = await getUser()
    user && this.setState({ user })
  }

  logout() {
    this.setState({ user: undefined })
    logoutUser()
    this.showWelcomeScreen()
  }

  showWelcomeScreen() {
    this.props.navigator.showModal({
      screen: "example.WelcomeScreen",
      animationType: "none",
      navigatorStyle: { navBarHidden: true },
    })
  }

  render() {
    const { user } = this.state

    if (!user) {
      return null
    }

    return (
      <ContainerView>
        <Text.l>{user.username}</Text.l>
        <Text.m color={colors.gray}>{user.email}</Text.m>

        <Button
          onPress={this.logout.bind(this)}
          margin={"10px 0px 0px 0px"}
          color={colors.white}
          small={true}
          text={"logout"}
        />
      </ContainerView>
    )
  }
}

const ContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
