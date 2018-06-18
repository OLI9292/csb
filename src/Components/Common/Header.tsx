import styled from "styled-components/native"
import { colors } from '../../lib/colors'

interface HeaderProps {
  center: boolean
}

const Header = styled.Text`
  font-family: BrandonGrotesque-Bold;
  font-size: 16px;
  text-align: ${(p: HeaderProps) => p.center ? "center" : "left"};
`;

export default {  
  m: Header
}
