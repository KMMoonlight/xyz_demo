export const COMMON_HEADER = {
  Host: 'api.xiaoyuzhoufm.com',
  'User-Agent': 'Xiaoyuzhou/2.57.1 (build:1576; iOS 17.4.1)',
  Market: 'AppStore',
  'App-BuildNo': '1576',
  OS: 'ios',
  Manufacturer: 'Apple',
  BundleID: 'app.podcast.cosmos',
  Connection: 'keep-alive',
  'abtest-info': '{"old_user_discovery_feed":"enable"}',
  'Accept-Language': 'zh-Hant-HK;q=1.0, zh-Hans-CN;q=0.9',
  Model: 'iPhone14,2',
  'app-permissions': '4',
  Accept: '*/*',
  'Content-Type': 'application/json',
  'App-Version': '2.57.1',
  'Accept-Encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
  WifiConnected: 'true',
  'OS-Version': '17.4.1',
  'x-custom-xiaoyuzhou-app-dev': '',
}

export const QUERY_HEADER = {
  Host: 'api.xiaoyuzhoufm.com',
  'User-Agent': 'Xiaoyuzhou/2.57.1 (build:1576; iOS 17.4.1)',
  Market: 'AppStore',
  'App-BuildNo': '1576',
  OS: 'ios',
  Manufacturer: 'Apple',
  BundleID: 'app.podcast.cosmos',
  Connection: 'keep-alive',
  'abtest-info': '{"old_user_discovery_feed":"enable"}',
  'Accept-Language': 'zh-Hant-HK;q=1.0, zh-Hans-CN;q=0.9',
  Model: 'iPhone14,2',
  'app-permissions': '4',
  Accept: '*/*',
  'Content-Type': 'application/json',
  'App-Version': '2.57.1',
  WifiConnected: 'true',
  'OS-Version': '17.4.1',
  'x-custom-xiaoyuzhou-app-dev': '',
  Timezone: 'Asia/Shanghai',
}

export function generateLocalTime() {
  const date = new Date()
  const pad = (num: number) => String(num).padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  const timezoneOffset = -date.getTimezoneOffset()
  const sign = timezoneOffset >= 0 ? '+' : '-'
  const absOffset = Math.abs(timezoneOffset)
  const offsetHours = pad(Math.floor(absOffset / 60))
  const offsetMinutes = pad(absOffset % 60)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`
}

export function refreshToken(callback: () => void) {
  //遇到401错误的时候需要刷新Token
  const accessToken = localStorage.getItem('x-jike-access-token')
  const refreshToken = localStorage.getItem('x-jike-refresh-token')

  if (!accessToken || !refreshToken) {
    return
  }

  const options = {
    method: 'POST',
    headers: {
      ...COMMON_HEADER,
      'x-jike-refresh-token': refreshToken,
      'x-jike-access-token': accessToken,
    },
  }

  fetch('/api/app_auth_tokens.refresh', options)
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem('x-jike-access-token', res['x-jike-access-token'])
      localStorage.setItem('x-jike-refresh-token', res['x-jike-refresh-token'])

      callback()
    })
}
