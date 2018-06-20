export const colors = {
  yellow: '#FFC31A',
  green: '#32B368',
  green10l: '#4CCD82',
  blue: '#4B9AEC',
  blue10l: '#438cee',
  red: '#FD7274',
  red10l: '#FF7171',
  gray: '#828282',
  lightGray: '#d9d9d9',
  white: '#ffffff',
  transparent: 'transparent'
};

export const lighten10l = function(color: string):string  {
  switch (color) {
    case colors.blue: return colors.blue10l
    case colors.red: return colors.red10l;
    case colors.green: return colors.green10l;
    case colors.white: return colors.white;
    case colors.transparent: return colors.transparent;
    default: return "black"
  }
};
