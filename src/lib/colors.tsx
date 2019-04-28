export const colors = {
  navBlue: "#3F81E6",
  lightNavBlue: "#C0D9F7",
  navBlueBg: "#CCECFA",
  mainBlue: "#3F81E6",
  lightBlue: "#72CAF1",
  blue: "#4B9AEC",
  blue10l: "#438cee",
  green: "#32B368",
  green10l: "#48b978",
  yellow: "#f3be5b",
  warmYellow: "#FFC31A",
  brightYellow: "#fdce4a",
  yellow10l: "#f4c46b",
  black: "#000000",
  black10l: "#191919",
  red: "#FD7274",
  red10l: "#FF7171",
  darkGray: "#686868",
  gray3: "#6b6b6b",
  mediumGray: "#BDBEC0",
  gray2: "#58595B",
  brown: "#AF7803",
  gray: "#6D6D6D",
  gray10l: "#8e8e8e",
  mediumLGray: "#BCBEC0",
  lightestGray: "#F2F2F2",
  eggshell: "#F8F8F8",
  lightGray: "#d9d9d9",
  lighterGray: "#a19f9f",
  gold: "#C98910",
  silver: "#A8A8A8",
  bronze: "#965A38",
  orange: "#FD7F38",
  orange10l: "#FF9952",
  purple: "#9b51e0",
  purple10l: "#a562e3",
  googleRed: "#DC4C3D",
  googleRed10l: "#df5d50",
  facebookBlue: "#4862A3",
  facebookBlue10l: "#5a71ac",
  transparent: "rgba(0,0,0,0)",
  lightGreen: "#98FB98",
  white: "#ffffff",
  paleBlue: "#D3EFFB",
  babyBlue: "#A6EAFF",
  darkBabyBlue: "#6ECAF0",
  honey: "#BF430C",
  limeGreen: "#43DE80",
  darkLimeGreen: "#29A85C",
  extraDarkLimeGreen: "#075A33",
}

export const lighten10l = function(color: string): string {
  switch (color) {
    case colors.blue:
      return colors.blue10l
    case colors.red:
      return colors.red10l
    case colors.green:
      return colors.green10l
    case colors.white:
      return colors.white
    case colors.transparent:
      return colors.transparent
    default:
      return "black"
  }
}
