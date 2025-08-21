import { GetConfigs } from '@/types'
import { apiRequestGet } from '@/utils/apiRequest'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

async function authOnly(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const getConfigs: GetConfigs = {
    url: 'auth/login',

    // Go to next on success
    onSuccess: () => next(),

    // Go to verification on fail
    onFail: () => next({ name: 'guest' }),
  }

  return await apiRequestGet(getConfigs)
}

export default authOnly
