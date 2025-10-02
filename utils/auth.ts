// Simple auth utility for API requests
export class AuthService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  static clearToken() {
    this.token = null;
  }
}

// For demo purposes, set a dummy token
AuthService.setToken("demo-token-123");
