import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.15.136:3333'       // usando emulador IOS, Adroid pode-se usar localhost   (para Android precisa rodar 'adb reverse tcp:3333 tcp:3333')
})

export default api