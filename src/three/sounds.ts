const trackSound = new Audio(`${import.meta.env.BASE_URL}sounds/track.mp3`)
trackSound.volume = 0.3
trackSound.loop = true

const houseSound = new Audio(`${import.meta.env.BASE_URL}sounds/knock.mp3`)
houseSound.volume = 1

export function setupTrackSound() {
  const startMusic = () => {
    trackSound.play()
    window.removeEventListener('click', startMusic)
  }
  window.addEventListener('click', startMusic)
}
export function playHouseSound() {
  houseSound.currentTime = 0
  houseSound.play()
}

export function disposeAudio() {
  trackSound.pause()
  trackSound.currentTime = 0

  houseSound.pause()
  houseSound.currentTime = 0
}