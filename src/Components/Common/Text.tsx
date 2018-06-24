import styled from "styled-components/native"
import { colors } from "../../lib/colors"

interface Props {
  margin?: string
  error?: boolean
  color?: string
  textAlign?: string
}

const Text = styled.Text`
  font-family: BrandonGrotesque-Regular;
  font-size: 16px;
  text-align: ${(p: Props) => (p.error ? "center" : p.textAlign || "left")};
  margin: ${(p: Props) => p.margin || "0px"};
  color: ${(p: Props) => (p.error ? colors.red : p.color || "black")};
`

const LText = Text.extend`
  font-size: 18px;
`

const XLText = Text.extend`
  font-size: 20px;
`

const XXLText = Text.extend`
  font-size: 24px;
`

export default {
  m: Text,
  l: LText,
  xl: XLText,
  xxl: XXLText,
}
