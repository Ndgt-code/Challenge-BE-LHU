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
            { name: 'Tasks', description: 'Task management APIs' },
            { name: 'Uploads', description: 'File upload APIs' }
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
                },
                put: {
                    tags: ['Auth'],
                    summary: 'Update current user profile (Protected)',
                    description: 'Update username. Requires valid JWT token.',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        username: { type: 'string', example: 'newusername', minLength: 3, maxLength: 30 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Profile updated successfully' },
                        400: { description: 'Username already taken or validation failed' },
                        401: { description: 'No token provided or token invalid' }
                    }
                }
            },
            '/api/auth/avatar': {
                put: {
                    tags: ['Auth'],
                    summary: 'Upload user avatar (Protected)',
                    description: 'Upload an image file as user avatar. Requires valid JWT token.',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        avatar: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'Image file (JPEG, PNG, GIF, WEBP). Max 5MB'
                                        }
                                    },
                                    required: ['avatar']
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Avatar uploaded successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Avatar uploaded successfully!' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    avatar: { type: 'string', example: '/uploads/123456-avatar.jpg' },
                                                    fullUrl: { type: 'string', example: 'http://localhost:3002/uploads/123456-avatar.jpg' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: { description: 'No file uploaded or invalid file type' },
                        401: { description: 'No token provided or token invalid' }
                    }
                }
            },
            '/api/auth/forgot-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Request password reset token',
                    description: 'Generates a 6-digit reset token. In development, token is returned in response. In production, it would be sent via email.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'john@example.com' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Reset token generated',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    email: { type: 'string', example: 'john@example.com' },
                                                    resetToken: { type: 'string', example: '123456' },
                                                    expiresIn: { type: 'string', example: '1 hour' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/reset-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Reset password with token',
                    description: 'Use the 6-digit token from forgot-password to set a new password',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'token', 'newPassword', 'confirmNewPassword'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                                        token: { type: 'string', example: '123456', description: '6-digit reset token' },
                                        newPassword: { type: 'string', example: 'newpass123', minLength: 6 },
                                        confirmNewPassword: { type: 'string', example: 'newpass123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Password reset successfully' },
                        400: { description: 'Invalid token, expired token, or validation failed' }
                    }
                }
            },
            // ========== USERS ==========
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (with Advanced Query)',
                    description: 'Supports pagination, sorting, filtering, and searching',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Items per page' },
                        { name: 'sort', in: 'query', schema: { type: 'string', default: 'createdAt' }, description: 'Field to sort by' },
                        { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Sort order' },
                        { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in name, email' },
                        { name: 'isActive', in: 'query', schema: { type: 'boolean' }, description: 'Filter by active status' }
                    ],
                    responses: { 200: { description: 'List of users with pagination info' } }
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
                    summary: 'Get all products (with Advanced Query)',
                    description: 'Supports pagination, sorting, filtering, and searching',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Items per page' },
                        { name: 'sort', in: 'query', schema: { type: 'string', default: 'createdAt' }, description: 'Field to sort by' },
                        { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Sort order' },
                        { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in name, description, category' },
                        { name: 'category', in: 'query', schema: { type: 'string', enum: ['electronics', 'clothing', 'food', 'other'] }, description: 'Filter by category' }
                    ],
                    responses: { 200: { description: 'List of products with pagination info' } }
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
            },
            // ========== UPLOADS ==========
            '/api/uploads': {
                get: {
                    tags: ['Uploads'],
                    summary: 'Get all uploaded files',
                    responses: {
                        200: { description: 'List of uploaded files' }
                    }
                }
            },
            '/api/uploads/single': {
                post: {
                    tags: ['Uploads'],
                    summary: 'Upload single file',
                    description: 'Upload a single image or document file (JPEG, PNG, GIF, PDF, DOC, DOCX). Max size: 5MB',
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'File to upload'
                                        }
                                    },
                                    required: ['file']
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'File uploaded successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'File uploaded successfully' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    filename: { type: 'string', example: '1234567890-image.jpg' },
                                                    originalName: { type: 'string', example: 'image.jpg' },
                                                    mimetype: { type: 'string', example: 'image/jpeg' },
                                                    size: { type: 'number', example: 102400 },
                                                    path: { type: 'string', example: '/uploads/1234567890-image.jpg' },
                                                    url: { type: 'string', example: 'http://localhost:3002/uploads/1234567890-image.jpg' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: { description: 'No file uploaded or invalid file type' },
                        500: { description: 'Server error' }
                    }
                }
            },
            '/api/uploads/multiple': {
                post: {
                    tags: ['Uploads'],
                    summary: 'Upload multiple files (max 5)',
                    description: 'Upload multiple image or document files. Max 5 files per request. Max size: 5MB each',
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        files: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'binary'
                                            },
                                            description: 'Files to upload (max 5)'
                                        }
                                    },
                                    required: ['files']
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Files uploaded successfully' },
                        400: { description: 'No files uploaded or invalid file type' },
                        500: { description: 'Server error' }
                    }
                }
            },
            '/api/uploads/{filename}': {
                delete: {
                    tags: ['Uploads'],
                    summary: 'Delete uploaded file',
                    parameters: [{
                        name: 'filename',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Filename to delete (e.g., 1234567890-image.jpg)'
                    }],
                    responses: {
                        200: { description: 'File deleted successfully' },
                        404: { description: 'File not found' },
                        500: { description: 'Server error' }
                    }
                }
            }
        },
        // ========== POSTS ==========
        '/api/posts': {
            get: {
                tags: ['Posts'],
                summary: 'Get all posts (with pagination & populate)',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                    { name: 'sort', in: 'query', schema: { type: 'string', default: 'createdAt' } },
                    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'published', 'archived'] } }
                ],
                responses: { 200: { description: 'List of posts with author info' } }
            },
            post: {
                tags: ['Posts'],
                summary: 'Create new post (Protected)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'content'],
                                properties: {
                                    title: { type: 'string', example: 'My First Post' },
                                    content: { type: 'string', example: 'This is the content...' },
                                    tags: { type: 'array', items: { type: 'string' }, example: ['nodejs', 'mongodb'] },
                                    status: { type: 'string', enum: ['draft', 'published'], default: 'published' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Post created with author populated' } }
            }
        },
        '/api/posts/{id}': {
            get: {
                tags: ['Posts'],
                summary: 'Get post by ID (with comments)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Post with author and comments' } }
            },
            put: {
                tags: ['Posts'],
                summary: 'Update post (Protected - Author only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    content: { type: 'string' },
                                    status: { type: 'string', enum: ['draft', 'published', 'archived'] }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Post updated' } }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Delete post with cascade (Protected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Post and comments deleted' } }
            }
        },
        '/api/posts/{id}/like': {
            post: {
                tags: ['Posts'],
                summary: 'Like/Unlike post (Protected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Like toggled' } }
            }
        },
        '/api/posts/user/{userId}': {
            get: {
                tags: ['Posts'],
                summary: 'Get posts by user ID',
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'List of user posts' } }
            }
        },
        '/api/posts/{postId}/comments': {
            get: {
                tags: ['Comments'],
                summary: 'Get comments for a post',
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'List of comments' } }
            },
            post: {
                tags: ['Comments'],
                summary: 'Add comment to post (Protected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string', example: 'Great post!' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Comment added' } }
            }
        },
        '/api/posts/comments/{id}': {
            put: {
                tags: ['Comments'],
                summary: 'Update comment (Protected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: { content: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Comment updated' } }
            },
            delete: {
                tags: ['Comments'],
                summary: 'Delete comment (Protected)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { 200: { description: 'Comment deleted' } }
            }
        }
    }
},
    apis: []
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
