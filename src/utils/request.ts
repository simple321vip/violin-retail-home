import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import router from '../router'
import { getToken, getTenant, resetToken } from '../utils/auth'

// violin-wiki
const service = axios.create(
  {
    baseURL: import.meta.env.VITE_APP_URL as string,
    timeout: 5000
  }
)

service.interceptors.request.use(
  config => {
    if (typeof getToken() === 'string') {
      (config as any).headers['Authorization'] = 'Bearer:' + getToken()
    }
    const tenant = getTenant()
    if (typeof tenant === 'string') {
      (config as any).headers['tenantId'] = JSON.parse(tenant).tenant_id
    }

    return config
  }
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error && error.response) {
      if (error.response.status == 401) {
        resetToken()
        router.resolve({ path: '/' });
        return
      } else {
        if (error.status == 500) {
          ElMessageBox.alert('请求发生错误，请联系管理员', '错误', { type: 'error' });
        } else {
          ElMessageBox.alert(error.response.data.Msg, '错误', { type: 'error' });
        }
        return Promise.reject(error.response)
      }
    }
  }
)

export { service }