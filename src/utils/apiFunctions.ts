import { findCookiesByCookies } from '@/api/models/cookies'

/**
 * Checks if the cookies exist in the session table
 *
 * @param cookies The cookies to check for
 */
export async function sessionExist(cookies: string): Promise<boolean> {
  // Check if cookies
  if (!cookies) {
    return false
  }

  try {
    // Find cookies
    const session = await findCookiesByCookies(cookies)

    // Check session found
    if (session.rowCount === 0) {
      return false
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
