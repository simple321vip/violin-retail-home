import { Tenant } from './entity';
import { tenantStore } from '../store/modules/tenant';
import router from '../router'
import { setToken, setTenant } from '../utils/auth'

// config/index.js
const env = process.env.NODE_ENV!;

const configObj: any = {
  production: {
    BAIDU_CLOUD_URL: 'http://openapi.baidu.com/oauth/2.0/authorize',
    RESPONSE_TYPE: '?response_type=' + 'code',
    CLIENT_ID: '&client_id=' + 'WksD0FOVAp8zSRV62qNKxtnCexArVPOf',
    REDIRECT_URI: '&redirect_uri=' + 'https://www.violin-home.cn/auth/api/v1/authorize/baidu',
    SCOPE: '&scope=basic,netdisk',
    DEVICE_ID: '&device_id=26202308',
    QR_CODE: '&qrcode=' + '1',
    DISPLAY: '&display=popup'
  },
  development: {
    BAIDU_CLOUD_URL: 'http://openapi.baidu.com/oauth/2.0/authorize',
    RESPONSE_TYPE: '?response_type=' + 'code',
    CLIENT_ID: '&client_id=' + 'BIukdHDXeNPmIXe96GA6OOXGgnP5GEhM',
    REDIRECT_URI: '&redirect_uri=' + 'http://localhost:8080/auth/api/v1/authorize/baidu',
    SCOPE: '&scope=basic,netdisk',
    DEVICE_ID: '&device_id=27103657',
    QR_CODE: '&qrcode=' + '1',
    DISPLAY: '&display=popup'
  },
  test: {
    BAIDU_CLOUD_URL: 'http://openapi.baidu.com/oauth/2.0/authorize',
    RESPONSE_TYPE: '?response_type=' + 'code',
    CLIENT_ID: '&client_id=' + 'BIukdHDXeNPmIXe96GA6OOXGgnP5GEhM',
    REDIRECT_URI: '&redirect_uri=' + 'http://localhost:8080/auth/api/v1/authorize/baidu',
    SCOPE: '&scope=basic,netdisk',
    DEVICE_ID: '&device_id=27103657',
    QR_CODE: '&qrcode=' + '1',
    DISPLAY: '&display=popup'
  },
}

const scan_method: any = {
  production: (qrcode: string) => {
    window.location.href = qrcode
  },
  development: async () => {

    const useTenantStore = tenantStore()
    const tenant: Tenant = {
      tenant_id: '7788',
      account: '小小的测试账户'
    }
    let token = 'ABCDEFG'

    await useTenantStore.login(tenant, token).then(() => {
      const { href } = router.resolve({
        path: '/'
      })
      window.open(href, '_self')
    }).catch((error) => {
      const { href } = router.resolve({
        path: '/login'
      })
      window.open(href, '_self')
    })

    setToken("token")
    setTenant(
      {
        tenantId: "111"
      }
    )
    router.push({
      path: '/home'
    })
  },
  test: async (qrcode: string) => {
    window.location.href = qrcode
  },
}

const scan = scan_method[env]
const config = configObj[env]

export { scan, config }
