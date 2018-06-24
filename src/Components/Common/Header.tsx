import styled from "styled-components/native"
import { colors } from "../../lib/colors"

interface HeaderProps {
  center: boolean
}

const Header = styled.Text`
  font-family: BrandonGrotesque-Bold;
  font-size: 16px;
  letter-spacing: 1px;
  text-align: ${(p: HeaderProps) => (p.center ? "center" : "left")};
`

const SubHeader = Header.extend`
  font-size: 14px;
  font-family: BrandonGrotesque-Regular;
  color: ${colors.gray};
`

export default {
  m: Header,
  sub: SubHeader,
}
