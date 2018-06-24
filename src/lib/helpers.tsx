export const imagePath = (str: string) => "./assets/images/" + str + ".png"

export const secondsDiff = (t1: Date, t2: Date): number => Math.abs(t1.getTime() - t2.getTime()) / 1000
