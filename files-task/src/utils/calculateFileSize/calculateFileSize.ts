const KILO_BYTE = 1024
const MEGA_BYTE = 1024 * KILO_BYTE

const limitDecimals = (number: number) => number.toFixed(2)

const calculateFileSize = (size: number) => {
  if (size > MEGA_BYTE) {
    return `${limitDecimals(size / MEGA_BYTE)} MB`
  } else if (size > KILO_BYTE) {
    return `${limitDecimals(size / KILO_BYTE)} KB`
  } else {
    return `${size} Bytes`
  }
}

export default calculateFileSize
