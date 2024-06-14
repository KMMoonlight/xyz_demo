import { useContext, useEffect, useRef, useState } from 'react'
import { PlayerContext } from './PlayerProvider'

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const { playerInfo } = useContext(PlayerContext)

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      setCurrentTime(currentTime)
      setProgress((currentTime / duration) * 100)
    }
  }

  useEffect(() => {
    if (playerInfo.media && playerInfo.title) {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [playerInfo])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="container w-[800px] p-4 fixed bottom-0 left-1/2 transform -translate-x-1/2">
      <div className="card bg-base-200 shadow-xl p-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-sm font-bold flex-1">
            {playerInfo.title || 'Pick one to play'}
          </h1>

          <div className="flex items-center space-x-4">
            {isPlaying ? (
              <button onClick={handlePause} className="btn btn-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m-32 272a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0Zm96 0a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0Z"
                  />
                </svg>
              </button>
            ) : (
              <button onClick={handlePlay} className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10 16.5v-9l6 4.5M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
                  />
                </svg>
              </button>
            )}
          </div>

          <audio
            ref={audioRef}
            src={playerInfo.media}
            onTimeUpdate={updateProgress}
            onLoadedMetadata={handleLoadedMetadata}
          />

          <div className="flex-1" />
        </div>

        <div className="flex items-center space-x-4 mb-2">
          <span>{formatTime(currentTime)}</span>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          ></progress>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
