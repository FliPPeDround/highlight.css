declare global {
  interface CSS {
    highlights: highlights
  }
}

interface highlights {
  set: () => void
  get: () => void
}
