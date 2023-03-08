import crypto from "crypto"

const randomInt = crypto?.randomInt || ((int) => Math.floor(Math.random() * int));

export function randomBase36(length: number) {
  let entropy = ""

  while (entropy.length < length)
    entropy = entropy + randomInt(36).toString(36)

  return entropy
}
