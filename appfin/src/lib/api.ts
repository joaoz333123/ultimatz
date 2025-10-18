export interface ApiError extends Error {
  response: Response
}

const ABSOLUTE_URL_REGEX = /^https?:\/\//i

function normalizePath(path: string): string {
  if (!path) {
    return ''
  }

  return path.startsWith('/') ? path : `/${path}`
}

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  return base.replace(/\/$/, '')
}

function resolveUrl(path: string): string {
  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path
  }

  const baseUrl = getApiBaseUrl()
  const normalizedPath = normalizePath(path)

  if (!baseUrl) {
    return normalizedPath
  }

  return `${baseUrl}${normalizedPath}`
}

function mergeHeaders(headers?: HeadersInit): Record<string, string> {
  const result: Record<string, string> = {}

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value
    })
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      result[key] = value
    }
  } else if (headers) {
    Object.assign(result, headers)
  }

  if (!('Content-Type' in result) && !('content-type' in result)) {
    result['Content-Type'] = 'application/json'
  } else if ('content-type' in result && !('Content-Type' in result)) {
    result['Content-Type'] = result['content-type']
    delete result['content-type']
  }

  return result
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = resolveUrl(path)
  const headers = mergeHeaders(init.headers)
  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = Object.assign(new Error(`Request failed with status ${response.status}`), {
      response,
    })
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return undefined as T
}

export async function apiGet<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'GET' })
}

export async function apiPost<T = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
  init: RequestInit = {}
): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    method: 'POST',
  }

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body)
  }

  return apiFetch<T>(path, requestInit)
}

export async function apiPut<T = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
  init: RequestInit = {}
): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    method: 'PUT',
  }

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body)
  }

  return apiFetch<T>(path, requestInit)
}

export async function apiPatch<T = unknown, TBody = unknown>(
  path: string,
  body?: TBody,
  init: RequestInit = {}
): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    method: 'PATCH',
  }

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body)
  }

  return apiFetch<T>(path, requestInit)
}

export async function apiDelete<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  return apiFetch<T>(path, { ...init, method: 'DELETE' })
}
