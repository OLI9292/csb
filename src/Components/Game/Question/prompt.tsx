import React from "react"
import { Image } from "react-native"
import styled from "styled-components/native"
import { isString } from "lodash"

import FlexedView from "../../Common/FlexedView"
import Text from "../../Common/Text"

import { PromptPart } from "../../../Models/question"

import { colors } from "../../../lib/colors"

export interface Props {
  prompt: PromptPart[]
  hints: string[]
  formatAsCode: boolean
  TYPE: string
  type: string
  feedback?: string
  isInteractive?: boolean
}

const isPunc = (char?: string): boolean => char !== undefined && [".", ",", ")", "'", ";"].indexOf(char) > -1

export default class Prompt extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  render() {
    const { formatAsCode, isInteractive, feedback, TYPE, hints, type } = this.props

    let prompt = this.props.prompt

    const showHintUnderPrompt = hints.indexOf("displayPromptMetadata") > -1
    const isImage = TYPE.includes("Image") && TYPE.includes("reverse") && isString(prompt[0].value)

    const LINEBREAK = "<br />"
    const HIDE = "*"

    if (feedback) {
      prompt = prompt.concat(...[{ value: LINEBREAK }, { value: feedback }])
    } else if (isInteractive) {
      prompt = prompt.concat(...[{ value: LINEBREAK }, { value: HIDE }])
    }

    const promptPart = (p: PromptPart, i: number): any => {
      if (p.value === LINEBREAK) return <br key={i} />

      const style: any = {}
      if (p.value === HIDE) style.opacity = 0
      if (["What is the output", "Oops, that's"].some(str => (p.value || "").includes(str))) {
        style.whiteSpace = "normal"
        style.color = colors.darkGray
        style.fontSize = "1.75em"
      }

      return (
        <Span style={style} hide={p.hide} key={i} highlight={p.highlight}>
          {p.value}
          {showHintUnderPrompt && <HintSpan>{p.hint}</HintSpan>}
        </Span>
      )
    }

    let promptValue = prompt.map(promptPart)

    if (type !== "word") {
      promptValue = promptValue.reduce((prev: any[], curr: any, i: number) => [
        prev,
        isPunc(prompt[i].value) ? "" : " ",
        curr,
      ])
    }

    // whiteSpace: formatAsCode ? "pre" : "normal",
    return isImage ? (
      <FlexedView justifyContent="center" style={{ flexGrow: 1, flexBasis: 0 }}>
        <Image source={{ uri: `https://s3.amazonaws.com/${prompt[0].value}` }} />
      </FlexedView>
    ) : (
      <PromptView>
        <Text.m style={{ position: "relative", textAlign: formatAsCode ? "left" : "center" }}>{promptValue}</Text.m>
      </PromptView>
    )
  }
}

const PromptView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`

interface SpanProps {
  highlight?: boolean
  hide?: boolean
}

const Span = styled.Text`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.black)};
  position: relative;
`

const HintSpan = styled.Text`
  position: absolute;
  bottom: -15px;
  font-size: 0.5em;
  left: 50%;
  transform: translateX(-50%);
  color: ${colors.darkGray};
`
