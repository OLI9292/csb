import React from "react"
import renderer from "react-test-renderer"

import Game from "../Game"

it("renders correctly with defaults", () => {
  const game = renderer.create(<Game questions={[]} navigator={null} />).toJSON()
  expect(game).toMatchSnapshot()
})
