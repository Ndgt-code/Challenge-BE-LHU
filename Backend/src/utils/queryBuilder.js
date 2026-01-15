// ==========================================
// QUERY BUILDER - Advanced Query Utilities
// ==========================================

/**
 * Build advanced query with pagination, sorting, filtering, searching
 * @param {Object} model - Mongoose model
 * @param {Object} queryParams - Query parameters from req.query
 * @param {Object} options - Additional options
 * @returns {Object} - { data, pagination }
 */
const buildAdvancedQuery = async (model, queryParams, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        search = '',
        ...filters
    } = queryParams;

    // Default searchable fields
    const searchFields = options.searchFields || ['name', 'username', 'email'];

    // Fields to exclude from filtering
    const excludeFields = ['page', 'limit', 'sort', 'order', 'search'];

    // ------------------------------------------
    // 1. BUILD FILTER QUERY
    // ------------------------------------------
    let filterQuery = {};

    // Remove excluded fields from filters
    excludeFields.forEach(field => delete filters[field]);

    // Add remaining filters (e.g., status=active, role=admin)
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            // Handle boolean strings
            if (filters[key] === 'true') filterQuery[key] = true;
            else if (filters[key] === 'false') filterQuery[key] = false;
            else filterQuery[key] = filters[key];
        }
    });

    // ------------------------------------------
    // 2. BUILD SEARCH QUERY
    // ------------------------------------------
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i'); // Case-insensitive
        filterQuery.$or = searchFields.map(field => ({
            [field]: searchRegex
        }));
    }

    // ------------------------------------------
    // 3. PAGINATION
    // ------------------------------------------
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // ------------------------------------------
    // 4. SORTING
    // ------------------------------------------
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortQuery = { [sort]: sortOrder };

    // ------------------------------------------
    // 5. EXECUTE QUERY
    // ------------------------------------------
    const [data, total] = await Promise.all([
        model
            .find(filterQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNum)
            .select(options.select || '-password'), // Exclude password by default
        model.countDocuments(filterQuery)
    ]);

    // ------------------------------------------
    // 6. BUILD PAGINATION INFO
    // ------------------------------------------
    const totalPages = Math.ceil(total / limitNum);
    const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
    };

    return { data, pagination };
};

module.exports = { buildAdvancedQuery };
