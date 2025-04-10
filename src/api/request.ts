// 根据环境变量选择配置
const config = {
    // apiBaseUrl: 'http://localhost:8070',
    apiBaseUrl: 'https://ledgermate.ihibei.cn',
};

type ContentType = 'json' | 'form';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    contentType?: ContentType;
}

export class ApiRequest {
    private static async request(endpoint: string, options: RequestOptions = {}) {
        const url = `${config.apiBaseUrl}${endpoint}`;
        const contentType = options.contentType || 'json';
        const headers = {
            'Content-Type': contentType === 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${process.env.LEDGER_MATE_ACCESS_KEY || ''}`,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers,
                body: options.body ? (contentType === 'json' ? JSON.stringify(options.body) : new URLSearchParams(options.body).toString()) : undefined
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async get(endpoint: string, headers?: Record<string, string>) {
        return this.request(endpoint, { headers });
    }

    static async post(endpoint: string, body: any, contentType?: ContentType, headers?: Record<string, string>) {
        return this.request(endpoint, { method: 'POST', body, contentType, headers });
    }

    static async put(endpoint: string, body: any, headers?: Record<string, string>) {
        return this.request(endpoint, { method: 'PUT', body, headers });
    }

    static async delete(endpoint: string, headers?: Record<string, string>) {
        return this.request(endpoint, { method: 'DELETE', headers });
    }
}