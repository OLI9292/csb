import styled from "styled-components/native"
import { colors } from "../../lib/colors"

interface HeaderProps {
  center: boolean
}

// font-family: BrandonGrotesque-Bold;
const Header = styled.Text`
  font-size: 16px;
  letter-spacing: 1px;
  text-align: ${(p: HeaderProps) => (p.center ? "center" : "left")};
`

// font-family: BrandonGrotesque-Regular;
const SubHeader = Header.extend`
  font-size: 14px;
  color: ${colors.gray};
`

export default {
  m: Header,
  sub: SubHeader,
}
