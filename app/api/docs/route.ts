import { NextResponse } from 'next/server'

/**
 * OpenAPI 3.0 Documentation for Tribal Resource Hub API
 */
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tribal Resource Hub API',
    description: 'API for accessing tribal resources, scholarships, grants, and related data for Indigenous communities.',
    version: '1.0.0',
    contact: {
      email: 'support@tribalresourcehub.com',
      url: 'https://tribalresourcehub.com',
    },
  },
  servers: [
    {
      url: 'https://tribalresourcehub.com/api',
      description: 'Production server',
    },
  ],
  tags: [
    { name: 'Resources', description: 'Tribal resources and programs' },
    { name: 'Scholarships', description: 'Educational scholarships for Native Americans' },
    { name: 'Grants', description: 'Federal, state, and tribal grants' },
    { name: 'Tribes', description: 'Federally recognized tribes' },
    { name: 'Search', description: 'Search functionality' },
    { name: 'Health', description: 'API health checks' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        description: 'Returns the health status of the API',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/resources/list': {
      get: {
        tags: ['Resources'],
        summary: 'List resources',
        description: 'Get a paginated list of tribal resources with optional filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 }, description: 'Items per page' },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['federal', 'state', 'tribal', 'emergency', 'scholarship'] }, description: 'Filter by resource type' },
          { name: 'state', in: 'query', schema: { type: 'string' }, description: 'Filter by US state' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term' },
        ],
        responses: {
          '200': {
            description: 'List of resources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    resources: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Resource' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              },
            },
          },
          '429': { description: 'Rate limit exceeded' },
        },
      },
    },
    '/scholarships/list': {
      get: {
        tags: ['Scholarships'],
        summary: 'List scholarships',
        description: 'Get a paginated list of scholarships with optional filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'deadline', in: 'query', schema: { type: 'string', enum: ['upcoming', 'all'] }, description: 'Filter by deadline status' },
        ],
        responses: {
          '200': {
            description: 'List of scholarships',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    scholarships: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Scholarship' },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/grants/list': {
      get: {
        tags: ['Grants'],
        summary: 'List grants',
        description: 'Get a paginated list of grants with optional filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'grantType', in: 'query', schema: { type: 'string', enum: ['federal', 'state', 'tribal', 'foundation', 'corporate'] }, description: 'Filter by grant type' },
        ],
        responses: {
          '200': {
            description: 'List of grants',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    grants: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Grant' },
                    },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tribes/list': {
      get: {
        tags: ['Tribes'],
        summary: 'List federally recognized tribes',
        description: 'Get a list of all federally recognized tribes',
        parameters: [
          { name: 'region', in: 'query', schema: { type: 'string' }, description: 'Filter by region' },
        ],
        responses: {
          '200': {
            description: 'List of tribes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tribes: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tribe' },
                    },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/search/suggestions': {
      get: {
        tags: ['Search'],
        summary: 'Get search suggestions',
        description: 'Get autocomplete suggestions for search queries',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 }, description: 'Search query' },
        ],
        responses: {
          '200': {
            description: 'Search suggestions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    suggestions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string', enum: ['resource', 'scholarship', 'tag'] },
                          text: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/chat': {
      post: {
        tags: ['Search'],
        summary: 'AI-powered chat assistant',
        description: 'Send a message to the AI assistant for resource recommendations',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', maxLength: 500, description: 'User message' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI response with recommendations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: { type: 'string' },
                    resources: { type: 'array', items: { $ref: '#/components/schemas/Resource' } },
                    scholarships: { type: 'array', items: { $ref: '#/components/schemas/Scholarship' } },
                  },
                },
              },
            },
          },
          '429': { description: 'Rate limit exceeded' },
        },
      },
    },
  },
  components: {
    schemas: {
      Resource: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['federal', 'state', 'tribal', 'emergency', 'scholarship'] },
          url: { type: 'string', format: 'uri' },
          state: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          eligibility: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Scholarship: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          amount: { type: 'string' },
          deadline: { type: 'string', format: 'date' },
          url: { type: 'string', format: 'uri' },
          tags: { type: 'array', items: { type: 'string' } },
          eligibility: { type: 'array', items: { type: 'string' } },
        },
      },
      Grant: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          amount: { type: 'string' },
          grantType: { type: 'string', enum: ['federal', 'state', 'tribal', 'foundation', 'corporate'] },
          fundingAgency: { type: 'string' },
          deadline: { type: 'string', format: 'date' },
          url: { type: 'string', format: 'uri' },
        },
      },
      Tribe: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          region: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          federalRecognitionStatus: { type: 'string' },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}
