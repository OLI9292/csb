export const imagePath = (str: string) => "./assets/images/" + str + ".png"

export const secondsDiff = (t1: Date, t2: Date): number => Math.abs(t1.getTime() - t2.getTime()) / 1000

export const cmpQuestionIdentifiers = (a: any, b: any) => {
  var i, diff
  var regExStrip0 = /(\.0+)+$/
  var segmentsA = a.identifier.replace(regExStrip0, "").split(".")
  var segmentsB = b.identifier.replace(regExStrip0, "").split(".")
  var l = Math.min(segmentsA.length, segmentsB.length)

  for (i = 0; i < l; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10)
    if (diff) {
      return diff
    }
  }
  return segmentsA.length - segmentsB.length
}
