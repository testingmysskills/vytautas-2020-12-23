import calculateFileSize from './calculateFileSize'

it('returns size in Bytes correctly', () => {
  expect(calculateFileSize(500)).toEqual('500 Bytes')
})

it('returns size in Kilo Bytes correctly', () => {
  expect(calculateFileSize(500 * 1024)).toEqual('500.00 KB')
})

it('returns size in Mega Bytes correctly', () => {
  expect(calculateFileSize(500 * 1024 * 1024)).toEqual('500.00 MB')
})
