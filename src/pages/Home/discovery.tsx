import { useContext, useEffect, useState } from 'react'
import { QUERY_HEADER, generateLocalTime, refreshToken } from '../../utils'
import React from 'react'
import './index.css'
import { PlayerContext } from '../../components/PlayerProvider'

interface IRecommendData {
  recommendation: string
  eid: string
  pid: string
  title: string
  description: string
  cover: string
  podcast: string
  media: string
}

interface IEditorPickData {
  eid: string
  pid: string
  title: string
  comment: string
  comment_author: string
  cover: string
  podcast: string
  media: string
}

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4 p-4">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 w-full items-center justify-center p-2"
        >
          <div className="w-52">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28 mt-2"></div>
            <div className="skeleton h-4 w-full mt-2"></div>
            <div className="skeleton h-4 w-full mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const RecommendList = React.memo(
  ({ recommendList }: { recommendList: IRecommendData[] }) => {
    const { startPlayer } = useContext(PlayerContext)
    return (
      <>
        {recommendList.map((cell) => (
          <div
            className="card card-side bg-base-100 shadow-xl w-1/3 h-64 m-4"
            key={cell.eid}
          >
            <img
              src={cell.cover}
              alt={cell.title}
              className="img-height w-52 p-2"
            />
            <div className="card-body gap-0 p-1 m-1">
              <div className="badge badge-neutral mt-2">{cell.podcast}</div>
              <h2 className="card-title text-base mt-2">{cell.title}</h2>
              <div
                className="line-clamp-4 text-sm mt-2"
                title={cell.description as string}
              >
                {cell.description}
              </div>
              <div className="badge badge-primary badge-outline mt-2">
                {cell.recommendation}
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    startPlayer({ title: cell.title, media: cell.media })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-2 14.5l6-4.5l-6-4.5z"
                    />
                  </svg>
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }
)

const EditorPickList = React.memo(
  ({ pickList }: { pickList: IEditorPickData[] }) => {
    const { startPlayer } = useContext(PlayerContext)

    return (
      <>
        {pickList.map((cell) => (
          <div
            className="card card-side bg-base-100 shadow-xl w-1/3 h-56 m-4"
            key={cell.eid}
          >
            <img
              src={cell.cover}
              alt={cell.title}
              className="img-height w-52 p-2"
            />
            <div className="card-body gap-0 flex flex-column justify-between p-1 m-1">
              <div>
                <div className="badge badge-neutral mt-2">{cell.podcast}</div>
                <h2 className="card-title text-base mt-2">{cell.title}</h2>
                <div
                  className="bg-base-200 p-2 mt-2"
                  title={cell.comment as string}
                >
                  <div className="line-clamp-4 text-sm ">
                    {cell.comment_author}:{cell.comment}
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end mt-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    startPlayer({ title: cell.title, media: cell.media })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-2 14.5l6-4.5l-6-4.5z"
                    />
                  </svg>
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }
)

const Discovery = () => {
  const [dataLoading, setDataLoading] = useState(false)

  const [recommendList, setRecommendList] = useState<IRecommendData[]>([])

  const [editorPickList, setEditorPickList] = useState<IEditorPickData[]>([])

  useEffect(() => {
    setDataLoading(true)
    getDiscovery()
  }, [])

  const getDiscovery = () => {
    const data = {
      returnAll: 'false',
    }

    const options = {
      method: 'POST',
      headers: {
        ...QUERY_HEADER,
        'x-jike-access-token':
          localStorage.getItem('x-jike-access-token') || '',
        'Local-Time': generateLocalTime(),
      },
      body: JSON.stringify(data),
    }

    fetch('/api/v1/discovery-feed/list', options)
      .then((res) => {
        if (res.status === 401) {
          refreshToken(getDiscovery)
        } else {
          return res.json()
        }
      })
      .then((res) => {
        handleDiscoverData(res)
      })
      .finally(() => {
        setDataLoading(false)
      })
  }

  const handleDiscoverData = (data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    loadMoreKey?: string
  }): void => {
    //和你兴趣相同的人也在听
    const recommendData = data.data.find(
      (cell) => cell.type === 'DISCOVERY_EPISODE_RECOMMEND'
    )
    if (recommendData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultData = recommendData.data.target.map((cell: any) => {
        return {
          recommendation: cell.recommendation, //推荐原因
          eid: cell.episode.eid, //音频ID
          pid: cell.episode.pid, //专辑ID
          title: cell.episode.title, //音频标题
          description: cell.episode.description, //音频描述
          cover: cell?.episode?.image?.picUrl || cell?.image?.picUrl || cell.podcast?.image?.picUrl,
          podcast: cell.episode.podcast.title, //专辑信息
          media: cell.episode.media.source.url, //音频地址
        }
      })
      setRecommendList(resultData)
    }

    //编辑精选
    const editorPickData = data.data.find((cell) => cell.type === 'EDITOR_PICK')

    if (editorPickData) {
      const resultData = editorPickData.data.picks.map(
        (cell: {
          episode: {
            eid: string
            pid: string
            title: string
            podcast: { image: { picUrl: string }; title: string }
            media: { source: { url: string } }
          }
          comment: { text: string; author: { nickname: string } }
        }) => {
          return {
            eid: cell.episode.eid, //音频ID
            pid: cell.episode.pid, //专辑ID
            title: cell.episode.title, //音频标题
            comment: cell.comment.text, //音频评论
            comment_author: cell.comment.author.nickname, //评论作者
            cover: cell?.episode?.podcast?.image?.picUrl || cell?.image?.picUrl || cell.podcast?.image?.picUrl, //音频封面
            podcast: cell.episode.podcast.title, //专辑信息
            media: cell.episode.media.source.url, //音频地址
          }
        }
      )
      setEditorPickList(resultData)
    }
  }

  return (
    <>
      {dataLoading && <LoadingSkeleton />}
      {!dataLoading && (
        <div>
          <div className="text-xl font-bold ml-6 mt-4">
            和你兴趣相同的人也在听
          </div>
          <div className="flex flex-row">
            <RecommendList recommendList={recommendList} />
          </div>

          <div className="text-xl font-bold ml-6 mt-4">编辑精选</div>
          <div className="flex flex-row">
            <EditorPickList pickList={editorPickList} />
          </div>
        </div>
      )}
    </>
  )
}

export default Discovery
