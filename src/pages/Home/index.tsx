import { Navigate } from 'react-router-dom'
import Discovery from './discovery'
import Subscription from './subscription'
import AudioPlayer from '../../components/Player'

const Home = () => {
  // 判断是否登录过
  const accessToken = localStorage.getItem('x-jike-access-token')

  if (!accessToken) {
    // 重定向到login页面
    return <Navigate to="/login" replace />
  }

  return (
    <div className="relative">
      <Discovery />
      <Subscription />
      <AudioPlayer />
    </div>
  )
}

export default Home
