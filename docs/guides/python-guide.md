---
sidebar_position: 12
title: Python Guide
description: Using Claude Code effectively with Python projects
---

# Python with Claude Code

Master Python development with Claude Code through type hints, async patterns, testing, and framework-specific workflows.

## Type Hints and Mypy

### Add Type Hints to Functions

```text title="Prompt"
> Add comprehensive type hints to this function including generics
```

```python title="Before: No Type Hints"
def process_items(items, transform, filter_fn=None):
    results = []
    for item in items:
        if filter_fn is None or filter_fn(item):
            results.append(transform(item))
    return results
```

```python title="After: With Type Hints"
from typing import TypeVar, Callable, Sequence, Optional

T = TypeVar('T')
R = TypeVar('R')

def process_items(
    items: Sequence[T],
    transform: Callable[[T], R],
    filter_fn: Optional[Callable[[T], bool]] = None,
) -> list[R]:
    """Process items with optional filtering and transformation.

    Args:
        items: Sequence of items to process
        transform: Function to transform each item
        filter_fn: Optional predicate to filter items

    Returns:
        List of transformed items that passed the filter
    """
    results: list[R] = []
    for item in items:
        if filter_fn is None or filter_fn(item):
            results.append(transform(item))
    return results
```

### Type Hints for Data Classes

```text title="Prompt"
> Create a typed data class for a User model with validation
```

```python title="Typed Data Class"
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"


@dataclass
class Address:
    street: str
    city: str
    country: str
    postal_code: str


@dataclass
class User:
    id: str
    email: str
    name: str
    role: UserRole = UserRole.USER
    address: Optional[Address] = None
    created_at: datetime = field(default_factory=datetime.now)
    tags: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        """Validate fields after initialization."""
        if not self.email or "@" not in self.email:
            raise ValueError(f"Invalid email: {self.email}")
        if not self.name:
            raise ValueError("Name cannot be empty")

    @property
    def is_admin(self) -> bool:
        """Check if user has admin role."""
        return self.role == UserRole.ADMIN

    def add_tag(self, tag: str) -> None:
        """Add a tag if not already present."""
        if tag not in self.tags:
            self.tags.append(tag)


# Usage with type safety
user = User(
    id="u123",
    email="john@example.com",
    name="John Doe",
    role=UserRole.ADMIN,
)
```

### Pydantic Models with Validation

```text title="Prompt"
> Create Pydantic models for API request/response with validation
```

```python title="Pydantic Models"
from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    user = "user"
    guest = "guest"


class AddressCreate(BaseModel):
    street: str = Field(..., min_length=1, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=2, max_length=2)  # ISO country code
    postal_code: str = Field(..., pattern=r"^\d{5}(-\d{4})?$")


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=1, max_length=100)
    role: UserRole = UserRole.user
    address: Optional[AddressCreate] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain digit")
        return v


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: UserRole
    created_at: datetime

    model_config = {
        "from_attributes": True,  # Enable ORM mode
    }


class PaginatedResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    per_page: int

    @property
    def has_next(self) -> bool:
        return self.page * self.per_page < self.total


# Usage
user_data = UserCreate(
    email="john@example.com",
    password="SecurePass123",
    name="John Doe",
)
```

### Mypy Configuration

```text title="Prompt"
> Create an optimal mypy configuration for a Python project
```

```ini title="mypy.ini"
[mypy]
# Python version
python_version = 3.11

# Strict mode options
strict = true
warn_return_any = true
warn_unused_configs = true
warn_redundant_casts = true
warn_unused_ignores = true
show_error_codes = true
show_column_numbers = true

# Disallow dynamic typing
disallow_any_generics = true
disallow_subclassing_any = true
disallow_untyped_calls = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
disallow_untyped_decorators = true

# None and Optional handling
strict_optional = true
no_implicit_optional = true

# Import handling
ignore_missing_imports = false
follow_imports = normal

# Error output
pretty = true
color_output = true

# Per-module overrides
[mypy-tests.*]
disallow_untyped_defs = false

[mypy-migrations.*]
ignore_errors = true

[mypy-third_party_lib.*]
ignore_missing_imports = true
```

```toml title="pyproject.toml alternative"
[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true
show_error_codes = true
pretty = true

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[[tool.mypy.overrides]]
module = "third_party_lib.*"
ignore_missing_imports = true
```

## Async/Await Patterns

### Convert Sync to Async

```text title="Prompt"
> Convert this synchronous code to async with proper error handling
```

```python title="Before: Synchronous"
import requests

def fetch_user(user_id: str) -> dict:
    response = requests.get(f"https://api.example.com/users/{user_id}")
    response.raise_for_status()
    return response.json()

def fetch_users(user_ids: list[str]) -> list[dict]:
    return [fetch_user(uid) for uid in user_ids]
```

```python title="After: Async"
import asyncio
from typing import Any
import httpx


async def fetch_user(client: httpx.AsyncClient, user_id: str) -> dict[str, Any]:
    """Fetch a single user by ID.

    Args:
        client: Async HTTP client
        user_id: User identifier

    Returns:
        User data dictionary

    Raises:
        httpx.HTTPStatusError: If request fails
    """
    response = await client.get(f"https://api.example.com/users/{user_id}")
    response.raise_for_status()
    return response.json()


async def fetch_users(user_ids: list[str]) -> list[dict[str, Any]]:
    """Fetch multiple users concurrently.

    Args:
        user_ids: List of user identifiers

    Returns:
        List of user data dictionaries
    """
    async with httpx.AsyncClient() as client:
        tasks = [fetch_user(client, uid) for uid in user_ids]
        return await asyncio.gather(*tasks)


# With error handling and rate limiting
async def fetch_users_safe(
    user_ids: list[str],
    max_concurrent: int = 10,
) -> list[dict[str, Any] | None]:
    """Fetch users with concurrency limit and error handling."""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch_with_limit(client: httpx.AsyncClient, user_id: str) -> dict[str, Any] | None:
        async with semaphore:
            try:
                return await fetch_user(client, user_id)
            except httpx.HTTPStatusError as e:
                print(f"Failed to fetch user {user_id}: {e}")
                return None

    async with httpx.AsyncClient() as client:
        tasks = [fetch_with_limit(client, uid) for uid in user_ids]
        return await asyncio.gather(*tasks)


# Usage
async def main() -> None:
    users = await fetch_users(["1", "2", "3"])
    for user in users:
        print(user["name"])


if __name__ == "__main__":
    asyncio.run(main())
```

### Async Context Managers

```text title="Prompt"
> Create an async database connection pool context manager
```

```python title="Async Context Manager"
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Any
import asyncpg


class DatabasePool:
    """Async database connection pool manager."""

    def __init__(self, dsn: str, min_size: int = 5, max_size: int = 20) -> None:
        self.dsn = dsn
        self.min_size = min_size
        self.max_size = max_size
        self._pool: asyncpg.Pool | None = None

    async def connect(self) -> None:
        """Initialize the connection pool."""
        self._pool = await asyncpg.create_pool(
            self.dsn,
            min_size=self.min_size,
            max_size=self.max_size,
        )

    async def disconnect(self) -> None:
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None

    @asynccontextmanager
    async def acquire(self) -> AsyncGenerator[asyncpg.Connection, None]:
        """Acquire a connection from the pool."""
        if not self._pool:
            raise RuntimeError("Pool not initialized")

        async with self._pool.acquire() as connection:
            yield connection

    @asynccontextmanager
    async def transaction(self) -> AsyncGenerator[asyncpg.Connection, None]:
        """Acquire a connection with an active transaction."""
        async with self.acquire() as connection:
            async with connection.transaction():
                yield connection


# Application lifecycle
@asynccontextmanager
async def lifespan(app: Any) -> AsyncGenerator[dict[str, Any], None]:
    """Application lifespan context manager."""
    # Startup
    db = DatabasePool("postgresql://localhost/mydb")
    await db.connect()

    yield {"db": db}

    # Shutdown
    await db.disconnect()


# Usage
async def get_users(db: DatabasePool) -> list[dict[str, Any]]:
    async with db.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM users")
        return [dict(row) for row in rows]


async def create_user_with_profile(
    db: DatabasePool,
    user_data: dict[str, Any],
    profile_data: dict[str, Any],
) -> str:
    """Create user and profile in a transaction."""
    async with db.transaction() as conn:
        user_id = await conn.fetchval(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
            user_data["name"],
            user_data["email"],
        )
        await conn.execute(
            "INSERT INTO profiles (user_id, bio) VALUES ($1, $2)",
            user_id,
            profile_data["bio"],
        )
        return str(user_id)
```

### Async Iterators and Generators

```text title="Prompt"
> Create an async generator for paginated API results
```

```python title="Async Generator"
from typing import AsyncGenerator, TypeVar, Generic
from dataclasses import dataclass
import httpx

T = TypeVar("T")


@dataclass
class Page(Generic[T]):
    items: list[T]
    page: int
    total_pages: int
    has_next: bool


async def paginate_api(
    client: httpx.AsyncClient,
    url: str,
    per_page: int = 100,
) -> AsyncGenerator[dict, None]:
    """Async generator that yields items from paginated API.

    Args:
        client: HTTP client
        url: Base API URL
        per_page: Items per page

    Yields:
        Individual items from each page
    """
    page = 1

    while True:
        response = await client.get(
            url,
            params={"page": page, "per_page": per_page}
        )
        response.raise_for_status()
        data = response.json()

        for item in data["items"]:
            yield item

        if page >= data["total_pages"]:
            break

        page += 1


# Async iterator class
class AsyncPaginator(Generic[T]):
    """Async iterator for paginated results."""

    def __init__(
        self,
        fetch_page: callable,
        per_page: int = 100,
    ) -> None:
        self.fetch_page = fetch_page
        self.per_page = per_page
        self._page = 0
        self._items: list[T] = []
        self._exhausted = False

    def __aiter__(self) -> "AsyncPaginator[T]":
        return self

    async def __anext__(self) -> T:
        if not self._items:
            if self._exhausted:
                raise StopAsyncIteration

            self._page += 1
            page_data = await self.fetch_page(self._page, self.per_page)

            if not page_data.items:
                raise StopAsyncIteration

            self._items = list(page_data.items)
            self._exhausted = not page_data.has_next

        return self._items.pop(0)


# Usage
async def process_all_users() -> None:
    async with httpx.AsyncClient() as client:
        async for user in paginate_api(client, "https://api.example.com/users"):
            print(f"Processing user: {user['name']}")
```

## Package Structure

### Standard Package Layout

```text title="Prompt"
> Create a proper Python package structure for a library
```

```
mypackage/
├── pyproject.toml
├── README.md
├── LICENSE
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── py.typed              # PEP 561 marker
│       ├── core/
│       │   ├── __init__.py
│       │   ├── models.py
│       │   └── exceptions.py
│       ├── services/
│       │   ├── __init__.py
│       │   └── user_service.py
│       ├── utils/
│       │   ├── __init__.py
│       │   └── helpers.py
│       └── cli.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py
│   └── test_services/
│       └── test_user_service.py
└── docs/
    └── index.md
```

```python title="src/mypackage/__init__.py"
"""MyPackage - A description of what this package does."""

from mypackage.core.models import User, Product
from mypackage.core.exceptions import MyPackageError
from mypackage.services.user_service import UserService

__version__ = "1.0.0"
__all__ = [
    "User",
    "Product",
    "MyPackageError",
    "UserService",
    "__version__",
]
```

```toml title="pyproject.toml"
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "mypackage"
version = "1.0.0"
description = "A useful Python package"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
authors = [
    { name = "Your Name", email = "you@example.com" }
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Typing :: Typed",
]
dependencies = [
    "httpx>=0.24.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.0.0",
    "mypy>=1.0.0",
    "ruff>=0.1.0",
]

[project.scripts]
mypackage = "mypackage.cli:main"

[project.urls]
Documentation = "https://mypackage.readthedocs.io"
Repository = "https://github.com/username/mypackage"

[tool.hatch.build.targets.wheel]
packages = ["src/mypackage"]

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
addopts = "-v --cov=src/mypackage --cov-report=term-missing"

[tool.ruff]
target-version = "py310"
line-length = 88
select = ["E", "F", "I", "N", "W", "UP", "B", "C4", "SIM"]

[tool.ruff.isort]
known-first-party = ["mypackage"]
```

## Testing with Pytest

### Test Structure and Fixtures

```text title="Prompt"
> Create pytest fixtures and tests for a user service
```

```python title="tests/conftest.py"
import pytest
from typing import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime

from mypackage.core.models import User
from mypackage.services.user_service import UserService


@pytest.fixture
def sample_user() -> User:
    """Create a sample user for testing."""
    return User(
        id="u123",
        email="test@example.com",
        name="Test User",
        created_at=datetime(2024, 1, 15, 10, 30, 0),
    )


@pytest.fixture
def sample_users(sample_user: User) -> list[User]:
    """Create a list of sample users."""
    return [
        sample_user,
        User(id="u124", email="other@example.com", name="Other User"),
        User(id="u125", email="admin@example.com", name="Admin User"),
    ]


@pytest.fixture
def mock_db() -> MagicMock:
    """Create a mock database."""
    return MagicMock()


@pytest.fixture
def mock_async_db() -> AsyncMock:
    """Create an async mock database."""
    return AsyncMock()


@pytest.fixture
def user_service(mock_db: MagicMock) -> UserService:
    """Create a user service with mocked dependencies."""
    return UserService(db=mock_db)


@pytest.fixture
async def async_user_service(mock_async_db: AsyncMock) -> UserService:
    """Create an async user service."""
    return UserService(db=mock_async_db)
```

```python title="tests/test_user_service.py"
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from mypackage.core.models import User
from mypackage.core.exceptions import UserNotFoundError
from mypackage.services.user_service import UserService


class TestUserService:
    """Tests for UserService."""

    def test_get_user_by_id(
        self,
        user_service: UserService,
        mock_db: MagicMock,
        sample_user: User,
    ) -> None:
        """Test getting a user by ID."""
        mock_db.users.find_one.return_value = sample_user.model_dump()

        result = user_service.get_by_id("u123")

        assert result is not None
        assert result.id == "u123"
        assert result.email == "test@example.com"
        mock_db.users.find_one.assert_called_once_with({"id": "u123"})

    def test_get_user_not_found(
        self,
        user_service: UserService,
        mock_db: MagicMock,
    ) -> None:
        """Test UserNotFoundError when user doesn't exist."""
        mock_db.users.find_one.return_value = None

        with pytest.raises(UserNotFoundError) as exc_info:
            user_service.get_by_id("nonexistent")

        assert "nonexistent" in str(exc_info.value)

    @pytest.mark.parametrize(
        "email,expected_valid",
        [
            ("valid@example.com", True),
            ("invalid-email", False),
            ("", False),
            ("test@", False),
        ],
    )
    def test_validate_email(
        self,
        user_service: UserService,
        email: str,
        expected_valid: bool,
    ) -> None:
        """Test email validation with various inputs."""
        result = user_service.validate_email(email)
        assert result == expected_valid


class TestAsyncUserService:
    """Async tests for UserService."""

    @pytest.mark.asyncio
    async def test_async_get_user(
        self,
        async_user_service: UserService,
        mock_async_db: AsyncMock,
        sample_user: User,
    ) -> None:
        """Test async user retrieval."""
        mock_async_db.users.find_one.return_value = sample_user.model_dump()

        result = await async_user_service.async_get_by_id("u123")

        assert result.id == "u123"

    @pytest.mark.asyncio
    async def test_async_create_user(
        self,
        async_user_service: UserService,
        mock_async_db: AsyncMock,
    ) -> None:
        """Test async user creation."""
        user_data = {"email": "new@example.com", "name": "New User"}
        mock_async_db.users.insert_one.return_value = MagicMock(inserted_id="u999")

        result = await async_user_service.async_create(user_data)

        assert result.email == "new@example.com"
        mock_async_db.users.insert_one.assert_called_once()


class TestUserServiceIntegration:
    """Integration tests with real database."""

    @pytest.fixture
    def real_service(self, db_connection) -> UserService:
        """Create service with real database."""
        return UserService(db=db_connection)

    @pytest.mark.integration
    def test_create_and_retrieve_user(self, real_service: UserService) -> None:
        """Test full user lifecycle."""
        # Create
        user = real_service.create({"email": "int@example.com", "name": "Int User"})

        # Retrieve
        retrieved = real_service.get_by_id(user.id)

        assert retrieved is not None
        assert retrieved.email == user.email

        # Cleanup
        real_service.delete(user.id)
```

### Mocking and Patching

```text title="Prompt"
> Show me advanced mocking patterns for testing
```

```python title="tests/test_external_services.py"
import pytest
from unittest.mock import patch, AsyncMock, MagicMock, PropertyMock
from datetime import datetime
import httpx

from mypackage.services.payment_service import PaymentService


class TestPaymentService:
    """Tests with external service mocking."""

    @patch("mypackage.services.payment_service.httpx.AsyncClient")
    @pytest.mark.asyncio
    async def test_process_payment(self, mock_client_class: MagicMock) -> None:
        """Test payment processing with mocked HTTP client."""
        # Setup mock
        mock_client = AsyncMock()
        mock_client_class.return_value.__aenter__.return_value = mock_client

        mock_response = MagicMock()
        mock_response.json.return_value = {
            "transaction_id": "tx123",
            "status": "completed",
        }
        mock_response.raise_for_status = MagicMock()
        mock_client.post.return_value = mock_response

        # Test
        service = PaymentService(api_key="test-key")
        result = await service.process_payment(amount=100, currency="USD")

        assert result["transaction_id"] == "tx123"
        mock_client.post.assert_called_once()

    @patch.object(PaymentService, "_validate_amount")
    def test_with_method_patch(self, mock_validate: MagicMock) -> None:
        """Test with specific method patched."""
        mock_validate.return_value = True

        service = PaymentService(api_key="test-key")
        # _validate_amount will return True regardless of input
        result = service._validate_amount(-100)  # Would normally fail

        assert result is True

    def test_with_context_manager_mock(self) -> None:
        """Test context manager behavior."""
        mock_file = MagicMock()
        mock_file.__enter__.return_value = mock_file
        mock_file.__exit__.return_value = False
        mock_file.read.return_value = '{"key": "value"}'

        with patch("builtins.open", return_value=mock_file):
            with open("config.json") as f:
                content = f.read()

        assert content == '{"key": "value"}'

    @patch("mypackage.services.payment_service.datetime")
    def test_with_datetime_mock(self, mock_datetime: MagicMock) -> None:
        """Test with mocked datetime."""
        mock_datetime.now.return_value = datetime(2024, 1, 15, 12, 0, 0)
        mock_datetime.side_effect = lambda *args, **kw: datetime(*args, **kw)

        service = PaymentService(api_key="test-key")
        result = service.get_payment_date()

        assert result.year == 2024

    def test_with_property_mock(self) -> None:
        """Test with mocked property."""
        with patch.object(
            PaymentService,
            "is_configured",
            new_callable=PropertyMock,
            return_value=True,
        ):
            service = PaymentService(api_key="")
            assert service.is_configured is True
```

## Virtual Environments

### Environment Setup Script

```text title="Prompt"
> Create a script to set up Python development environment
```

```bash title="scripts/setup-env.sh"
#!/bin/bash
# Setup Python development environment

set -e

PYTHON_VERSION="${PYTHON_VERSION:-3.11}"
VENV_DIR="${VENV_DIR:-.venv}"

echo "Setting up Python development environment..."

# Check Python version
if ! command -v python${PYTHON_VERSION} &> /dev/null; then
    echo "Python ${PYTHON_VERSION} not found. Checking for pyenv..."
    if command -v pyenv &> /dev/null; then
        pyenv install ${PYTHON_VERSION} --skip-existing
        pyenv local ${PYTHON_VERSION}
    else
        echo "Please install Python ${PYTHON_VERSION}"
        exit 1
    fi
fi

# Create virtual environment
echo "Creating virtual environment in ${VENV_DIR}..."
python${PYTHON_VERSION} -m venv ${VENV_DIR}

# Activate virtual environment
source ${VENV_DIR}/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
if [ -f "pyproject.toml" ]; then
    echo "Installing package with dependencies..."
    pip install -e ".[dev]"
elif [ -f "requirements.txt" ]; then
    echo "Installing from requirements.txt..."
    pip install -r requirements.txt
fi

# Install pre-commit hooks
if [ -f ".pre-commit-config.yaml" ]; then
    echo "Setting up pre-commit hooks..."
    pip install pre-commit
    pre-commit install
fi

echo ""
echo "Setup complete! Activate with: source ${VENV_DIR}/bin/activate"
```

### Pre-commit Configuration

```yaml title=".pre-commit-config.yaml"
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
      - id: check-added-large-files

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.6
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.0
    hooks:
      - id: mypy
        additional_dependencies:
          - pydantic>=2.0
          - types-requests
```

## Dependency Management

### Using UV for Fast Dependency Management

```text title="Prompt"
> Set up uv for managing Python dependencies
```

```bash title="Install and Use UV"
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment (much faster than venv)
uv venv

# Install dependencies
uv pip install -r requirements.txt

# Install package in development mode
uv pip install -e ".[dev]"

# Add a new dependency
uv pip install httpx

# Compile requirements with locked versions
uv pip compile pyproject.toml -o requirements.lock

# Sync environment to lockfile
uv pip sync requirements.lock
```

```toml title="pyproject.toml with dependency groups"
[project]
dependencies = [
    "httpx>=0.24.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "mypy>=1.0.0",
    "ruff>=0.1.0",
]
test = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "pytest-asyncio>=0.21.0",
]
docs = [
    "mkdocs>=1.5.0",
    "mkdocs-material>=9.0.0",
]
```

## Django Patterns

### Django Model with Type Hints

```text title="Prompt"
> Create a typed Django model with manager
```

```python title="models.py"
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import QuerySet, Manager
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class UserManager(Manager["User"]):
    """Custom manager for User model."""

    def active(self) -> QuerySet["User"]:
        """Return only active users."""
        return self.filter(is_active=True)

    def admins(self) -> QuerySet["User"]:
        """Return admin users."""
        return self.filter(is_staff=True)

    def by_email(self, email: str) -> "User | None":
        """Get user by email."""
        return self.filter(email=email).first()


class User(AbstractUser):
    """Custom user model with additional fields."""

    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects: UserManager = UserManager()

    # Type hint for reverse relations
    if TYPE_CHECKING:
        posts: "RelatedManager[Post]"

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}".strip() or self.username


class PostManager(Manager["Post"]):
    """Custom manager for Post model."""

    def published(self) -> QuerySet["Post"]:
        """Return only published posts."""
        return self.filter(status="published")


class Post(models.Model):
    """Blog post model."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    objects: PostManager = PostManager()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
```

### Django REST Framework Views

```text title="Prompt"
> Create typed DRF views with serializers
```

```python title="api/views.py"
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import QuerySet
from typing import Any

from .models import Post, User
from .serializers import PostSerializer, PostCreateSerializer, UserSerializer


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for Post CRUD operations."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Post]:
        """Return posts for the current user or all published."""
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
        return Post.objects.filter(author=user) | Post.objects.published()

    def get_serializer_class(self) -> type:
        """Return appropriate serializer based on action."""
        if self.action in ("create", "update", "partial_update"):
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer: PostCreateSerializer) -> None:
        """Set the author to the current user."""
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])
    def publish(self, request: Request, pk: str | None = None) -> Response:
        """Publish a draft post."""
        post = self.get_object()

        if post.status == Post.Status.PUBLISHED:
            return Response(
                {"error": "Post is already published"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        post.status = Post.Status.PUBLISHED
        post.save()

        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my_posts(self, request: Request) -> Response:
        """Return posts by the current user."""
        posts = self.get_queryset().filter(author=request.user)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
```

## FastAPI Patterns

### FastAPI Application Structure

```text title="Prompt"
> Create a typed FastAPI application with dependency injection
```

```python title="app/main.py"
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Database
from app.api import users, posts


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    # Startup
    app.state.db = Database(settings.database_url)
    await app.state.db.connect()

    yield

    # Shutdown
    await app.state.db.disconnect()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
```

```python title="app/api/users.py"
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Annotated

from app.core.database import Database
from app.core.dependencies import get_db, get_current_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
async def list_users(
    db: Annotated[Database, Depends(get_db)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
) -> list[User]:
    """List all users with pagination."""
    return await db.users.find_many(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: Annotated[Database, Depends(get_db)],
) -> User:
    """Get a specific user by ID."""
    user = await db.users.find_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Annotated[Database, Depends(get_db)],
) -> User:
    """Create a new user."""
    # Check if email exists
    existing = await db.users.find_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return await db.users.create(user_data)


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Annotated[Database, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Update a user."""
    if user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user",
        )

    user = await db.users.update(user_id, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: Annotated[Database, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Delete a user."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    deleted = await db.users.delete(user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
```

```python title="app/core/dependencies.py"
from typing import Annotated, AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.database import Database
from app.core.auth import verify_token
from app.models.user import User

security = HTTPBearer()


async def get_db() -> AsyncGenerator[Database, None]:
    """Database dependency."""
    from app.main import app
    yield app.state.db


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[Database, Depends(get_db)],
) -> User:
    """Get current authenticated user."""
    token = credentials.credentials

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = await db.users.find_by_id(payload["sub"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


async def get_admin_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Require admin user."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
```

## Data Science Workflows

### Pandas with Type Hints

```text title="Prompt"
> Create typed pandas data processing functions
```

```python title="data_processing.py"
from typing import TypeVar
import pandas as pd
import numpy as np
from pathlib import Path

# DataFrame type alias
DataFrameT = TypeVar("DataFrameT", bound=pd.DataFrame)


def load_and_clean_data(filepath: Path | str) -> pd.DataFrame:
    """Load data from CSV and perform initial cleaning.

    Args:
        filepath: Path to CSV file

    Returns:
        Cleaned DataFrame
    """
    df = pd.read_csv(filepath)

    # Remove duplicates
    df = df.drop_duplicates()

    # Handle missing values
    df = df.dropna(subset=["id"])  # Required field
    df["description"] = df["description"].fillna("")

    # Convert types
    df["created_at"] = pd.to_datetime(df["created_at"])
    df["price"] = pd.to_numeric(df["price"], errors="coerce")

    return df


def aggregate_by_category(
    df: pd.DataFrame,
    value_col: str,
    agg_funcs: list[str] | None = None,
) -> pd.DataFrame:
    """Aggregate data by category.

    Args:
        df: Input DataFrame with 'category' column
        value_col: Column to aggregate
        agg_funcs: Aggregation functions to apply

    Returns:
        Aggregated DataFrame
    """
    if agg_funcs is None:
        agg_funcs = ["mean", "sum", "count"]

    result = df.groupby("category")[value_col].agg(agg_funcs)
    result.columns = [f"{value_col}_{func}" for func in agg_funcs]

    return result.reset_index()


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create ML features from raw data.

    Args:
        df: Input DataFrame

    Returns:
        DataFrame with new features
    """
    df = df.copy()

    # Time-based features
    df["day_of_week"] = df["created_at"].dt.dayofweek
    df["hour"] = df["created_at"].dt.hour
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)

    # Text features
    df["description_length"] = df["description"].str.len()
    df["word_count"] = df["description"].str.split().str.len()

    # Numerical features
    df["price_log"] = np.log1p(df["price"])
    df["price_zscore"] = (df["price"] - df["price"].mean()) / df["price"].std()

    return df


def split_train_test(
    df: pd.DataFrame,
    test_size: float = 0.2,
    stratify_col: str | None = None,
    random_state: int = 42,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Split DataFrame into train and test sets.

    Args:
        df: Input DataFrame
        test_size: Proportion of test set
        stratify_col: Column to stratify on
        random_state: Random seed

    Returns:
        Tuple of (train_df, test_df)
    """
    from sklearn.model_selection import train_test_split

    stratify = df[stratify_col] if stratify_col else None

    train_df, test_df = train_test_split(
        df,
        test_size=test_size,
        stratify=stratify,
        random_state=random_state,
    )

    return train_df, test_df
```

### ML Pipeline with Types

```text title="Prompt"
> Create a typed ML training pipeline
```

```python title="ml/pipeline.py"
from dataclasses import dataclass, field
from typing import Any, Protocol
from pathlib import Path
import joblib
import numpy as np
from sklearn.base import BaseEstimator
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score


class Model(Protocol):
    """Protocol for ML models."""

    def fit(self, X: np.ndarray, y: np.ndarray) -> "Model": ...
    def predict(self, X: np.ndarray) -> np.ndarray: ...
    def score(self, X: np.ndarray, y: np.ndarray) -> float: ...


@dataclass
class TrainingConfig:
    """Configuration for model training."""

    model_type: str
    hyperparameters: dict[str, Any] = field(default_factory=dict)
    cv_folds: int = 5
    random_state: int = 42

    @classmethod
    def from_yaml(cls, path: Path) -> "TrainingConfig":
        """Load config from YAML file."""
        import yaml
        with open(path) as f:
            data = yaml.safe_load(f)
        return cls(**data)


@dataclass
class TrainingResult:
    """Results from model training."""

    model: BaseEstimator
    train_score: float
    cv_scores: np.ndarray
    cv_mean: float
    cv_std: float

    @property
    def summary(self) -> str:
        """Return summary string."""
        return (
            f"Train Score: {self.train_score:.4f}\n"
            f"CV Score: {self.cv_mean:.4f} (+/- {self.cv_std:.4f})"
        )


class MLPipeline:
    """Machine learning training pipeline."""

    def __init__(self, config: TrainingConfig) -> None:
        self.config = config
        self._model: BaseEstimator | None = None
        self._pipeline: Pipeline | None = None

    def _create_model(self) -> BaseEstimator:
        """Create model based on config."""
        from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
        from sklearn.linear_model import LogisticRegression

        models: dict[str, type[BaseEstimator]] = {
            "random_forest": RandomForestClassifier,
            "gradient_boosting": GradientBoostingClassifier,
            "logistic_regression": LogisticRegression,
        }

        model_class = models.get(self.config.model_type)
        if not model_class:
            raise ValueError(f"Unknown model type: {self.config.model_type}")

        return model_class(
            random_state=self.config.random_state,
            **self.config.hyperparameters,
        )

    def train(
        self,
        X: np.ndarray,
        y: np.ndarray,
        feature_names: list[str] | None = None,
    ) -> TrainingResult:
        """Train the model.

        Args:
            X: Feature matrix
            y: Target vector
            feature_names: Optional feature names

        Returns:
            Training results
        """
        self._model = self._create_model()

        self._pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("model", self._model),
        ])

        # Cross-validation
        cv_scores = cross_val_score(
            self._pipeline,
            X,
            y,
            cv=self.config.cv_folds,
        )

        # Final training
        self._pipeline.fit(X, y)
        train_score = self._pipeline.score(X, y)

        return TrainingResult(
            model=self._pipeline,
            train_score=train_score,
            cv_scores=cv_scores,
            cv_mean=cv_scores.mean(),
            cv_std=cv_scores.std(),
        )

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions."""
        if self._pipeline is None:
            raise RuntimeError("Model not trained")
        return self._pipeline.predict(X)

    def save(self, path: Path) -> None:
        """Save the trained pipeline."""
        if self._pipeline is None:
            raise RuntimeError("Model not trained")
        joblib.dump(self._pipeline, path)

    @classmethod
    def load(cls, path: Path) -> Pipeline:
        """Load a trained pipeline."""
        return joblib.load(path)
```

## Script Automation

### CLI Script with Click

```text title="Prompt"
> Create a typed CLI tool using Click
```

```python title="cli.py"
from pathlib import Path
from typing import Optional
import click
import sys

from mypackage.core.processor import DataProcessor
from mypackage.core.config import Config


@click.group()
@click.version_option(version="1.0.0")
@click.option(
    "--config",
    "-c",
    type=click.Path(exists=True, path_type=Path),
    help="Path to configuration file",
)
@click.option("--verbose", "-v", is_flag=True, help="Enable verbose output")
@click.pass_context
def cli(ctx: click.Context, config: Optional[Path], verbose: bool) -> None:
    """MyPackage - A command-line data processing tool."""
    ctx.ensure_object(dict)

    if config:
        ctx.obj["config"] = Config.from_file(config)
    else:
        ctx.obj["config"] = Config()

    ctx.obj["verbose"] = verbose


@cli.command()
@click.argument("input_file", type=click.Path(exists=True, path_type=Path))
@click.argument("output_file", type=click.Path(path_type=Path))
@click.option(
    "--format",
    "-f",
    type=click.Choice(["csv", "json", "parquet"]),
    default="csv",
    help="Output format",
)
@click.option("--overwrite", is_flag=True, help="Overwrite existing output file")
@click.pass_context
def process(
    ctx: click.Context,
    input_file: Path,
    output_file: Path,
    format: str,
    overwrite: bool,
) -> None:
    """Process data from INPUT_FILE and write to OUTPUT_FILE."""
    config: Config = ctx.obj["config"]
    verbose: bool = ctx.obj["verbose"]

    if output_file.exists() and not overwrite:
        click.echo(f"Error: {output_file} exists. Use --overwrite to replace.", err=True)
        sys.exit(1)

    if verbose:
        click.echo(f"Processing {input_file}...")

    processor = DataProcessor(config)

    with click.progressbar(
        length=100,
        label="Processing",
        show_percent=True,
    ) as bar:
        result = processor.process(
            input_file,
            progress_callback=lambda p: bar.update(int(p * 100) - bar.pos),
        )

    if verbose:
        click.echo(f"Processed {result.row_count} rows")

    processor.save(result, output_file, format=format)
    click.echo(f"Output written to {output_file}")


@cli.command()
@click.argument("files", type=click.Path(exists=True, path_type=Path), nargs=-1)
@click.option("--recursive", "-r", is_flag=True, help="Process directories recursively")
@click.pass_context
def batch(ctx: click.Context, files: tuple[Path, ...], recursive: bool) -> None:
    """Process multiple files in batch."""
    config: Config = ctx.obj["config"]

    all_files: list[Path] = []

    for file_path in files:
        if file_path.is_dir():
            if recursive:
                all_files.extend(file_path.rglob("*.csv"))
            else:
                all_files.extend(file_path.glob("*.csv"))
        else:
            all_files.append(file_path)

    if not all_files:
        click.echo("No files found to process", err=True)
        sys.exit(1)

    click.echo(f"Processing {len(all_files)} files...")

    processor = DataProcessor(config)

    with click.progressbar(all_files, label="Batch processing") as bar:
        for file_path in bar:
            try:
                result = processor.process(file_path)
                output = file_path.with_suffix(".processed.csv")
                processor.save(result, output)
            except Exception as e:
                click.echo(f"\nError processing {file_path}: {e}", err=True)

    click.echo("Batch processing complete")


@cli.command()
@click.pass_context
def info(ctx: click.Context) -> None:
    """Display configuration and system information."""
    config: Config = ctx.obj["config"]

    click.echo("Configuration:")
    click.echo(f"  Max workers: {config.max_workers}")
    click.echo(f"  Chunk size: {config.chunk_size}")
    click.echo(f"  Cache enabled: {config.cache_enabled}")


if __name__ == "__main__":
    cli()
```

## Best Practices

### Code Style Configuration

```toml title="pyproject.toml"
[tool.ruff]
target-version = "py311"
line-length = 88

select = [
    "E",      # pycodestyle errors
    "F",      # pyflakes
    "I",      # isort
    "N",      # pep8-naming
    "UP",     # pyupgrade
    "B",      # flake8-bugbear
    "C4",     # flake8-comprehensions
    "SIM",    # flake8-simplify
    "ARG",    # flake8-unused-arguments
    "PTH",    # flake8-use-pathlib
    "RUF",    # Ruff-specific
]

ignore = [
    "E501",   # line too long (handled by formatter)
]

[tool.ruff.isort]
known-first-party = ["mypackage"]

[tool.ruff.per-file-ignores]
"tests/*" = ["ARG001"]  # Unused function arguments in tests
```

### Project Template

```text title="Common Prompts for Python Projects"
# Create new module
> Create a Python module for handling user authentication with JWT tokens

# Add type hints
> Add comprehensive type hints to all functions in this file

# Create tests
> Create pytest tests for the UserService class with mocking

# Refactor for async
> Convert this synchronous database code to async with asyncpg

# Add validation
> Add Pydantic validation to this API endpoint

# Create CLI
> Create a Click CLI for this data processing module

# Generate docstrings
> Add Google-style docstrings to all public functions
```

## Next Steps

- [TypeScript Guide](/guides/typescript-guide) - TypeScript development with Claude Code
- [React Guide](/guides/react-guide) - React development patterns
- [Best Practices](/guides/best-practices) - General best practices
- [Workflow Patterns](/guides/workflow-patterns) - Development workflows
