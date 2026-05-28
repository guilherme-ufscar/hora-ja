import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_NAME || "horaja",
    user: process.env.DATABASE_USER || "horaja",
    password: process.env.DATABASE_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

export default pool;

export async function runMigrations() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title TEXT NOT NULL,
                summary TEXT,
                content TEXT NOT NULL,
                chart_data JSONB,
                image_url TEXT,
                image_credit TEXT,
                source_url TEXT,
                source_name VARCHAR(100),
                category VARCHAR(50) DEFAULT 'economia',
                status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
                published_at TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS app_config (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            INSERT INTO app_config (key, value) VALUES
                ('articles_per_day', '15'),
                ('pipeline_enabled', 'true'),
                ('rss_sources', 'infomoney,valoreconomico,g1economia,exame,investing')
            ON CONFLICT (key) DO NOTHING;
        `);
    } finally {
        client.release();
    }
}
