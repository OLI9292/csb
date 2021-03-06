import React from 'react'
import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  registerScreens,
  registerScreenVisibilityListener
} from './screens';

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Register all of the app's screens
registerScreens();
registerScreenVisibilityListener();

type NavBarIcons = {
  sword: any,
  emoticon: any,
  stadium: any
};

async function prepareIcons(): Promise<NavBarIcons> {
  try {
    const [sword, emoticon, stadium] = await Promise.all([
      Icon.getImageSource('sword', 30),
      Icon.getImageSource('emoticon', 30),
      Icon.getImageSource('stadium', 30)
    ]);
    return { sword, emoticon, stadium };
  } catch (error) {
    return { sword: "?", emoticon: "?", stadium: "?" }
  }
}

async function startApp(): Promise<void> {

  const icons = await prepareIcons();

  Navigation.startTabBasedApp({
    tabs: [
      {
        label: 'Solo',
        screen: 'example.SoloScreen',
        icon: icons.sword,
        selectedIcon: icons.sword,
        title: 'Solo'
      },
      {
        label: 'Me',
        screen: 'example.MeScreen',
        icon: icons.emoticon,
        selectedIcon: icons.emoticon,
        title: 'Me'
      },
      {
        label: 'Battle',
        screen: 'example.MeScreen',
        icon: icons.stadium,
        selectedIcon: icons.stadium,
        title: 'Battle'
      }
    ]
  });
}

startApp();
