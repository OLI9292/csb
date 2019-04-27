import React from "react"
import { Component } from "react"
import { Navigation } from "react-native-navigation"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { registerScreens } from "./screens"

import { Platform, StyleSheet, Text, View } from "react-native"

// Register all of the app's screens
registerScreens()

type NavBarIcons = {
  sword: any
  emoticon: any
  stadium: any
}

async function prepareIcons(): Promise<NavBarIcons> {
  try {
    const [sword, emoticon, stadium] = await Promise.all([
      Icon.getImageSource("sword", 30),
      Icon.getImageSource("emoticon", 30),
      Icon.getImageSource("stadium", 30),
    ])
    return { sword, emoticon, stadium }
  } catch (error) {
    console.log(error)

    return { sword: "?", emoticon: "?", stadium: "?" }
  }
}

Navigation.events().registerAppLaunchedListener(async () => {
  const icons = await prepareIcons()

  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            component: {
              name: "Solo",
              id: "Solo",
              options: {
                bottomTab: {
                  icon: icons.sword,
                },
              },
            },
          },
          {
            component: {
              name: "Me",
              id: "Me",
              options: {
                bottomTab: {
                  icon: icons.emoticon,
                },
              },
            },
          },
          {
            component: {
              name: "Me",
              id: "Me",
              options: {
                bottomTab: {
                  icon: icons.stadium,
                },
              },
            },
          },
        ],
      },
    },
  })
})
