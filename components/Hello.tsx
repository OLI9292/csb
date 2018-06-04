// components/Hello.tsx
import React from "react"
import { Button, StyleSheet, Text, View } from "react-native"

export interface Props {}

interface State {}

export default class Hello extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log("hiiii")
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.greeting}>
          Hello Hello Hello
        </Text>
      </View>
    )
  }
}

// styles

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: 200
  },
  buttons: {
    flexDirection: "row",
    minHeight: 70,
    alignItems: "stretch",
    alignSelf: "center",
    borderWidth: 5
  },
  button: {
    flex: 1,
    paddingVertical: 0
  },
  greeting: {
    color: "#999",
    fontWeight: "bold"
  }
})
