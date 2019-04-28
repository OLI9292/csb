import * as React from "react"
import styled from "styled-components/native"
import { sample, isEqual } from "lodash"

import FlexedView from "../../Common/FlexedView"

import { AnswerPart } from "../../../Models/question"

import { colors } from "../../../lib/colors"

export interface Guess {
  correct: boolean
  buttonIdx: number
}

interface Props {
  answer: AnswerPart[]
  redHerrings: AnswerPart[]
  hide: boolean
  guess?: Guess
  isBetweenQuestions?: boolean
  guessed: (choice: string, buttonIdx: number) => void
  hints: string[]
  type: string
  id: string
  images: string[]
  choices: AnswerPart[]
}

interface State {
  imagePath?: string
}

const disabledColor = (buttonIdx: number, g: Guess): string =>
  buttonIdx === g.buttonIdx ? (g.correct ? colors.green : colors.red) : "white"

const imageOnCorrect = (type: string, images: string[]) => (!type.includes("to Image") ? sample(images) : undefined)

export default class Choices extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      imagePath: imageOnCorrect(this.props.type, this.props.images),
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { id, images, type } = nextProps
    if (isEqual(this.props.id, id)) return
    const imagePath = imageOnCorrect(type, images)
    this.setState({ imagePath })
  }

  public isSpell() {
    return this.props.type.indexOf("Chars") > -1
  }

  public isImage() {
    return this.props.type.includes("Word to Image") && !this.props.type.includes("reverse")
  }

  public render() {
    const { guess, hints, choices, isBetweenQuestions, type, hide } = this.props
    const { imagePath } = this.state

    console.log(choices)

    const choiceComponent = (choice: AnswerPart, i: number) => {
      const userGuessed = guess !== undefined
      const userGuessedCorrectly = userGuessed && guess!.correct
      const buttonGuessed = userGuessed && guess!.buttonIdx === i
      const disable = (userGuessed && !userGuessedCorrectly) || (userGuessedCorrectly && buttonGuessed)
      const bColor = disable ? disabledColor(i, guess!) : "white"

      const reverseHint = ["Root in Word to Definition", "Word to Complete Definition"].indexOf(type) > -1
      let opacities = [1, hints.indexOf("displayButtonMetadata") > -1 ? 1 : 0]
      if (reverseHint) opacities = opacities.reverse()

      return this.isImage() ? (
        <ImageChoice
          key={i}
          disabled={disable || isBetweenQuestions === true}
          borderColor={bColor}
          // onPress={() => this.props.guessed(choice.value!, i)}
          source={{ uri: "https://s3.amazonaws.com/" + choice.value }}
        />
      ) : (
        <ChoiceButton
          isSpell={this.isSpell()}
          disabled={disable || isBetweenQuestions === true}
          borderColor={bColor}
          onPress={() => this.props.guessed(choice.value!, i)}
          key={i}
        >
          <HintSpan opacity={opacities[0]}>{choice.value}</HintSpan>
          <HintSpan opacity={opacities[1]}>{choice.hint}</HintSpan>
        </ChoiceButton>
      )
    }

    const isWordToImageQuestion = type.includes("Word to Image") && !type.includes("reverse")

    const hideChoices = isBetweenQuestions === true && !isWordToImageQuestion

    const style: any = {
      flexGrow: 1,
      flexBasis: 0,
      justifyContent: "center",
    }

    if (hide) {
      style.opacity = 0
      style.pointerEvents = "none"
    }

    return (
      <FlexedView style={style}>
        {imagePath && <Image source={{ uri: `https://s3.amazonaws.com/${imagePath}` }} />}
        <ChoicesGridBox>{choices.map(choiceComponent)}</ChoicesGridBox>
      </FlexedView>
    )
  }
}

interface ContainerProps {
  count?: number
  hide: boolean
}

const ChoicesGridBox = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

interface ChoiceProps {
  disabled: boolean
  borderColor: string
  isSpell?: boolean
}

const ChoiceButton = styled.Text`
  border: 3px solid ${(p: ChoiceProps) => p.borderColor};
  border-radius: 20px;
  text-align: center
  height: 80%;
  background-color: white;
  width: 80%;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  padding: 15px 20px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;  
`

const ImageChoice = styled.Image`
  pointer-events: ${(p: ChoiceProps) => (p.disabled ? "none" : "auto")};
  border: 3px solid ${(p: ChoiceProps) => p.borderColor};
  max-height: 80%;
  max-width: 80%;
  width: auto;
  transition: border 0.5s;
  border-radius: 10px;
  height: auto;
  margin: 10px;
`

// style={{ display: isBetweenQuestions ? "block" : "none" }}
const Image = styled.Image`
  max-height: 100%;
  width: auto;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
`

interface HintSpanProps {
  opacity: number
}

const HintSpan = styled.Text`
  opacity: ${(p: HintSpanProps) => p.opacity};
`
