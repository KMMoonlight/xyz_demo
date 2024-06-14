import { useEffect, useState } from 'react'
import { QUERY_HEADER, generateLocalTime, refreshToken } from '../../utils'
import mockData from './mock2.json'
import React from 'react'

interface ISubscription {
  eid: string
  pid: string
  title: string
  description: string
  cover: string
  podcast: string
  media: string
  playCount: number
  favoriteCount: number
}

const SubList = React.memo(
  ({ subDataList }: { subDataList: ISubscription[] }) => {
    return (
      <>
        {subDataList.map((cell) => (
          <div
            className="card card-side bg-base-100 shadow-xl box-width h-64"
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
              <div className="mt-2 flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M1023.84 604.56c.096-21.056-3.216-100.497-5.744-123.217c-29.12-260.752-240.752-450-503.184-450c-273.344 0-494.815 210.624-509.84 489.904c-.32 6.096-2.56 49.344-2.72 75.088l-.08 14.32C.96 616.575.16 622.687.16 628.991v278.656c0 46.88 38.128 85.008 85.008 85.008h86.288c46.88 0 85.023-38.128 85.023-85.008v-278.64c0-46.88-38.16-85.008-85.024-85.008h-86.32a85.65 85.65 0 0 0-17.184 1.744c.48-10.383.912-18.591 1.024-21.055C82.16 279.904 276.111 95.344 514.911 95.344c229.28 0 414.128 165.344 439.568 393.12c1.088 9.504 2.464 33.664 3.569 57.92c-6.24-1.44-12.609-2.385-19.233-2.385h-85.28c-46.88 0-85.008 38.128-85.008 85.008V906.67c0 46.895 38.128 85.007 85.008 85.007h85.28c46.88 0 85.024-38.127 85.024-85.007V629.007c0-5.216-.64-10.288-1.568-15.216c.928-2.944 1.536-6.017 1.569-9.233zm-938.704 3.439h86.288c11.6 0 21.023 9.408 21.023 21.008v278.656c0 11.616-9.44 21.008-21.024 21.008H85.135c-11.6 0-21.008-9.409-21.008-21.008V629.007c.032-11.6 9.44-21.008 21.009-21.008M959.84 906.655c0 11.6-9.44 21.008-21.023 21.008h-85.28c-11.6 0-21.009-9.408-21.009-21.008V629.007c0-11.6 9.409-21.007 21.008-21.007h85.28c11.6 0 21.024 9.408 21.024 21.007z"
                  />
                </svg>
                <span className="ml-2">{cell.playCount}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="ml-2"
                >
                  <path
                    fill="currentColor"
                    d="m12 19.654l-.758-.685q-2.448-2.236-4.05-3.828q-1.601-1.593-2.528-2.81t-1.296-2.2T3 8.15q0-1.908 1.296-3.204T7.5 3.65q1.32 0 2.475.675T12 6.289Q12.87 5 14.025 4.325T16.5 3.65q1.908 0 3.204 1.296T21 8.15q0 .996-.368 1.98q-.369.986-1.296 2.202t-2.519 2.809q-1.592 1.592-4.06 3.828z"
                  />
                </svg>
                <span className="ml-2">{cell.favoriteCount}</span>
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-primary">
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

const Subscription = () => {
  const [subData, setSubData] = useState<ISubscription[]>([])

  useEffect(() => {
    //querySubscription()
    handleSubscriptionData(mockData)
  }, [])

  const querySubscription = () => {
    const data = {
      limit: '20',
      sortOrder: 'desc',
      sortBy: 'subscribedAt',
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

    fetch('/api/v1/inbox/list', options)
      .then((res) => {
        if (res.status === 401) {
          refreshToken(querySubscription)
        } else {
          return res.json()
        }
      })
      .then((res) => {
        console.log(res)
      })
  }

  const handleSubscriptionData = (data: any) => {
    const result = data.data.map((cell) => {
      return {
        eid: cell.eid,
        pid: cell.pid,
        title: cell.title,
        description: cell.description,
        cover: cell?.image?.picUrl || cell.podcast?.image?.picUrl,
        podcast: cell.podcast.title,
        media: cell.media.source.url,
        playCount: cell.playCount,
        favoriteCount: cell.favoriteCount,
      }
    })

    setSubData(result)
  }

  return (
    <div>
      <div className="text-xl font-bold ml-6 mt-4">订阅更新</div>
      <div className="grid grid-cols-3 gap-4 place-items-center mb-36">
        <SubList subDataList={subData} />
      </div>
    </div>
  )
}

export default Subscription
