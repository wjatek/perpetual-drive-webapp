type Config = {
  apiBaseUrl: string
}

const config: Record<string, Config> = {
  development: {
    apiBaseUrl: 'http://localhost:3001',
  },
  production: {
    apiBaseUrl: 'https://perpetual-drive-api.onrender.com',
  },
  test: {
    apiBaseUrl: 'https://perpetual-drive-api.onrender.com',
  },
}

const environment = process.env.NODE_ENV || 'development'

const apiConfig: Config = config[environment] || config.development

export default apiConfig
