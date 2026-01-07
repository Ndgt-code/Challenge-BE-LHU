const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CUD Examples API',
            version: '1.0.0',
            description: 'API for CRUD operations with Users and Products',
        },
        servers: [{ url: 'http://localhost:3002' }],
        tags: [
            { name: 'Users', description: 'User management APIs' },
            { name: 'Products', description: 'Product management APIs' }
        ],
        paths: {
            // ========== USERS ==========
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users',
                    responses: { 200: { description: 'List of users' } }
                },
                post: {
                    tags: ['Users'],
                    summary: 'Create new user (create)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email'],
                                    properties: {
                                        name: { type: 'string', example: 'John Doe' },
                                        email: { type: 'string', example: 'test@example.com' },
                                        age: { type: 'number', example: 25 },
                                        isActive: { type: 'boolean', example: true }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'User created' } }
                }
            },
            '/api/users/v2': {
                post: {
                    tags: ['Users'],
                    summary: 'Create new user (new + save)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string', example: 'User V2' },
                                        email: { type: 'string', example: 'v2@example.com' },
                                        age: { type: 'number', example: 30 }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'User created' } }
                }
            },
            '/api/users/bulk': {
                post: {
                    tags: ['Users'],
                    summary: 'Create multiple users (insertMany)',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            email: { type: 'string' },
                                            age: { type: 'number' }
                                        }
                                    },
                                    example: [
                                        { name: 'Bulk 1', email: 'bulk1@test.com', age: 20 },
                                        { name: 'Bulk 2', email: 'bulk2@test.com', age: 25 }
                                    ]
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Users created' } }
                }
            },
            '/api/users/{id}': {
                put: {
                    tags: ['Users'],
                    summary: 'Update user by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string', example: 'Updated Name' },
                                        age: { type: 'number', example: 35 }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'User updated' } }
                },
                delete: {
                    tags: ['Users'],
                    summary: 'Delete user by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'User deleted' } }
                }
            },
            '/api/users/{id}/deactivate': {
                patch: {
                    tags: ['Users'],
                    summary: 'Deactivate user',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'User deactivated' } }
                }
            },
            '/api/users/bulk/deactivate-old': {
                patch: {
                    tags: ['Users'],
                    summary: 'Deactivate users > 50 years old',
                    responses: { 200: { description: 'Old users deactivated' } }
                }
            },
            '/api/users/bulk/inactive': {
                delete: {
                    tags: ['Users'],
                    summary: 'Delete all inactive users',
                    responses: { 200: { description: 'Inactive users deleted' } }
                }
            },
            '/api/users/email/{email}': {
                put: {
                    tags: ['Users'],
                    summary: 'Update user by email',
                    parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        age: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'User updated' } }
                },
                delete: {
                    tags: ['Users'],
                    summary: 'Delete user by email',
                    parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'User deleted' } }
                }
            },
            // ========== PRODUCTS ==========
            '/api/products': {
                get: {
                    tags: ['Products'],
                    summary: 'Get all products',
                    responses: { 200: { description: 'List of products' } }
                },
                post: {
                    tags: ['Products'],
                    summary: 'Create new product',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'price'],
                                    properties: {
                                        name: { type: 'string', example: 'New Product' },
                                        price: { type: 'number', example: 500000 },
                                        description: { type: 'string', example: 'Product description' },
                                        stock: { type: 'number', example: 10 },
                                        category: { type: 'string', enum: ['electronics', 'clothing', 'food', 'other'], example: 'electronics' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Product created' } }
                }
            },
            '/api/products/{id}': {
                put: {
                    tags: ['Products'],
                    summary: 'Update product by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        price: { type: 'number' },
                                        stock: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Product updated' } }
                },
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Product deleted' } }
                }
            },
            '/api/products/{id}/increase-stock': {
                patch: {
                    tags: ['Products'],
                    summary: 'Increase stock',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { amount: { type: 'number', example: 10 } }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Stock increased' } }
                }
            },
            '/api/products/{id}/decrease-stock': {
                patch: {
                    tags: ['Products'],
                    summary: 'Decrease stock',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { amount: { type: 'number', example: 5 } }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Stock decreased' } }
                }
            },
            '/api/products/one/{id}': {
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product (deleteOne)',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Product deleted' } }
                }
            },
            '/api/products/bulk/out-of-stock': {
                delete: {
                    tags: ['Products'],
                    summary: 'Delete out of stock products (stock = 0)',
                    responses: { 200: { description: 'Out of stock products deleted' } }
                }
            }
        }
    },
    apis: []
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
