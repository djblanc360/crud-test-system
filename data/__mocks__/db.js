let mockData = []

export const read = () => mockData

export const write = (data) => {
  mockData = data
}

export const clear = () => {
  mockData = []
}

export const __setMockData = (data) => {
  mockData = data
}
