import { Request, Response } from 'express';
import shopifyService from '../services/shopify-service';

interface ShopQueryResult {
    shop: {
        name: string;
        myshopifyDomain: string;
    };
}

class ShopifyController {

    public async test(req: Request, res: Response): Promise<void> {

        try {

            const data = await shopifyService.query<ShopQueryResult>(`
                query {
                    shop {
                        name
                        myshopifyDomain
                    }
                }
            `);

            res.json(data);

        } catch (error) {

            console.error(error);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Internal server error';

            res.status(500).json({
                error: message
            });

        }

    }

    public async variantPersonalization(req: Request, res: Response): Promise<void> {

        try {

            const variantIds = [
                'gid://shopify/ProductVariant/49046120038651',
                'gid://shopify/ProductVariant/49046120071419',
                'gid://shopify/ProductVariant/49046120136955',
                'gid://shopify/ProductVariant/49046120104187'
            ];

            const data = await shopifyService.query(`
                query VariantPersonalization($variantIds: [ID!]!) {
                    nodes(ids: $variantIds) {
                        ... on ProductVariant {
                            id

                            personalizeImage: metafield(namespace: "personalize", key: "image") {
                                value
                                type
                                reference {
                                    ... on MediaImage {
                                        id
                                        image {
                                            url
                                        }
                                    }
                                }
                            }

                            personalizeData: metafield(namespace: "personalize", key: "data") {
                                type
                                reference {
                                    ... on Metaobject {
                                        id
                                        type
                                        handle
                                        fields {
                                            key
                                            type
                                            value
                                            reference {
                                                __typename
                                                ... on MediaImage {
                                                    id
                                                    image {
                                                        url
                                                    }
                                                }
                                                ... on Product {
                                                    id
                                                    title
                                                }
                                                ... on ProductVariant {
                                                    id
                                                    title
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `, { variantIds });

            res.json(data);

        } catch (error) {

            console.error(error);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Internal server error';

            res.status(500).json({
                error: message
            });

        }

    }

}

export default new ShopifyController();
