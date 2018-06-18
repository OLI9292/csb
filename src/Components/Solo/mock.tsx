import _ from "underscore"

const mock3 = {
  choices: [
  [
  {
  _id: "5b1c71a2c970410020fa1fb6",
  value: "present",
  correct: true
  },
  {
  _id: "5b1c71a2c970410020fa1fb5",
  value: "imperfect",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb4",
  value: "future",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb3",
  value: "perfect",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb2",
  value: "pluperfect",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb1",
  value: "future perfect",
  correct: false
  }
  ],
  [
  {
  _id: "5b1c71a2c970410020fa1fba",
  value: "indicative",
  correct: true
  },
  {
  _id: "5b1c71a2c970410020fa1fb9",
  value: "subjunctive",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb8",
  value: "imperative",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fb7",
  value: "infinitive",
  correct: false
  }
  ],
  [
  {
  _id: "5b1c71a2c970410020fa1fc0",
  value: "1st person singular",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fbf",
  value: "2nd person singular",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fbe",
  value: "3rd person singular",
  correct: true
  },
  {
  _id: "5b1c71a2c970410020fa1fbd",
  value: "1st person plural",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fbc",
  value: "2nd person plural",
  correct: false
  },
  {
  _id: "5b1c71a2c970410020fa1fbb",
  value: "3rd person plural",
  correct: false
  }
  ],
  [
  {
  _id: "5b1c71a2c970410020fa1fc2",
  value: "active",
  correct: true
  },
  {
  _id: "5b1c71a2c970410020fa1fc1",
  value: "passive",
  correct: false
  }
  ]
  ],
  prompt: [
  {
  _id: "5b1c71a2c970410020fa1faf",
  value: "ID",
  highlight: false
  },
  {
  _id: "5b1c71a2c970410020fa1fae",
  value: "and",
  highlight: false
  },
  {
  _id: "5b1c71a2c970410020fa1fad",
  value: "translate",
  highlight: false
  },
  {
  _id: "5b1c71a2c970410020fa1fac",
  value: "the",
  highlight: false
  },
  {
  _id: "5b1c71a2c970410020fa1fab",
  value: "following",
  highlight: false
  },
  {
  _id: "5b1c71a2c970410020fa1faa",
  value: "word:",
  highlight: false
  }
  ],
  secondaryPrompt: [
  {
  _id: "5b1c71a2c970410020fa1fb0",
  value: "timet",
  highlight: false
  }
  ],
  _id: "5b1c71a2c970410020fa1fa9",
  identifier: "1.1.1",
  category: "latin textbook",
  subCategory: "unit 1 morphology review",
  __v: 0
  }

const mock2 = {
  choices: [ ],
  prompt: [
  {
  _id: "5b23d7d97366a400208368e2",
  value: "What",
  highlight: false
  },
  {
  _id: "5b23d7d97366a400208368e1",
  value: "is",
  highlight: false
  },
  {
  _id: "5b23d7d97366a400208368e0",
  value: "this",
  highlight: false
  },
  {
  _id: "5b23d7d97366a400208368df",
  value: "thing?",
  highlight: false
  }
  ],
  secondaryPrompt: [
  {
  _id: "5b23d7d97366a400208368e3",
  value: "<omnivore.png>",
  highlight: false
  }
  ],
  _id: "5b23d7d97366a400208368de",
  choiceTreeJson: '{"id":"5b202dee58e9ae00204139e5","tree":{"choiceSetId":"5b202d5d58e9ae00204139e2","branches":{"carnivore":{"choiceSetId":"5b201a6439c788002051cadc"},"omnivore":{"choiceSetId":"5b201a6439c788002051cadc","branches":{"biped":{},"triped":{}}}}},"answers":["Biological Classification","omnivore","biped"]}',
  identifier: "1.1.1",
  category: "oliver test",
  subCategory: "test",
  __v: 0
  }


const shortPrompt = "Find the treasure in the passage below:"

const longPrompt = "No, as of Jest 20, snapshots in Jest are not automatically written when Jest is run in a CI system without explicitly passing --updateSnapshot. It is expected that all snapshots are part of the code that is run on CI and since new snapshots automatically pass, they should not pass a test run on a CI system. It is recommended to always commit all snapshots and to keep them in version control."

const prompt = [
  {
    value: shortPrompt,
    highlighted: false
  }
]
const secondaryPrompt = [
  {
    value: longPrompt,
    highlighted: false
  }
]

const shortChoice = {
  value: "grass",
  correct: true
}

const mediumChoice = {
  value: "The Knights of Camelot",
  correct: true
}

const longChoice = {
  value: "anticipatory dum/donec/antequam/priusquam clause proviso clause",
  correct: true
}

const choices = Array(3).fill(shortChoice)
  .concat(Array(6).fill(longChoice))
  .concat(Array(3).fill(mediumChoice))

export default [mock2]