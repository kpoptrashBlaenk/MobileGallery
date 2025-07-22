import { API_HOST } from '@/configs'
import { GetConfigs, PostConfigs } from '@/types'

/**
 * Sends a GET request to the api.
 *
 * 1. Fetch using the url
 *
 * 2. Trigger onSuccess or onFail
 *
 * @param configs
 */
export async function apiRequestGet(configs: GetConfigs): Promise<any> {
  try {
    const response = await fetch(`${API_HOST}${configs.url}`, {
      method: 'GET',
      credentials: 'include',
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result)

    return configs.onSuccess(result)
  } catch (error) {
    return configs.onFail(error)
  }
}

/**
 * Sends a POST request to the api.
 *
 * 1. Do the checks
 *
 * 2. Fetch using the url and the body
 *
 * 3. Trigger onSuccess or onFail
 *
 * @param configs
 */
export async function apiRequestPost(configs: PostConfigs): Promise<any> {
  try {
    configs.checks?.()

    const response = await fetch(`${API_HOST}${configs.url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: configs.body?.(),
      credentials: 'include',
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result)

    return configs.onSuccess(result)
  } catch (error) {
    return configs.onFail(error)
  }
}

/**
 * Sends a POST request to the api using a form as body.
 *
 * 1. Do the checks
 *
 * 2. Fetch using the url and the body
 *
 * 3. Trigger onSuccess or onFail
 *
 * @param configs
 */
export async function apiRequestPostForm(configs: PostConfigs): Promise<any> {
  try {
    configs.checks?.()

    // Track progress
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${API_HOST}${configs.url}`, true)
      xhr.withCredentials = true

      // Progress hanlder
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && configs.onProgress) {
          const percent = (event.loaded / event.total) * 100
          configs.onProgress(Math.floor(percent))
        }
      }

      // Response handler
      xhr.onload = () => {
        const json = JSON.parse(xhr.responseText)

        if (200 <= xhr.status && xhr.status < 300) {
          configs.onSuccess(json)
          resolve(json)
        } else {
          reject(new Error(json))
        }
      }

      xhr.onerror = (error) => {
        reject(configs.onFail(error))
      }

      xhr.send(configs.body())
    })
  } catch (error) {
    return configs.onFail(error)
  }
}
