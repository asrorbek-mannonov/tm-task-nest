import { set } from 'date-fns'

// helper function to generate value for @db.Time(6)
// column type value for postgresql
export const pgTime = (time: string, tz = 5) => {
  const [hours, minutes, milliseconds = 0] = time.split(':').map(Number)
  return set(new Date(), {
    hours: hours + tz,
    minutes,
    milliseconds,
  })
}

const tzoffset = new Date().getTimezoneOffset() * 60000
const localISOTime = new Date(Date.now() - tzoffset)

// export const startOfDay = (date: number | Date) => {};

export default localISOTime
