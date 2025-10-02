import type {
  FormSubmissionResult,
  FormSubmissionConfig,
} from '../types/form.types';

// Form submission service interface (Dependency Inversion Principle)
export interface FormSubmissionService {
  readonly submit: <T = unknown>(
    data: Record<string, unknown>,
    config: FormSubmissionConfig
  ) => Promise<FormSubmissionResult<T>>;
}

// HTTP client interface (Interface Segregation Principle)
export interface HttpClient {
  readonly get: <T = unknown>(
    url: string,
    config?: RequestConfig
  ) => Promise<T>;
  readonly post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<T>;
  readonly put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<T>;
  readonly delete: <T = unknown>(
    url: string,
    config?: RequestConfig
  ) => Promise<T>;
}

export interface RequestConfig {
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
}

// Concrete HTTP client implementation
export class FetchHttpClient implements HttpClient {
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: config?.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: config?.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// Form submission service implementation
export class DefaultFormSubmissionService implements FormSubmissionService {
  constructor(private readonly httpClient: HttpClient) {}

  async submit<T = unknown>(
    data: Record<string, unknown>,
    config: FormSubmissionConfig
  ): Promise<FormSubmissionResult<T>> {
    try {
      let result: T;

      switch (config.method) {
        case 'GET': {
          const searchParams = new URLSearchParams(
            data as Record<string, string>
          );
          result = await this.httpClient.get<T>(
            `${config.endpoint}?${searchParams.toString()}`,
            {
              headers: config.headers,
            }
          );
          break;
        }
        case 'POST':
          result = await this.httpClient.post<T>(config.endpoint, data, {
            headers: config.headers,
          });
          break;
        case 'PUT':
          result = await this.httpClient.put<T>(config.endpoint, data, {
            headers: config.headers,
          });
          break;
        case 'DELETE':
          result = await this.httpClient.delete<T>(config.endpoint, {
            headers: config.headers,
          });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${config.method}`);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi form',
      };
    }
  }
}

// Factory function for creating form submission service
export const createFormSubmissionService = (
  httpClient?: HttpClient
): FormSubmissionService => {
  const client = httpClient ?? new FetchHttpClient();
  return new DefaultFormSubmissionService(client);
};

// Specialized submission services for different form types
export class LoginSubmissionService {
  constructor(private readonly submissionService: FormSubmissionService) {}

  async submitLogin(
    email: string,
    password: string
  ): Promise<FormSubmissionResult> {
    return this.submissionService.submit(
      { email, password },
      {
        endpoint: '/api/login',
        method: 'GET',
      }
    );
  }
}

export class RegisterSubmissionService {
  constructor(private readonly submissionService: FormSubmissionService) {}

  async submitRegister(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<FormSubmissionResult> {
    return this.submissionService.submit(data, {
      endpoint: '/api/register',
      method: 'POST',
    });
  }
}

// Factory functions for specialized services
export const createLoginSubmissionService = (
  httpClient?: HttpClient
): LoginSubmissionService => {
  const submissionService = createFormSubmissionService(httpClient);
  return new LoginSubmissionService(submissionService);
};

export const createRegisterSubmissionService = (
  httpClient?: HttpClient
): RegisterSubmissionService => {
  const submissionService = createFormSubmissionService(httpClient);
  return new RegisterSubmissionService(submissionService);
};
