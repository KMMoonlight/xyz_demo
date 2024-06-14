import { createContext, useState } from 'react'

export const PlayerContext = createContext(
  {} as {
    playerInfo: { title: string; media: string }
    startPlayer: (mediaInfo: { title: string; media: string }) => void
  }
)

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerInfo, setPlayerInfo] = useState({
    title: '',
    media: '',
  })

  const startPlayer = (mediaInfo: { title: string; media: string }) => {
    setPlayerInfo(mediaInfo)
  }

  return (
    <PlayerContext.Provider value={{ playerInfo, startPlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}
