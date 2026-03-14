# Clean Architecture - NestJS Backend

## 🏛️ Princípios Fundamentais

Clean Architecture é uma abordagem de design de software que promove:
1. **Independência de frameworks** - O core business não depende de frameworks
2. **Testabilidade** - Regras de negócio podem ser testadas sem UI, DB, servidor
3. **Independência de UI** - A UI pode mudar sem afetar o sistema
4. **Independência de banco de dados** - O BD pode ser trocado
5. **Independência de agentes externos** - Regras de negócio não sabem nada do mundo exterior

---

## 🎯 Camadas da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Controllers, DTOs, Guards)                 │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Application Layer                     │  │
│  │           (Use Cases, Services)                    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         Domain Layer                      │    │  │
│  │  │    (Entities, Business Rules)             │    │  │
│  │  │                                           │    │  │
│  │  │  ┌─────────────────────────────────┐    │    │  │
│  │  │  │      Core Business Logic         │    │    │  │
│  │  │  │   (Pure TypeScript Objects)      │    │    │  │
│  │  │  └─────────────────────────────────┘    │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Infrastructure Layer                     │  │
│  │     (Prisma, Redis, External APIs)                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dependency Rule (Regra de Dependência)

**CRITICAL**: Dependências sempre apontam para DENTRO (para o core)

```
Infrastructure → Application → Domain → Core
     ↓               ↓           ↓         ↓
  Prisma       Use Cases    Entities   Business
  Redis         Services     Value Obj  Logic
  APIs          DTOs         Rules
```

**❌ NUNCA:**
- Core/Domain depender de Infrastructure
- Entities depender de frameworks
- Business rules depender de Prisma

**✅ SEMPRE:**
- Infrastructure depende de Application
- Application depende de Domain
- Domain é independente

---

## 📁 Estrutura de Diretórios (NestJS + Clean Architecture)

```
src/
├── main.ts                           # Entry point
│
├── core/                             # CAMADA 1: Core Business Logic
│   ├── domain/                       # Regras de negócio puras
│   │   ├── entities/                 # Entities de negócio (não Prisma!)
│   │   │   ├── user.entity.ts
│   │   │   └── post.entity.ts
│   │   ├── value-objects/            # Value Objects imutáveis
│   │   │   ├── email.vo.ts
│   │   │   ├── password.vo.ts
│   │   │   └── money.vo.ts
│   │   ├── enums/                    # Enums de domínio
│   │   │   ├── user-status.enum.ts
│   │   │   └── post-status.enum.ts
│   │   └── exceptions/               # Business exceptions
│   │       ├── invalid-email.exception.ts
│   │       └── insufficient-balance.exception.ts
│   │
│   ├── use-cases/                    # CAMADA 2: Application Logic
│   │   ├── user/
│   │   │   ├── create-user.use-case.ts
│   │   │   ├── update-user.use-case.ts
│   │   │   ├── delete-user.use-case.ts
│   │   │   └── get-user.use-case.ts
│   │   ├── auth/
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   └── refresh-token.use-case.ts
│   │   └── post/
│   │       ├── create-post.use-case.ts
│   │       └── publish-post.use-case.ts
│   │
│   └── repositories/                 # Repository Interfaces (Ports)
│       ├── user.repository.interface.ts
│       ├── post.repository.interface.ts
│       └── transaction.repository.interface.ts
│
├── infrastructure/                   # CAMADA 3: Infrastructure
│   ├── database/                     # Prisma (Adapter)
│   │   ├── typeorm/
│   │   │   ├── entities/             # Prisma entities (mappers)
│   │   │   │   ├── user.schema.ts
│   │   │   │   └── post.schema.ts
│   │   │   ├── repositories/         # Repository implementations
│   │   │   │   ├── user.repository.impl.ts
│   │   │   │   └── post.repository.impl.ts
│   │   │   ├── migrations/
│   │   │   └── seeders/
│   │   │
│   │   └── typeorm.config.ts
│   │
│   ├── cache/                        # Redis (Adapter)
│   │   ├── redis.module.ts
│   │   └── redis.service.ts
│   │
│   ├── messaging/                    # Message Queue (Adapter)
│   │   ├── rabbitmq/
│   │   └── kafka/
│   │
│   ├── external-services/            # External APIs (Adapters)
│   │   ├── email/
│   │   │   ├── email.service.interface.ts
│   │   │   └── sendgrid.service.ts
│   │   ├── storage/
│   │   │   ├── storage.service.interface.ts
│   │   │   └── s3.service.ts
│   │   └── payment/
│   │       ├── payment.service.interface.ts
│   │       └── stripe.service.ts
│   │
│   └── config/                       # Configuration
│       ├── database.config.ts
│       ├── jwt.config.ts
│       └── app.config.ts
│
├── presentation/                     # CAMADA 4: Presentation (API)
│   ├── http/                         # REST API
│   │   ├── controllers/
│   │   │   ├── user.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── post.controller.ts
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── mappers/                  # DTO ↔ Entity mappers
│   │   │   └── user.mapper.ts
│   │   └── middlewares/
│   │       ├── logger.middleware.ts
│   │       └── rate-limit.middleware.ts
│   │
│   ├── graphql/                      # GraphQL (se usar)
│   │   ├── resolvers/
│   │   └── schemas/
│   │
│   └── websocket/                    # WebSocket (se usar)
│       └── gateways/
│
└── common/                           # Shared/Common
    ├── decorators/
    ├── guards/
    │   ├── jwt-auth.guard.ts
    │   └── roles.guard.ts
    ├── interceptors/
    │   ├── transform.interceptor.ts
    │   └── logging.interceptor.ts
    ├── pipes/
    │   └── validation.pipe.ts
    ├── filters/
    │   └── http-exception.filter.ts
    └── utils/
        ├── date.util.ts
        └── string.util.ts
```

---

## 🔧 Implementação Detalhada

### 1. **Domain Layer** (Core Business Logic)

#### 1.1 Domain Entity (NÃO é Prisma Entity!)

```typescript
// src/core/domain/entities/user.entity.ts
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserStatus } from '../enums/user-status.enum';

/**
 * Domain Entity - Pure TypeScript
 * SEM decorators do Prisma
 * SEM dependências de frameworks
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    private _password: Password,
    public name: string,
    public status: UserStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Business logic methods
  public changePassword(oldPassword: string, newPassword: string): void {
    if (!this._password.matches(oldPassword)) {
      throw new InvalidPasswordException('Current password is incorrect');
    }

    this._password = Password.create(newPassword);
    this.updatedAt = new Date();
  }

  public activate(): void {
    if (this.status === UserStatus.ACTIVE) {
      throw new BusinessException('User is already active');
    }

    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  // Getters para encapsulamento
  public getPasswordHash(): string {
    return this._password.value;
  }

  public validatePassword(plainPassword: string): boolean {
    return this._password.matches(plainPassword);
  }
}
```

#### 1.2 Value Objects

```typescript
// src/core/domain/value-objects/email.vo.ts

/**
 * Value Object - Imutável
 * Contém validação de negócio
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new InvalidEmailException('Invalid email format');
    }

    return new Email(email.toLowerCase().trim());
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public getDomain(): string {
    return this._value.split('@')[1];
  }
}
```

```typescript
// src/core/domain/value-objects/password.vo.ts
import * as bcrypt from 'bcrypt';

export class Password {
  private readonly _hash: string;

  private constructor(hash: string) {
    this._hash = hash;
  }

  public static async create(plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) {
      throw new InvalidPasswordException('Password must be at least 8 characters');
    }

    const hash = await bcrypt.hash(plainPassword, 12);
    return new Password(hash);
  }

  public static fromHash(hash: string): Password {
    return new Password(hash);
  }

  public async matches(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this._hash);
  }

  public get value(): string {
    return this._hash;
  }
}
```

#### 1.3 Repository Interface (Port)

```typescript
// src/core/repositories/user.repository.interface.ts
import { User } from '../domain/entities/user.entity';
import { Email } from '../domain/value-objects/email.vo';

/**
 * Repository Interface (Port)
 * Define o contrato, não a implementação
 * O Domain define o que precisa, Infrastructure implementa
 */
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(page: number, limit: number): Promise<User[]>;
  delete(id: string): Promise<void>;
  exists(email: Email): Promise<boolean>;
}

// Token for dependency injection
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
```

---

### 2. **Use Cases Layer** (Application Logic)

```typescript
// src/core/use-cases/user/create-user.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { IUserRepository, USER_REPOSITORY } from '../../repositories/user.repository.interface';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

/**
 * Use Case - Orquestra a lógica de aplicação
 * Coordena entities, value objects e repositories
 * Não contém regras de negócio (isso fica nas entities)
 */

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserOutput {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // 1. Create value objects
    const email = Email.create(input.email);
    const password = await Password.create(input.password);

    // 2. Validate business rules
    const userExists = await this.userRepository.exists(email);
    if (userExists) {
      throw new UserAlreadyExistsException('User with this email already exists');
    }

    // 3. Create domain entity
    const user = new User(
      crypto.randomUUID(),
      email,
      password,
      input.name,
      UserStatus.PENDING_ACTIVATION,
      new Date(),
      new Date(),
    );

    // 4. Persist
    const savedUser = await this.userRepository.save(user);

    // 5. Return output (DTO)
    return {
      id: savedUser.id,
      email: savedUser.email.value,
      name: savedUser.name,
      status: savedUser.status,
      createdAt: savedUser.createdAt,
    };
  }
}
```

```typescript
// src/core/use-cases/auth/login.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Email } from '../../domain/value-objects/email.vo';
import { IUserRepository, USER_REPOSITORY } from '../../repositories/user.repository.interface';
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    // 1. Find user by email
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // 2. Validate password (business logic in entity)
    const isPasswordValid = await user.validatePassword(input.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // 3. Check if user is active
    if (!user.isActive()) {
      throw new UserNotActiveException('User account is not active');
    }

    // 4. Generate tokens
    const payload = { sub: user.id, email: user.email.value };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }
}
```

---

### 3. **Infrastructure Layer** (Adapters)

#### 3.1 Prisma Schema (Database Schema)

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid()) @db.Uuid
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  name      String   @db.VarChar(255)
  status    String   @db.VarChar(20)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@map("users")
}
```

**Importante:** Prisma schema é declarativo e separado das Domain Entities!
- Schema define estrutura do banco
- Domain Entities definem regras de negócio
- Mapper converte entre os dois

#### 3.2 Repository Implementation with Prisma (Adapter)

```typescript
// src/infrastructure/database/prisma/repositories/user.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '../../../../core/repositories/user.repository.interface';
import { User } from '../../../../core/domain/entities/user.entity';
import { Email } from '../../../../core/domain/value-objects/email.vo';
import { Password } from '../../../../core/domain/value-objects/password.vo';
import { UserStatus } from '../../../../core/domain/enums/user-status.enum';
import { User as PrismaUser } from '@prisma/client';

/**
 * Repository Implementation (Adapter)
 * Converte entre Domain Entity e Prisma Model
 */
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    // Domain Entity → Prisma Data
    const data = {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
      name: user.name,
      status: user.status.toString(),
    };

    // Upsert (create or update)
    const prismaUser = await this.prisma.user.upsert({
      where: { id: user.id },
      create: data,
      update: data,
    });

    // Prisma Model → Domain Entity
    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.value },
    });
    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map(prismaUser => this.toDomain(prismaUser));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value },
    });
    return count > 0;
  }

  // Mapper: Prisma Model → Domain Entity
  private toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      Email.create(prismaUser.email),
      Password.fromHash(prismaUser.password),
      prismaUser.name,
      prismaUser.status as UserStatus,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
```

---

### 4. **Presentation Layer** (Controllers)

```typescript
// src/presentation/http/controllers/user.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../core/use-cases/user/create-user.use-case';
import { GetUserUseCase } from '../../../core/use-cases/user/get-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

/**
 * Controller - Presentation Layer
 * Apenas lida com HTTP
 * Delega lógica para Use Cases
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    // DTO → Use Case Input
    const input = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
    };

    // Execute Use Case
    const output = await this.createUserUseCase.execute(input);

    // Use Case Output → Response DTO
    return this.userMapper.toResponseDto(output);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const output = await this.getUserUseCase.execute({ id });
    return this.userMapper.toResponseDto(output);
  }
}
```

---

## 🎯 Princípios SOLID Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada classe tem uma única responsabilidade:
- **Entity**: Regras de negócio do domínio
- **Use Case**: Orquestração de um caso de uso
- **Repository**: Persistência de dados
- **Controller**: Lidar com requisições HTTP

### 2. **Open/Closed Principle (OCP)**
```typescript
// ✅ Aberto para extensão, fechado para modificação
interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class SendGridEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // SendGrid implementation
  }
}

class MailgunEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Mailgun implementation
  }
}

// Use Case depende da interface, não da implementação
class SendWelcomeEmailUseCase {
  constructor(private emailService: IEmailService) {}
}
```

### 3. **Liskov Substitution Principle (LSP)**
Implementações devem ser substituíveis:

```typescript
// Qualquer implementação de IUserRepository pode ser usada
class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  // Funciona com InMemoryRepository, PrismaRepository, MongoRepository, etc.
}
```

### 4. **Interface Segregation Principle (ISP)**
```typescript
// ❌ Interface muito grande
interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User>;
  delete(id: string): Promise<void>;
  sendEmail(email: string): Promise<void>; // ❌ Não deveria estar aqui!
  uploadAvatar(file: Buffer): Promise<string>; // ❌ Não deveria estar aqui!
}

// ✅ Interfaces segregadas
interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User>;
  delete(id: string): Promise<void>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface IStorageService {
  upload(file: Buffer): Promise<string>;
}
```

### 5. **Dependency Inversion Principle (DIP)**
```typescript
// ✅ Use Case depende de abstração (interface), não de implementação
class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(EMAIL_SERVICE) private emailService: IEmailService,
  ) {}
}

// Infrastructure implementa as abstrações
@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl, // ← Pode trocar facilmente
    },
    {
      provide: EMAIL_SERVICE,
      useClass: SendGridEmailService, // ← Pode trocar facilmente
    },
  ],
})
export class InfrastructureModule {}
```

---

## ❌ Anti-Patterns a Evitar

### 1. **Anemic Domain Model**
```typescript
// ❌ Entity sem comportamento (apenas getters/setters)
class User {
  id: string;
  email: string;
  password: string;
  status: string;
}

// Lógica de negócio no service
class UserService {
  changePassword(user: User, newPassword: string) {
    // Validações e lógica aqui ❌
    user.password = hash(newPassword);
  }
}

// ✅ Rich Domain Model
class User {
  changePassword(oldPassword: string, newPassword: string): void {
    if (!this.password.matches(oldPassword)) {
      throw new InvalidPasswordException();
    }
    this.password = Password.create(newPassword);
  }
}
```

### 2. **Domain depender de Infrastructure**
```typescript
// ❌ Domain Entity com dependência de ORM
// NUNCA use decorators de Prisma, Prisma ou qualquer framework!
import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  // ❌ Acoplado ao Prisma!
  email: string;
  password: string;
}

// ✅ Domain Entity puro (sem imports de framework)
export class User {
  constructor(
    public readonly email: Email,  // Value Object
    private _password: Password,   // Value Object
  ) {}

  // Lógica de negócio aqui
  changePassword(oldPassword: string, newPassword: string): void {
    if (!this._password.verify(oldPassword)) {
      throw new InvalidPasswordException();
    }
    this._password = Password.create(newPassword);
  }
}
```

### 3. **Use Cases com lógica de negócio**
```typescript
// ❌ Lógica de negócio no Use Case
class CreateUserUseCase {
  execute(input: CreateUserInput) {
    // ❌ Validações de negócio aqui
    if (input.password.length < 8) {
      throw new Error('Password too short');
    }
    // ...
  }
}

// ✅ Lógica de negócio na Entity ou Value Object
class Password {
  static create(value: string): Password {
    // ✅ Validações aqui
    if (value.length < 8) {
      throw new InvalidPasswordException();
    }
    return new Password(hash(value));
  }
}
```

### 4. **Controllers com lógica de negócio**
```typescript
// ❌ Lógica no Controller
@Post()
async create(@Body() dto: CreateUserDto) {
  // ❌ Validações e lógica aqui
  if (await this.userRepo.findByEmail(dto.email)) {
    throw new ConflictException('User exists');
  }
  const user = await this.userRepo.save(dto);
  return user;
}

// ✅ Delegar para Use Case
@Post()
async create(@Body() dto: CreateUserDto) {
  return this.createUserUseCase.execute(dto);
}
```

---

## 🧪 Testabilidade

### Testes de Domain Entities (Puros)
```typescript
describe('User Entity', () => {
  it('should change password when old password is correct', async () => {
    // Arrange
    const user = new User(
      '1',
      Email.create('test@example.com'),
      await Password.create('oldPassword123'),
      'John Doe',
      UserStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    // Act
    await user.changePassword('oldPassword123', 'newPassword456');

    // Assert
    expect(await user.validatePassword('newPassword456')).toBe(true);
  });

  it('should throw error when old password is incorrect', async () => {
    const user = new User(...);

    await expect(
      user.changePassword('wrongPassword', 'newPassword456')
    ).rejects.toThrow(InvalidPasswordException);
  });
});
```

### Testes de Use Cases (Com Mocks)
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      exists: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository);
  });

  it('should create user when email does not exist', async () => {
    // Arrange
    userRepository.exists.mockResolvedValue(false);
    userRepository.save.mockResolvedValue(/* user */);

    // Act
    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
    });

    // Assert
    expect(result.email).toBe('test@example.com');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw error when user already exists', async () => {
    userRepository.exists.mockResolvedValue(true);

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'pass', name: 'John' })
    ).rejects.toThrow(UserAlreadyExistsException);
  });
});
```

---

## 📋 Checklist de Clean Architecture

### Domain Layer
- [ ] Entities são classes puras (sem decorators de framework)
- [ ] Value Objects são imutáveis
- [ ] Business rules estão nas entities, não nos services
- [ ] Nenhuma dependência de frameworks
- [ ] Testável sem banco de dados

### Application Layer
- [ ] Use Cases orquestram, não contêm regras de negócio
- [ ] Use Cases dependem de interfaces (Ports), não de implementações
- [ ] Cada Use Case tem responsabilidade única
- [ ] Input/Output DTOs bem definidos

### Infrastructure Layer
- [ ] Implementa interfaces definidas no Domain
- [ ] Prisma entities separadas de Domain entities
- [ ] Mappers convertem entre Domain e Persistence
- [ ] Pode ser trocada sem afetar Domain/Application

### Presentation Layer
- [ ] Controllers apenas lidam com HTTP
- [ ] Toda lógica delegada para Use Cases
- [ ] DTOs de entrada validados
- [ ] Mappers convertem entre DTOs e Use Case Input/Output

### Dependency Rule
- [ ] Core não depende de nada
- [ ] Application depende apenas de Core
- [ ] Infrastructure depende de Application
- [ ] Presentation depende de Application

---

## 🎓 Benefícios Alcançados

✅ **Testabilidade**: Core pode ser testado sem frameworks
✅ **Manutenibilidade**: Mudanças isoladas em camadas
✅ **Independência**: Frameworks podem ser trocados
✅ **Clareza**: Separação clara de responsabilidades
✅ **Escalabilidade**: Fácil adicionar novos casos de uso
✅ **Reusabilidade**: Domain logic pode ser reutilizado

---

## 📚 Recursos de Aprendizado

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Última atualização**: 2024-01-30
**Baseado em**: Clean Architecture, DDD, Hexagonal Architecture
**Framework**: NestJS 10.x + TypeScript 5.x
