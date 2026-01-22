---
sidebar_position: 11
title: TypeScript Guide
description: Using Claude Code effectively with TypeScript projects
---

# TypeScript with Claude Code

Master TypeScript development with Claude Code through type generation, refactoring, and idiomatic patterns.

## Type Generation

### Generate Types from Data

```text title="Prompt"
> Generate TypeScript types from this JSON response:
> {
>   "user": { "id": 1, "name": "John", "roles": ["admin", "user"] },
>   "metadata": { "lastLogin": "2024-01-15T10:30:00Z", "preferences": { "theme": "dark" } }
> }
```

```typescript title="Generated Types"
interface UserPreferences {
  theme: 'dark' | 'light';
}

interface UserMetadata {
  lastLogin: string;  // ISO 8601 datetime
  preferences: UserPreferences;
}

interface User {
  id: number;
  name: string;
  roles: ('admin' | 'user')[];
}

interface UserResponse {
  user: User;
  metadata: UserMetadata;
}
```

### Generate Types from API Specs

```text title="Prompt"
> Generate TypeScript types from this OpenAPI endpoint:
>
> /api/products:
>   get:
>     parameters:
>       - name: category
>         in: query
>         schema: { type: string }
>       - name: limit
>         in: query
>         schema: { type: integer, default: 10 }
>     responses:
>       200:
>         content:
>           application/json:
>             schema:
>               type: object
>               properties:
>                 items: { type: array, items: { $ref: '#/components/schemas/Product' } }
>                 total: { type: integer }
```

```typescript title="Generated Types"
interface GetProductsParams {
  category?: string;
  limit?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface GetProductsResponse {
  items: Product[];
  total: number;
}

// Type-safe fetch wrapper
async function getProducts(params: GetProductsParams): Promise<GetProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set('category', params.category);
  if (params.limit) searchParams.set('limit', String(params.limit));

  const response = await fetch(`/api/products?${searchParams}`);
  return response.json();
}
```

### Generate Zod Schemas with Types

```text title="Prompt"
> Create Zod schemas with inferred types for a user registration form
> with email, password (min 8 chars), and optional phone number
```

```typescript title="Generated Zod Schema"
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
});

// Inferred type from schema
export type UserRegistration = z.infer<typeof userRegistrationSchema>;

// Usage example
function registerUser(data: unknown): UserRegistration {
  return userRegistrationSchema.parse(data);
}
```

## Interface Extraction

### Extract Interface from Implementation

```text title="Prompt"
> Extract an interface from this UserService class
```

```typescript title="Before: Class Implementation"
class UserService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async findById(id: string): Promise<User | null> {
    return this.db.users.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.users.findUnique({ where: { email } });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.db.users.create({ data });
  }

  async update(id: string, data: Partial<CreateUserData>): Promise<User> {
    return this.db.users.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.users.delete({ where: { id } });
  }
}
```

```typescript title="After: Extracted Interface"
interface IUserService {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: Partial<CreateUserData>): Promise<User>;
  delete(id: string): Promise<void>;
}

class UserService implements IUserService {
  // ... implementation unchanged
}

// Now you can create mock implementations
class MockUserService implements IUserService {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
  // ... other methods
}
```

### Extract Common Interface from Multiple Classes

```text title="Prompt"
> Extract a common Repository interface from UserRepository and ProductRepository
```

```typescript title="Generated Generic Interface"
// Generic repository interface
interface Repository<T, CreateDTO, UpdateDTO = Partial<CreateDTO>> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}

interface FindOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

// Concrete implementations
class UserRepository implements Repository<User, CreateUserDTO> {
  // ... implementation
}

class ProductRepository implements Repository<Product, CreateProductDTO> {
  // ... implementation
}
```

## Generic Patterns

### Create Generic Data Structures

```text title="Prompt"
> Create a generic Result type for handling success/error states without exceptions
```

```typescript title="Result Type Pattern"
// Discriminated union for Result type
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions
function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage example
async function parseConfig(path: string): Promise<Result<Config, ConfigError>> {
  try {
    const content = await fs.readFile(path, 'utf-8');
    const config = JSON.parse(content);

    if (!isValidConfig(config)) {
      return err({ code: 'INVALID_CONFIG', message: 'Config validation failed' });
    }

    return ok(config);
  } catch (e) {
    return err({ code: 'READ_ERROR', message: String(e) });
  }
}

// Type-safe handling
const result = await parseConfig('./config.json');

if (result.success) {
  // TypeScript knows result.data is Config
  console.log(result.data.apiUrl);
} else {
  // TypeScript knows result.error is ConfigError
  console.error(result.error.message);
}
```

### Generic API Response Wrapper

```text title="Prompt"
> Create a generic paginated API response type with metadata
```

```typescript title="Paginated Response Pattern"
interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// Factory function with proper typing
function createPaginatedResponse<T>(
  items: T[],
  page: number,
  perPage: number,
  total: number,
  requestId: string
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / perPage);

  return {
    data: items,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };
}

// Usage
const response = createPaginatedResponse(users, 1, 10, 100, 'req-123');
// Type: PaginatedResponse<User>
```

### Generic Builder Pattern

```text title="Prompt"
> Create a type-safe builder pattern for constructing complex objects
```

```typescript title="Type-Safe Builder"
type Builder<T> = {
  [K in keyof T]-?: (value: T[K]) => Builder<T>;
} & {
  build(): T;
};

function createBuilder<T>(defaults: Partial<T> = {}): Builder<T> {
  const values: Partial<T> = { ...defaults };

  const builder = new Proxy({} as Builder<T>, {
    get(_, prop: string) {
      if (prop === 'build') {
        return () => values as T;
      }
      return (value: unknown) => {
        (values as Record<string, unknown>)[prop] = value;
        return builder;
      };
    },
  });

  return builder;
}

// Usage
interface QueryConfig {
  table: string;
  select: string[];
  where: Record<string, unknown>;
  limit: number;
  offset: number;
}

const query = createBuilder<QueryConfig>({ limit: 10, offset: 0 })
  .table('users')
  .select(['id', 'name', 'email'])
  .where({ active: true })
  .build();
```

## Type-Safe Refactoring

### Convert Any Types to Proper Types

```text title="Prompt"
> Refactor this function to remove all 'any' types and make it type-safe
```

```typescript title="Before: Using Any"
function processApiResponse(response: any): any {
  const items = response.data.items;
  return items.map((item: any) => ({
    id: item.id,
    name: item.name,
    date: new Date(item.created_at),
  }));
}
```

```typescript title="After: Type-Safe"
interface ApiItem {
  id: string;
  name: string;
  created_at: string;
}

interface ApiResponseData {
  items: ApiItem[];
}

interface ApiResponse {
  data: ApiResponseData;
}

interface ProcessedItem {
  id: string;
  name: string;
  date: Date;
}

function processApiResponse(response: ApiResponse): ProcessedItem[] {
  const { items } = response.data;
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    date: new Date(item.created_at),
  }));
}
```

### Add Type Guards

```text title="Prompt"
> Add type guards to safely handle this union type
```

```typescript title="Type Guards Implementation"
type NetworkResponse =
  | { status: 'success'; data: ResponseData }
  | { status: 'error'; error: NetworkError }
  | { status: 'loading' };

// Type guard functions
function isSuccess(response: NetworkResponse): response is { status: 'success'; data: ResponseData } {
  return response.status === 'success';
}

function isError(response: NetworkResponse): response is { status: 'error'; error: NetworkError } {
  return response.status === 'error';
}

function isLoading(response: NetworkResponse): response is { status: 'loading' } {
  return response.status === 'loading';
}

// Usage with narrowed types
function handleResponse(response: NetworkResponse): string {
  if (isSuccess(response)) {
    // TypeScript knows response.data exists
    return `Received: ${response.data.message}`;
  }

  if (isError(response)) {
    // TypeScript knows response.error exists
    return `Error: ${response.error.code}`;
  }

  // TypeScript knows this is loading state
  return 'Loading...';
}
```

## JavaScript to TypeScript Migration

### Convert JavaScript File to TypeScript

```text title="Prompt"
> Convert this JavaScript module to TypeScript with proper types
```

```javascript title="Before: JavaScript"
// utils.js
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
}
```

```typescript title="After: TypeScript"
// utils.ts
type AnyFunction = (...args: unknown[]) => unknown;

export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

type DeepCloneable =
  | string
  | number
  | boolean
  | null
  | undefined
  | DeepCloneable[]
  | { [key: string]: DeepCloneable };

export function deepClone<T extends DeepCloneable>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value as DeepCloneable)])
  ) as T;
}
```

### Migrate Module with Dependencies

```text title="Prompt"
> Migrate this Express route handler to TypeScript with typed request/response
```

```typescript title="Typed Express Handler"
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define request body types
interface CreateUserBody {
  email: string;
  password: string;
  name?: string;
}

// Define response types
interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

interface ErrorResponse {
  error: string;
  details?: Record<string, string>;
}

// Typed request interface
interface TypedRequest<T> extends Request {
  body: T;
}

// Handler with full type safety
export const createUser: RequestHandler = async (
  req: TypedRequest<CreateUserBody>,
  res: Response<UserResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        error: 'Validation failed',
        details: {
          email: !email ? 'Email is required' : '',
          password: !password ? 'Password is required' : '',
        },
      });
      return;
    }

    const user = await userService.create({ email, password, name });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
```

## Strict Mode Adoption

### Enable Strict Mode Incrementally

```text title="Prompt"
> Help me enable strict mode in my TypeScript project incrementally
```

```json title="tsconfig.json - Incremental Strict Mode"
{
  "compilerOptions": {
    // Start with these (least disruptive)
    "strict": false,
    "noImplicitAny": true,           // Step 1: Catch implicit any
    "strictNullChecks": false,       // Step 2: Enable after fixing any
    "strictFunctionTypes": false,    // Step 3: Stricter function checks
    "strictBindCallApply": false,    // Step 4: Bind/call/apply checks
    "strictPropertyInitialization": false, // Step 5: Class property checks
    "noImplicitThis": false,         // Step 6: This type checks
    "alwaysStrict": true,            // Emit 'use strict'

    // Additional checks (optional)
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true // Strict array/object access
  }
}
```

### Fix strictNullChecks Errors

```text title="Prompt"
> Fix this code to work with strictNullChecks enabled
```

```typescript title="Before: Null Safety Issues"
interface User {
  name: string;
  email?: string;
  address?: {
    street: string;
    city: string;
  };
}

function getUserCity(user: User): string {
  return user.address.city;  // Error: Object is possibly 'undefined'
}

function sendEmail(user: User): void {
  sendTo(user.email);  // Error: Argument may be undefined
}
```

```typescript title="After: Null-Safe Code"
interface User {
  name: string;
  email?: string;
  address?: {
    street: string;
    city: string;
  };
}

// Option 1: Optional chaining with default
function getUserCity(user: User): string {
  return user.address?.city ?? 'Unknown';
}

// Option 2: Type guard
function getUserCityOrThrow(user: User): string {
  if (!user.address) {
    throw new Error('User has no address');
  }
  return user.address.city;  // TypeScript knows address exists
}

// Option 3: Assertion function
function assertDefined<T>(value: T | undefined | null, name: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(`${name} is not defined`);
  }
}

function sendEmail(user: User): void {
  assertDefined(user.email, 'user.email');
  sendTo(user.email);  // TypeScript knows email is string
}

// Option 4: Filter out undefined
function sendEmailsToUsers(users: User[]): void {
  const emails = users
    .map(u => u.email)
    .filter((email): email is string => email !== undefined);

  emails.forEach(email => sendTo(email));
}
```

## Type Narrowing

### Discriminated Unions

```text title="Prompt"
> Create a discriminated union for handling different message types
```

```typescript title="Discriminated Union Pattern"
// Base message with discriminant
interface BaseMessage {
  id: string;
  timestamp: Date;
}

interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

interface ImageMessage extends BaseMessage {
  type: 'image';
  url: string;
  dimensions: { width: number; height: number };
}

interface VideoMessage extends BaseMessage {
  type: 'video';
  url: string;
  duration: number;
  thumbnail: string;
}

type Message = TextMessage | ImageMessage | VideoMessage;

// Exhaustive type narrowing
function renderMessage(message: Message): string {
  switch (message.type) {
    case 'text':
      return `<p>${message.content}</p>`;

    case 'image':
      return `<img src="${message.url}" width="${message.dimensions.width}" />`;

    case 'video':
      return `
        <video src="${message.url}" poster="${message.thumbnail}">
          Duration: ${message.duration}s
        </video>
      `;

    default:
      // Exhaustiveness check - this should never happen
      const _exhaustive: never = message;
      throw new Error(`Unknown message type: ${_exhaustive}`);
  }
}
```

### Custom Type Predicates

```text title="Prompt"
> Create type predicates for runtime type checking
```

```typescript title="Type Predicates"
interface Dog {
  kind: 'dog';
  bark(): void;
}

interface Cat {
  kind: 'cat';
  meow(): void;
}

interface Bird {
  kind: 'bird';
  fly(): void;
}

type Animal = Dog | Cat | Bird;

// Type predicate functions
function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog';
}

function isCat(animal: Animal): animal is Cat {
  return animal.kind === 'cat';
}

function isBird(animal: Animal): animal is Bird {
  return animal.kind === 'bird';
}

// Generic type predicate factory
function isOfKind<T extends Animal['kind']>(
  kind: T
): (animal: Animal) => animal is Extract<Animal, { kind: T }> {
  return (animal): animal is Extract<Animal, { kind: T }> => animal.kind === kind;
}

// Usage
const animals: Animal[] = getAnimals();

// Filter with type narrowing
const dogs = animals.filter(isDog);  // Type: Dog[]
const cats = animals.filter(isOfKind('cat'));  // Type: Cat[]

// Process with narrowed types
dogs.forEach(dog => dog.bark());
cats.forEach(cat => cat.meow());
```

## Utility Types Usage

### Built-in Utility Types

```text title="Prompt"
> Show me how to use TypeScript utility types effectively
```

```typescript title="Utility Types Examples"
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Partial<T> - All properties optional
type UserUpdate = Partial<User>;

// Required<T> - All properties required
type CompleteUser = Required<User>;

// Pick<T, K> - Select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit<T, K> - Exclude specific properties
type PublicUser = Omit<User, 'password'>;

// Readonly<T> - All properties readonly
type ImmutableUser = Readonly<User>;

// Record<K, V> - Object type with specific keys and values
type UserRoles = Record<User['role'], string[]>;

// Extract<T, U> - Extract types assignable to U
type StringFields = Extract<keyof User, string>;

// Exclude<T, U> - Exclude types assignable to U
type NonIdFields = Exclude<keyof User, 'id'>;

// NonNullable<T> - Remove null and undefined
type DefinitelyString = NonNullable<string | null | undefined>;

// ReturnType<T> - Get function return type
type GetUserReturn = ReturnType<typeof getUser>;

// Parameters<T> - Get function parameter types
type GetUserParams = Parameters<typeof getUser>;

// Awaited<T> - Unwrap Promise type
type UserData = Awaited<ReturnType<typeof fetchUser>>;
```

### Custom Utility Types

```text title="Prompt"
> Create custom utility types for common patterns
```

```typescript title="Custom Utility Types"
// DeepPartial - Recursive partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// DeepReadonly - Recursive readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Mutable - Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// RequiredKeys - Get required property keys
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// OptionalKeys - Get optional property keys
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Nullable - Make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// PickByValue - Pick properties by value type
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// OmitByValue - Omit properties by value type
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

// Usage examples
interface Config {
  api: {
    url: string;
    timeout: number;
    retries: number;
  };
  features: {
    darkMode: boolean;
    notifications: boolean;
  };
}

type PartialConfig = DeepPartial<Config>;
// { api?: { url?: string; timeout?: number; retries?: number }; ... }

type ReadonlyConfig = DeepReadonly<Config>;
// All nested properties are readonly
```

## Declaration Files

### Generate Declaration Files for JavaScript Libraries

```text title="Prompt"
> Create a declaration file for this JavaScript utility library
```

```typescript title="types/legacy-utils.d.ts"
declare module 'legacy-utils' {
  export interface FormatOptions {
    locale?: string;
    currency?: string;
    decimals?: number;
  }

  export interface DateFormatOptions {
    format?: 'short' | 'medium' | 'long';
    includeTime?: boolean;
    timezone?: string;
  }

  /**
   * Formats a number as currency
   */
  export function formatCurrency(
    amount: number,
    options?: FormatOptions
  ): string;

  /**
   * Formats a date string
   */
  export function formatDate(
    date: Date | string | number,
    options?: DateFormatOptions
  ): string;

  /**
   * Deep merges multiple objects
   */
  export function deepMerge<T extends object>(
    target: T,
    ...sources: Partial<T>[]
  ): T;

  /**
   * Debounces a function
   */
  export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
  ): (...args: Parameters<T>) => void;

  /**
   * Event emitter class
   */
  export class EventEmitter<Events extends Record<string, any[]>> {
    on<E extends keyof Events>(
      event: E,
      listener: (...args: Events[E]) => void
    ): this;

    off<E extends keyof Events>(
      event: E,
      listener: (...args: Events[E]) => void
    ): this;

    emit<E extends keyof Events>(
      event: E,
      ...args: Events[E]
    ): boolean;
  }
}
```

### Augment Existing Module Types

```text title="Prompt"
> Extend Express Request type with custom properties
```

```typescript title="types/express.d.ts"
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId: string;
      startTime: number;
    }

    interface Response {
      success<T>(data: T, statusCode?: number): void;
      error(message: string, statusCode?: number): void;
    }
  }
}

// Must export something to make this a module
export {};
```

```typescript title="Usage in middleware"
import { Request, Response, NextFunction } from 'express';

// Now TypeScript knows about custom properties
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = validateToken(req.headers.authorization);

  if (!user) {
    return res.error('Unauthorized', 401);
  }

  req.user = user;  // TypeScript knows this property exists
  next();
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function<T>(data: T, statusCode = 200) {
    this.status(statusCode).json({ success: true, data });
  };

  res.error = function(message: string, statusCode = 500) {
    this.status(statusCode).json({ success: false, error: message });
  };

  next();
}
```

## Best Practices

### Configure tsconfig.json Properly

```text title="Prompt"
> Create an optimal tsconfig.json for a Node.js backend project
```

```json title="tsconfig.json"
{
  "compilerOptions": {
    // Type checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // Module system
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "resolveJsonModule": true,

    // Output
    "target": "ES2022",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/models/*": ["src/models/*"],
      "@/services/*": ["src/services/*"],
      "@/utils/*": ["src/utils/*"]
    },

    // Other
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Type Organization

```text title="Prompt"
> Show me how to organize types in a large TypeScript project
```

```
src/
├── types/
│   ├── index.ts           # Re-exports all types
│   ├── api.ts             # API request/response types
│   ├── models.ts          # Domain model types
│   ├── database.ts        # Database-related types
│   ├── events.ts          # Event types
│   └── utils.ts           # Utility types
├── models/
│   ├── User.ts            # User model with types
│   └── Product.ts         # Product model with types
└── services/
    └── UserService.ts     # Service with typed methods
```

```typescript title="types/index.ts"
// Centralized type exports
export * from './api';
export * from './models';
export * from './database';
export * from './events';
export * from './utils';

// Type-only re-exports for better tree-shaking
export type { User, UserRole } from '../models/User';
export type { Product, ProductCategory } from '../models/Product';
```

### Common Patterns

```typescript title="Recommended Patterns"
// 1. Prefer interfaces for object shapes (extendable)
interface User {
  id: string;
  name: string;
}

// 2. Use type aliases for unions and complex types
type Status = 'pending' | 'active' | 'completed';
type Callback<T> = (error: Error | null, result: T) => void;

// 3. Use const assertions for literal types
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];  // 'admin' | 'user' | 'guest'

// 4. Use branded types for type safety
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

// 5. Use satisfies for type checking without widening
const config = {
  api: 'https://api.example.com',
  timeout: 5000,
} satisfies Record<string, string | number>;
// config.api is still string (not string | number)

// 6. Use template literal types for string patterns
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = `/${string}`;
type ApiEndpoint = `${HttpMethod} ${ApiRoute}`;

const endpoint: ApiEndpoint = 'GET /users';  // Valid
```

## Claude Code TypeScript Commands

### Quick Commands

```text title="Common TypeScript Prompts"
# Generate types from data
> Generate TypeScript types from this JSON: {...}

# Add types to function
> Add proper TypeScript types to this function

# Create interface
> Create an interface for the User model with these fields: ...

# Fix type errors
> Fix all TypeScript errors in this file

# Migrate to strict mode
> Help me fix strict mode errors in this file

# Generate declaration file
> Create a .d.ts file for this JavaScript module

# Extract types
> Extract the type definitions into a separate types.ts file

# Add generics
> Make this function generic so it works with any type
```

### Automated Type Generation

```bash title="scripts/generate-types.sh"
#!/bin/bash
# Generate types from API responses

API_URL="${1:?API URL required}"
OUTPUT="${2:-src/types/api-generated.ts}"

# Fetch sample responses and generate types
claude -p "Fetch these API endpoints and generate TypeScript types:

URL: $API_URL

For each endpoint:
1. Document the expected response shape
2. Generate proper TypeScript interfaces
3. Include JSDoc comments
4. Export all types

Output as a single TypeScript file."  > "$OUTPUT"

echo "Generated types: $OUTPUT"
```

## Next Steps

- [Python Guide](/guides/python-guide) - Python development with Claude Code
- [React Guide](/guides/react-guide) - React development patterns
- [Best Practices](/guides/best-practices) - General best practices
- [Workflow Patterns](/guides/workflow-patterns) - Development workflows
