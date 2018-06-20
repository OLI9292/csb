export const imagePath = (str: string) =>
  "./assets/images/" + str + ".png"

export const chunk = (arr: any[], len: number) => {
  var chunks = [],
    i = 0,
    n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}

export const secondsDiff = (t1: Date, t2: Date): number =>
  Math.abs(t1.getTime() - t2.getTime()) / 1000