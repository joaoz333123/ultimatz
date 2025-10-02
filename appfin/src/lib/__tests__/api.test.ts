const originalFetch = global.fetch
const originalEnv = { ...process.env }

describe('api helpers', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, NEXT_PUBLIC_API_BASE_URL: 'http://api.test' }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('prefixes requests with the configured base url', async () => {
    const { apiFetch } = await import('../api')
    const response = {
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    await apiFetch('/budgets')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/budgets',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('normalizes relative paths without a leading slash', async () => {
    const { apiFetch } = await import('../api')
    const response = {
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    await apiFetch('reports')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/reports',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('passes through absolute URLs and retains custom header entries', async () => {
    const { apiFetch } = await import('../api')
    const response = {
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch
    const headers = new Headers({ Authorization: 'Bearer token' })

    await apiFetch('https://external.test/status', { headers })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://external.test/status',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          authorization: 'Bearer token',
        }),
      })
    )
  })

  it('returns the normalized path when no base url is provided', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = ''
    const { apiFetch } = await import('../api')
    const response = {
      ok: true,
      status: 200,
      json: async () => ({}),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    await apiFetch('/health')

    expect(global.fetch).toHaveBeenCalledWith(
      '/health',
      expect.any(Object)
    )
  })

  it('propagates the response when the request fails', async () => {
    const { apiFetch } = await import('../api')
    const response = {
      ok: false,
      status: 500,
      json: async () => ({ error: 'fail' }),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    await expect(apiFetch('/budgets')).rejects.toMatchObject({ response })
  })

  it('sends JSON bodies for POST requests and parses the response', async () => {
    const { apiPost } = await import('../api')
    const payload = { name: 'Test Budget' }
    const response = {
      ok: true,
      status: 200,
      json: async () => ({ id: '1' }),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    const result = await apiPost<{ id: string }>('/budgets', payload)

    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/budgets',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    )
    expect(result).toEqual({ id: '1' })
  })

  it('performs GET requests and exposes the base url helper', async () => {
    const { apiGet, getApiBaseUrl } = await import('../api')
    const response = {
      ok: true,
      status: 200,
      json: async () => ({ message: 'ok' }),
      headers: { get: () => 'application/json' },
    } as unknown as Response
    global.fetch = jest.fn().mockResolvedValue(response) as typeof fetch

    const result = await apiGet<{ message: string }>('/status')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/status',
      expect.objectContaining({ method: 'GET' })
    )
    expect(result).toEqual({ message: 'ok' })
    expect(getApiBaseUrl()).toBe('http://api.test')
  })
})
