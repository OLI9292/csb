import { Navigation } from "react-native-navigation"

const LOG_SCREEN = false

import SoloScreen from "./src/Components/Solo"
import WelcomeScreen from "./src/Components/Onboarding/Welcome"
import SignUpScreen from "./src/Components/Onboarding/SignUp"
import MeScreen from "./src/Components/Me/index"
import GameScreen from "./src/Components/Game/index"

export function registerScreens(): void {
  Navigation.registerComponent("Solo", () => SoloScreen)
  Navigation.registerComponent("Welcome", () => WelcomeScreen)
  Navigation.registerComponent("SignUp", () => SignUpScreen)
  Navigation.registerComponent("Me", () => MeScreen)
  Navigation.registerComponent("Game", () => GameScreen)
}
