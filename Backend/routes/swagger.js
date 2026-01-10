const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager & CRUD API with JWT',
            version: '2.0.0',
            description: 'API for managing Users, Products, and Tasks with JWT Authentication',
        },
        servers: [{ url: 'http://localhost:3002' }],
        // JWT Bearer Authentication
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token from login response'
                }
            }
        },
        tags: [
            { name: 'Auth', description: 'Authentication APIs (Register, Login, JWT)' },
            { name: 'Users', description: 'User management APIs' },
            { name: 'Products', description: 'Product management APIs' },
            { name: 'Tasks', description: 'Task management APIs' }
        ],
        paths: {
            // ========== AUTH ==========
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['username', 'email', 'password', 'confirmPassword'],
                                    properties: {
                                        username: { type: 'string', example: 'johndoe', minLength: 3, maxLength: 30 },
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        password: { type: 'string', example: '123456', minLength: 6 },
                                        confirmPassword: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User registered successfully' },
                        400: { description: 'Validation failed or email/username already exists' }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user - Returns JWT tokens',
                    description: 'Authenticate user and receive access token and refresh token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        password: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful - Returns JWT tokens',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Login successful!' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    user: { type: 'object' },
                                                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                                    expiresIn: { type: 'string', example: '24h' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Invalid email or password' }
                    }
                }
            },
            '/api/auth/refresh-token': {
                post: {
                    tags: ['Auth'],
                    summary: 'Refresh access token',
                    description: 'Get new access token using refresh token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['refreshToken'],
                                    properties: {
                                        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Token refreshed successfully' },
                        401: { description: 'Invalid or expired refresh token' }
                    }
                }
            },
            '/api/auth/profile': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get current user profile (Protected)',
                    description: 'Requires valid JWT token in Authorization header',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'User profile retrieved' },
                        401: { description: 'No token provided or token invalid' }
                    }
                }
            },
            '/api/auth/change-password': {
                put: {
                    tags: ['Auth'],
                    summary: 'Change current user password (Protected)',
                    description: 'Requires valid JWT token in Authorization header',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['currentPassword', 'newPassword', 'confirmNewPassword'],
                                    properties: {
                                        currentPassword: { type: 'string', example: '123456' },
                                        newPassword: { type: 'string', example: 'newpass123', minLength: 6 },
                                        confirmNewPassword: { type: 'string', example: 'newpass123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Password changed successfully' },
                        401: { description: 'Current password is incorrect or no token' }
                    }
                }
            },
            '/api/auth/users/{userId}': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get user by ID (Admin only)',
                    description: 'Requires valid JWT token with admin role',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'User profile retrieved' },
                        403: { description: 'Access denied - Admin role required' },
                        404: { description: 'User not found' }
                    }
                }
            },
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
            },
            // ========== TASKS ==========
            '/api/tasks': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Get all tasks (optional: ?status=pending or ?priority=high)',
                    parameters: [
                        { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in-progress', 'completed'] } },
                        { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } }
                    ],
                    responses: { 200: { description: 'List of tasks' } }
                },
                post: {
                    tags: ['Tasks'],
                    summary: 'Create new task (Protected)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title'],
                                    properties: {
                                        title: { type: 'string', example: 'Complete project' },
                                        description: { type: 'string', example: 'Finish the API project' },
                                        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
                                        priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
                                        dueDate: { type: 'string', format: 'date', example: '2026-01-15' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 201: { description: 'Task created' }, 401: { description: 'Unauthorized' } }
                }
            },
            '/api/tasks/{id}': {
                get: {
                    tags: ['Tasks'],
                    summary: 'Get task by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Task details' } }
                },
                put: {
                    tags: ['Tasks'],
                    summary: 'Update task by ID (Protected)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string' },
                                        description: { type: 'string' },
                                        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
                                        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                                        dueDate: { type: 'string', format: 'date' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Task updated' }, 401: { description: 'Unauthorized' } }
                },
                delete: {
                    tags: ['Tasks'],
                    summary: 'Delete task by ID (Protected)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Task deleted' }, 401: { description: 'Unauthorized' } }
                }
            },
            '/api/tasks/{id}/status': {
                patch: {
                    tags: ['Tasks'],
                    summary: 'Update task status (Protected)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'completed' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Task status updated' }, 401: { description: 'Unauthorized' } }
                }
            },
            '/api/tasks/bulk/completed': {
                delete: {
                    tags: ['Tasks'],
                    summary: 'Delete all completed tasks (Admin only)',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Completed tasks deleted' }, 403: { description: 'Admin role required' } }
                }
            }
        }
    },
    apis: []
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
