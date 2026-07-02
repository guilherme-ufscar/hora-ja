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

// Executar migrações na inicialização do módulo
let migrationsPromise: Promise<void> | null = null;
function ensureMigrations() {
    if (!migrationsPromise) {
        migrationsPromise = runMigrations().catch(err => {
            console.error("Erro ao executar migrações:", err);
            migrationsPromise = null; // Permitir nova tentativa
            throw err;
        });
    }
    return migrationsPromise;
}

// Garante que as migrações rodam antes de qualquer query
ensureMigrations();

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

            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
            CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

            CREATE TABLE IF NOT EXISTS notification_rules (
                id SERIAL PRIMARY KEY,
                type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'whatsapp')),
                value VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                currency_code VARCHAR(20) NOT NULL,
                condition_type VARCHAR(50) NOT NULL CHECK (condition_type IN ('price_above', 'price_below', 'change_percent')),
                condition_value DECIMAL(20, 10) NOT NULL,
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_notification_active ON notification_rules(active);
            CREATE INDEX IF NOT EXISTS idx_notification_type_value ON notification_rules(type, value);

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
