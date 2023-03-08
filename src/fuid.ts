// FUID - human-Friendly Unique ID

import crypto from "crypto"

const randomInt = crypto?.randomInt || ((int) => Math.floor(Math.random() * int));

function randomBase36(length: number) {
  let entropy = ""

  while (entropy.length < length)
    entropy = entropy + randomInt(36).toString(36)

  return entropy
}

export function fuid(randLength = 4) {
  return encode({ randLength })
}

export function encode(options = {}) {
  const { timestamp, randValue, randStr, randLength } = options || {} as any

  const unixTimestamp = timestamp || Date.now()

  const utcDatetime = new Date(unixTimestamp)

  const year = `${utcDatetime.getUTCFullYear()}`.slice(-2) // 2023 -> 23
  const month = `${utcDatetime.getUTCMonth() + 1}`.padStart(2, "0") // "01" ... "12"
  const day = `${utcDatetime.getUTCDate()}`.padStart(2, "0") // "01" ... "31"

  const todayDate = new Date(`20${year}-${month}-${day}`)

  const milisecondsSinceMidnight = unixTimestamp - todayDate.getTime()

  const milisecondsBase36 = milisecondsSinceMidnight.toString(36).padStart(6, "0")

  const entropy = randStr || (randValue && randValue.toString(36)) || randomBase36(randLength || 4) // 36^4 = 1/1,679,616

  const _fuid = `${year}${month}${day}-${milisecondsBase36}-${entropy}`

  return _fuid
}

export function decode(_fuid: string) {
  const [date, milisecondsAtDay, randStr] = _fuid.split('-')

  if (!date || !milisecondsAtDay || !randStr)
    throw new Error("string provided is not a fuid")

  const isodate = `20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4)}`

  const timestamp = new Date(isodate).getTime() + parseInt(milisecondsAtDay, 10);

  return { timestamp, randStr }
}
