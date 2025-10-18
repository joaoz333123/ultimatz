import '@testing-library/jest-dom'

jest.mock('next/link', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ children, ...props }) =>
      React.createElement('a', props, children),
  }
})

jest.mock('next/image', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: (props) => React.createElement('img', props),
  }
})
