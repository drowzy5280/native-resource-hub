import {
  ResourceTypeEnum,
  UserRoleEnum,
  UserSchema,
  ResourceSchema,
  ScholarshipSchema,
  PaginationSchema,
  SearchQuerySchema,
} from '@/lib/validators'

describe('validator schemas', () => {
  describe('ResourceTypeEnum', () => {
    it('accepts valid resource types', () => {
      expect(() => ResourceTypeEnum.parse('federal')).not.toThrow()
      expect(() => ResourceTypeEnum.parse('state')).not.toThrow()
      expect(() => ResourceTypeEnum.parse('tribal')).not.toThrow()
      expect(() => ResourceTypeEnum.parse('scholarship')).not.toThrow()
      expect(() => ResourceTypeEnum.parse('emergency')).not.toThrow()
    })

    it('rejects invalid resource types', () => {
      expect(() => ResourceTypeEnum.parse('invalid')).toThrow()
    })
  })

  describe('UserRoleEnum', () => {
    it('accepts valid user roles', () => {
      expect(() => UserRoleEnum.parse('user')).not.toThrow()
      expect(() => UserRoleEnum.parse('admin')).not.toThrow()
    })

    it('rejects invalid user roles', () => {
      expect(() => UserRoleEnum.parse('superadmin')).toThrow()
    })
  })

  describe('UserSchema', () => {
    it('validates a valid user object', () => {
      const user = {
        email: 'user@example.com',
        role: 'user',
        tags: ['tag1', 'tag2'],
      }

      const result = UserSchema.parse(user)
      expect(result.email).toBe('user@example.com')
      expect(result.role).toBe('user')
    })

    it('sets default role to user', () => {
      const user = {
        email: 'user@example.com',
      }

      const result = UserSchema.parse(user)
      expect(result.role).toBe('user')
    })

    it('rejects invalid email', () => {
      const user = {
        email: 'not-an-email',
      }

      expect(() => UserSchema.parse(user)).toThrow()
    })

    it('validates birth year range', () => {
      const validUser = {
        email: 'user@example.com',
        birthYear: 1990,
      }

      expect(() => UserSchema.parse(validUser)).not.toThrow()

      const invalidUser = {
        email: 'user@example.com',
        birthYear: 1800,
      }

      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })
  })

  describe('ResourceSchema', () => {
    it('validates a valid resource object', () => {
      const resource = {
        type: 'federal',
        title: 'Test Resource',
        description: 'A test resource description',
        url: 'https://example.com',
        tags: ['education', 'health'],
      }

      const result = ResourceSchema.parse(resource)
      expect(result.type).toBe('federal')
      expect(result.title).toBe('Test Resource')
    })

    it('requires title and description', () => {
      const invalidResource = {
        type: 'federal',
        title: '',
        description: 'Description',
      }

      expect(() => ResourceSchema.parse(invalidResource)).toThrow()
    })

    it('validates URL format', () => {
      const invalidResource = {
        type: 'federal',
        title: 'Test',
        description: 'Description',
        url: 'not-a-url',
      }

      expect(() => ResourceSchema.parse(invalidResource)).toThrow()
    })

    it('sets default empty arrays', () => {
      const resource = {
        type: 'federal',
        title: 'Test',
        description: 'Description',
      }

      const result = ResourceSchema.parse(resource)
      expect(result.tags).toEqual([])
      expect(result.eligibility).toEqual([])
    })
  })

  describe('ScholarshipSchema', () => {
    it('validates a valid scholarship object', () => {
      const scholarship = {
        name: 'Test Scholarship',
        amount: '$5,000',
        deadline: '2024-12-31',
        description: 'A test scholarship',
        url: 'https://example.com',
      }

      const result = ScholarshipSchema.parse(scholarship)
      expect(result.name).toBe('Test Scholarship')
      expect(result.deadline).toBeInstanceOf(Date)
    })

    it('coerces date strings to Date objects', () => {
      const scholarship = {
        name: 'Test',
        description: 'Test',
        deadline: '2024-12-31',
      }

      const result = ScholarshipSchema.parse(scholarship)
      expect(result.deadline).toBeInstanceOf(Date)
    })

    it('accepts scholarship without deadline', () => {
      const scholarship = {
        name: 'Rolling Scholarship',
        description: 'No deadline',
      }

      const result = ScholarshipSchema.parse(scholarship)
      expect(result.deadline).toBeUndefined()
    })
  })

  describe('PaginationSchema', () => {
    it('validates pagination parameters', () => {
      const params = {
        page: 2,
        limit: 50,
        sort: 'createdAt',
        order: 'desc',
      }

      const result = PaginationSchema.parse(params)
      expect(result.page).toBe(2)
      expect(result.limit).toBe(50)
    })

    it('sets default values', () => {
      const result = PaginationSchema.parse({})
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
      expect(result.order).toBe('desc')
    })

    it('coerces string numbers to integers', () => {
      const params = {
        page: '3',
        limit: '25',
      }

      const result = PaginationSchema.parse(params)
      expect(result.page).toBe(3)
      expect(result.limit).toBe(25)
    })

    it('enforces limit maximum of 100', () => {
      const params = {
        limit: 150,
      }

      expect(() => PaginationSchema.parse(params)).toThrow()
    })

    it('enforces minimum page of 1', () => {
      const params = {
        page: 0,
      }

      expect(() => PaginationSchema.parse(params)).toThrow()
    })
  })

  describe('SearchQuerySchema', () => {
    it('validates search query parameters', () => {
      const query = {
        q: 'education',
        state: 'CA',
        tags: ['health', 'youth'],
        type: 'federal',
      }

      const result = SearchQuerySchema.parse(query)
      expect(result.q).toBe('education')
      expect(result.type).toBe('federal')
    })

    it('accepts partial search parameters', () => {
      const query = {
        q: 'test',
      }

      const result = SearchQuerySchema.parse(query)
      expect(result.q).toBe('test')
      expect(result.state).toBeUndefined()
    })

    it('accepts empty search query', () => {
      const result = SearchQuerySchema.parse({})
      expect(result.q).toBeUndefined()
    })
  })
})
