import { GetConfigs } from '@/types'
import { apiRequestGet } from '@/utils/apiRequest'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

async function guestOnly(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> {
  const getConfigs: GetConfigs = {
    url: 'auth/login',

    // Go to home on success
    onSuccess: () => next({ name: 'auth' }),

    // Go to next on fail
    onFail: () => next(),
  }

  return await apiRequestGet(getConfigs)
}

export default guestOnly
