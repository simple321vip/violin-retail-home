import { defineStore, acceptHMRUpdate } from 'pinia'
import { authorize } from '@/api/user'
import { getToken, setToken, resetToken, setTenant, getTenant } from '@/utils/auth'
import { Tenant } from '@/common/entity'
import { ref } from 'vue'

export const tenantStore = defineStore('tenant', () => {
  const tenant = ref({
    account: '',
    token: '',
    id: '',
    headerImg: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  })

  const login = async (tenant: Tenant, token: string) => {
    try {
      await authorize({
        tenant_id: tenant.tenant_id, token: token
      })
      setToken(token)
      setTenant(tenant)
    } catch {
      Promise.resolve("authorize error")
    }
  }

  const logout = async () => {
    tenant.value.account = ''
    tenant.value.token = ''
    tenant.value.id = ''
    resetToken()
    window.location.reload()
  }

  const reflush = async () => {
    if (getToken()) {
      const tenantStorage = <Tenant>(JSON.parse(getTenant() as string))
      const token = <string>getToken()
      tenant.value.account = tenantStorage.account
      tenant.value.token = token
      tenant.value.id = tenantStorage.tenant_id
    }
  }

  return {
    tenant,
    login,
    logout,
    reflush
  }

})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(tenantStore, import.meta.hot))
}
