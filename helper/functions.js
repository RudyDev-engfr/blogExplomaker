import { format, getDate, getHours, getMinutes, getMonth, getYear, parseISO } from 'date-fns'
import frLocale from 'date-fns/locale/fr'

import { EVENT_TYPES } from './constants'

/**
 * Return consistent timestamp from Firestore
 * @param arrayOfTimestamps Can be one element or an array of elements
 * @param {string} formatStr Optionnal
 * @returns {array} Date or Array of dates
 */
export function rCTFF(arrayOfTimestamps, formatStr) {
  let timestamps = []
  let tempArrayOfTimestamps = arrayOfTimestamps
  let isArray = true
  if (!Array.isArray(arrayOfTimestamps)) {
    isArray = false
    tempArrayOfTimestamps = [arrayOfTimestamps]
  }

  tempArrayOfTimestamps.forEach(timestamp => {
    let tempTimestamp
    if (typeof timestamp !== 'string' && 'toDate' in timestamp) {
      tempTimestamp = timestamp.toDate()
    } else if (typeof timestamp === 'string') {
      tempTimestamp = parseISO(timestamp)
    } else {
      tempTimestamp = new Date(timestamp.seconds * 1000)
    }
    timestamps.push(tempTimestamp)
  })

  if (formatStr) {
    timestamps = timestamps.map(timestamp => format(timestamp, formatStr, { locale: frLocale }))
  }

  if (!isArray) {
    return timestamps[0]
  }
  return timestamps
}

export function arrayShuffle(array) {
  const tempArray = array
  let m = array.length
  let t
  let i

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    m -= 1
    i = Math.floor(Math.random() * m)
    // And swap it with the current element.
    t = tempArray[m]
    tempArray[m] = tempArray[i]
    tempArray[i] = t
  }

  return tempArray
}

export function returnFileSize(number) {
  if (number < 1024) {
    return `${number} octets`
  }
  if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} Ko`
  }
  if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} Mo`
  }
}

export function filterObjectByValue(object, value, notEqual = false) {
  return Object.fromEntries(
    Object.entries(object).filter(([, currentValue]) => {
      if (notEqual) {
        return currentValue !== value
      }
      return currentValue === value
    })
  )
}

/**
 * Return icon from Firebase Storage
 * @param {string} iconName
 * @param {bool} isActive
 */
export function findGoogleMarker(iconName, isActive) {
  let iconSrc =
    'https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/googleMapsIcons%2F'
  switch (iconName) {
    case 'accommodation':
      iconSrc += isActive
        ? 'accomodationActive.svg?alt=media&token=43d67cbc-c8aa-42d9-b723-cbba07e6d68c'
        : 'accomodationInactive.svg?alt=media&token=2bae343d-2fc4-484e-a18a-2daf0b0e06a9'
      break
    case 'flight':
      iconSrc += isActive
        ? 'flightActive.svg?alt=media&token=170b4e7a-c480-43ce-b021-68b5a04001b1'
        : 'flightInactive.svg?alt=media&token=7ea670d3-a2c4-49e1-a7c6-69c14364e170'
      break
    case 'explore':
      iconSrc += isActive
        ? 'exploActive.svg?alt=media&token=7d18fafa-89a4-4e43-8d5e-9bd75bb4b9d1'
        : 'exploInactive.svg?alt=media&token=d58dc429-ff6a-415b-8374-bffe8d54fe3c'
      break
    case 'transport':
      iconSrc += isActive
        ? 'transportActive.svg?alt=media&token=f9248adf-29d6-40f5-b8c1-42e6e9c4408d'
        : 'transportInactive.svg?alt=media&token=0b38c303-8694-4d2a-b536-e43e6415418a'
      break
    case 'restaurant':
      iconSrc += isActive
        ? 'restaurantActive.svg?alt=media&token=f4ec38eb-7946-464e-858d-ac1379fc854a'
        : 'restaurantInactive.svg?alt=media&token=6b9a148a-3f8f-47d3-851f-bd17532c3f08'
      break
    default:
      break
  }
  return iconSrc
}

export function onlyUnique(array) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}

export function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}

export function getEventStartDate(event) {
  // eslint-disable-next-line default-case
  switch (event.type) {
    case EVENT_TYPES[0]:
      return rCTFF(event.arrivalDateTime)
    case EVENT_TYPES[1]:
      return rCTFF(event.flights[0].date)
    case EVENT_TYPES[2]:
      return rCTFF(event.startTime)
    case EVENT_TYPES[3]:
      return rCTFF(event.transports[0].startDateTime)
    case EVENT_TYPES[4]:
      return rCTFF(event.startTime)
  }
}

/**
 * Creates a new Date object without time offset
 * @param {string} date
 * @returns {string}
 */
export function removeUTCOffset(date) {
  const tempDate = date

  return new Date(
    Date.UTC(
      getYear(tempDate),
      getMonth(tempDate),
      getDate(tempDate),
      getHours(tempDate),
      getMinutes(tempDate)
    )
  ).toISOString()
}

/**
 * Get the timezone informations for a given location with a given date
 * @async
 * @function getTimezone
 * @param {number} lat
 * @param {number} lng
 * @param {number} timestamp
 * @typedef {Object} returnValue
 * @property {number} returnValue.dstOffset
 * @property {number} returnValue.rawOffset
 * @property {status} returnValue.status
 * @property {string} returnValue.timeZoneId
 * @property {string} returnValue.timeZoneName
 * @returns {returnValue}
 * @example <caption>Example usage</caption>
 * const timezoneResponse = await getTimezone(39.6034810, -119.6822510, 1331161200)
 * const timezoneInfos = await timezoneResponse.json()
 * // returns {
 * //   "dstOffset": 0,
 * //   "rawOffset": -28800,
 * //   "status": "OK",
 * //   "timeZoneId": "America/Los_Angeles",
 * //   "timeZoneName": "Pacific Standard Time",
 * // }
 */
export async function getTimezone(lat, lng, timestamp) {
  const config = {
    method: 'GET',
    headers: {},
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=AIzaSyCKC9_XX60E1at2qp_90SU07-d-22pDydM`,
    config
  )

  return response
}
