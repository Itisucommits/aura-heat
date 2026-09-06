"""
AURA-Heat: Database Session & Engine Configuration
Supports PostgreSQL 16 + PostGIS via async SQLAlchemy 2.0 (asyncpg)
with graceful fallback to SQLite for local zero-dependency testing.
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://aura_user:aura_secret@localhost:5432/aura_heat_db"
)

# SQLite fallback if local testing without postgres
if DATABASE_URL.startswith("sqlite"):
    engine = create_async_engine(DATABASE_URL, echo=False)
else:
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        poolclass=NullPool,
        connect_args={"server_settings": {"search_path": "public"}}
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
