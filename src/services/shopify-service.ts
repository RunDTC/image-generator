interface ShopifyGraphQLResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

class ShopifyService {

    private get shopDomain(): string {
        const value = process.env.SHOPIFY_SHOP_DOMAIN;
        if (!value) {
            throw new Error('SHOPIFY_SHOP_DOMAIN is not set.');
        }
        return value;
    }

    private get accessToken(): string {
        const value = process.env.SHOPIFY_ADMIN_API_TOKEN;
        if (!value) {
            throw new Error('SHOPIFY_ADMIN_API_TOKEN is not set.');
        }
        return value;
    }

    private get apiVersion(): string {
        return process.env.SHOPIFY_API_VERSION || '2026-07';
    }

    public async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {

        const url = `https://${this.shopDomain}/admin/api/${this.apiVersion}/graphql.json`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': this.accessToken
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Shopify API request failed (${response.status}): ${body}`);
        }

        const result = await response.json() as ShopifyGraphQLResponse<T>;

        if (result.errors?.length) {
            throw new Error(`Shopify API returned errors: ${result.errors.map(e => e.message).join(', ')}`);
        }

        if (!result.data) {
            throw new Error('Shopify API response did not contain data.');
        }

        return result.data;

    }

}

export default new ShopifyService();
