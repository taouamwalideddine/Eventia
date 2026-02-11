const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

export const apiClient = {
  /**
   * Performs a POST request to the specified endpoint.
   * @param endpoint API endpoint path
   * @param data Request body data
   * @param token Optional authentication token
   */
  async post(endpoint: string, data: any, token?: string) {
    const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  },

  /**
   * Performs a GET request to the specified endpoint.
   * @param endpoint API endpoint path
   * @param token Optional authentication token
   */
  async get(endpoint: string, token?: string) {
    const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Performs a PATCH request to the specified endpoint.
   * @param endpoint API endpoint path
   * @param data Request body data
   * @param token Optional authentication token
   */
  async patch(endpoint: string, data: any, token?: string) {
    const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetches a file (blob) from the specified endpoint.
   * @param endpoint API endpoint path
   * @param token Optional authentication token
   */
  async getFile(endpoint: string, token?: string) {
    const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/pdf, application/octet-stream',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Status: ${response.status}`);
    }

    return response.blob();
  },

  /**
   * Performs a DELETE request to the specified endpoint.
   * @param endpoint API endpoint path
   * @param token Optional authentication token
   */
  async delete(endpoint: string, token?: string) {
    const url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Status: ${response.status}`);
    }

    return response.json().catch(() => ({}));
  },
};

