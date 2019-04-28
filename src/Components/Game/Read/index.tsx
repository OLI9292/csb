import * as React from "react"
import { Image } from "react-native"

import Markdown from "react-native-markdown-renderer"
import styled from "styled-components/native"

import Text from "../../Common/Text"
import FlexedView from "../../Common/FlexedView"
import Button from "../../Common/Button"
import { colors } from "../../../lib/colors"

export interface Read {
  value: string
  imgSrc?: string
}

interface Props {
  data: Read
  nextQuestion: () => void
}

export default class ReadComponent extends React.Component<Props, any> {
  public render() {
    const { imgSrc, value } = this.props.data

    const text = value.startsWith('{"markdown":') ? (
      <Markdown>{JSON.parse(value).markdown}</Markdown>
    ) : (
      <Text.m>{value}</Text.m>
    )

    return (
      <View>
        {imgSrc && (
          <FlexedView>
            <Image source={{ uri: `https://s3.amazonaws.com/${imgSrc}` }} />
          </FlexedView>
        )}

        {text}

        <FlexedView justifyContent="center">
          <Button color={colors.blue} text="Next" onPress={this.props.nextQuestion.bind(this)} />
        </FlexedView>
      </View>
    )
  }
}

const View = styled.View`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  flex: 8;
  padding: 20px;
`
