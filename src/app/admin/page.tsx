"use client";

import { useState, useEffect, useCallback } from "react";

interface Article {
    id: number;
    slug: string;
    title: string;
    summary: string;
    category: string;
    status: string;
    source_name: string;
    published_at: string;
}

interface ArticleDetail extends Article {
    content: string;
    chart_data: object[] | null;
    source_url: string;
}

interface Config {
    articles_per_day: string;
    pipeline_enabled: string;
    rss_sources: string;
}

type Tab = "articles" | "config" | "pipeline";

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [tab, setTab] = useState<Tab>("articles");

    // articles state
    const [articles, setArticles] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // edit state
    const [editing, setEditing] = useState<ArticleDetail | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ title: "", summary: "", content: "", category: "economia", status: "published", source_name: "", source_url: "" });
    const [saving, setSaving] = useState(false);

    // config state
    const [config, setConfig] = useState<Config>({ articles_per_day: "15", pipeline_enabled: "true", rss_sources: "infomoney,valoreconomico,g1economia,exame,investing" });
    const [configSaved, setConfigSaved] = useState(false);

    // pipeline state
    const [pipelineRunning, setPipelineRunning] = useState(false);
    const [pipelineProgress, setPipelineProgress] = useState<{ index: number; total: number; log: { title: string; status: "ok" | "error" | "skip" }[] } | null>(null);
    const [pipelineDone, setPipelineDone] = useState<{ processed: number; skipped: number; errors: number } | null>(null);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/articles?page=${page}&q=${search}`);
            if (res.ok) {
                const data = await res.json();
                setArticles(data.articles);
                setTotal(data.total);
            } else {
                setAuthed(false);
            }
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    const fetchConfig = useCallback(async () => {
        const res = await fetch("/api/admin/config");
        if (res.ok) setConfig(await res.json());
    }, []);

    useEffect(() => {
        if (authed && tab === "articles") fetchArticles();
        if (authed && tab === "config") fetchConfig();
    }, [authed, tab, fetchArticles, fetchConfig]);

    async function login() {
        setLoginError("");
        const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
        if (res.ok) { setAuthed(true); fetchArticles(); }
        else setLoginError("Senha incorreta");
    }

    async function logout() {
        await fetch("/api/admin/logout", { method: "POST" });
        setAuthed(false);
    }

    async function deleteArticle(id: number) {
        if (!confirm("Excluir esta notícia?")) return;
        await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
        fetchArticles();
    }

    async function openEdit(id: number) {
        const res = await fetch(`/api/admin/articles/${id}`);
        const data = await res.json();
        setEditing(data);
        setForm({ title: data.title, summary: data.summary || "", content: data.content, category: data.category, status: data.status, source_name: data.source_name || "", source_url: data.source_url || "" });
    }

    async function saveEdit() {
        if (!editing) return;
        setSaving(true);
        await fetch(`/api/admin/articles/${editing.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, chart_data: editing.chart_data }),
        });
        setSaving(false);
        setEditing(null);
        fetchArticles();
    }

    async function saveNew() {
        setSaving(true);
        await fetch("/api/admin/articles", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);
        setCreating(false);
        setForm({ title: "", summary: "", content: "", category: "economia", status: "published", source_name: "", source_url: "" });
        fetchArticles();
    }

    async function saveConfig() {
        await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 2000);
    }

    function runPipeline() {
        setPipelineRunning(true);
        setPipelineProgress(null);
        setPipelineDone(null);

        const es = new EventSource("/api/admin/pipeline/stream");

        es.onmessage = (e) => {
            const event = JSON.parse(e.data);
            if (event.type === "start") {
                setPipelineProgress({ index: 0, total: event.total, log: [] });
            } else if (event.type === "progress") {
                setPipelineProgress(prev => ({
                    index: event.index,
                    total: event.total,
                    log: [...(prev?.log ?? []), { title: event.title, status: event.status }],
                }));
            } else if (event.type === "done") {
                setPipelineDone({ processed: event.processed, skipped: event.skipped, errors: event.errors });
                setPipelineRunning(false);
                es.close();
                fetchArticles();
            } else if (event.type === "error") {
                setPipelineDone({ processed: 0, skipped: 0, errors: 1 });
                setPipelineRunning(false);
                es.close();
            }
        };

        es.onerror = () => {
            setPipelineRunning(false);
            es.close();
        };
    }

    // Login screen
    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="glass-panel p-10 w-full max-w-sm flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Painel Admin</h1>
                        <p className="text-sm text-foreground/50 mt-1">HoraJá Câmbio</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder="Senha de acesso"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && login()}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary"
                        />
                        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                        <button onClick={login} className="w-full rounded-xl bg-primary text-white font-bold py-3 hover:bg-primary-hover transition-colors">
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const FormModal = ({ onSave, onClose, title }: { onSave: () => void; onClose: () => void; title: string }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-foreground">{title}</h2>
                    <button onClick={onClose} className="text-foreground/50 hover:text-foreground text-2xl">×</button>
                </div>
                {(["title", "summary", "source_name", "source_url"] as const).map(field => (
                    <div key={field}>
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block capitalize">{field.replace("_", " ")}</label>
                        <input
                            value={form[field]}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">Categoria</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none">
                            {["economia", "cambio", "investimentos", "mercados", "cripto"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">Status</label>
                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none">
                            <option value="published">Publicado</option>
                            <option value="draft">Rascunho</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">Conteúdo (HTML)</label>
                    <textarea
                        value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        rows={10}
                        className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary font-mono text-sm"
                    />
                </div>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl border border-card-border text-foreground/60 hover:text-foreground">Cancelar</button>
                    <button onClick={onSave} disabled={saving} className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50">
                        {saving ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {(editing || creating) && (
                <FormModal
                    title={creating ? "Nova Notícia" : "Editar Notícia"}
                    onSave={creating ? saveNew : saveEdit}
                    onClose={() => { setEditing(null); setCreating(false); }}
                />
            )}

            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground">Painel Admin</h1>
                    <p className="text-sm text-foreground/50 mt-1">HoraJá Câmbio — Gestão de Conteúdo</p>
                </div>
                <button onClick={logout} className="text-sm text-foreground/50 hover:text-red-500 transition-colors">Sair</button>
            </div>

            <div className="flex gap-2 mb-8 border-b border-card-border">
                {(["articles", "pipeline", "config"] as Tab[]).map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-bold capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground"}`}>
                        {t === "articles" ? "Notícias" : t === "pipeline" ? "Pipeline" : "Configurações"}
                    </button>
                ))}
            </div>

            {tab === "articles" && (
                <div className="flex flex-col gap-6">
                    <div className="flex gap-3 flex-wrap">
                        <input
                            placeholder="Buscar notícias..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="flex-1 min-w-[200px] rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => { setCreating(true); setForm({ title: "", summary: "", content: "", category: "economia", status: "published", source_name: "", source_url: "" }); }}
                            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover">
                            + Nova Notícia
                        </button>
                    </div>

                    <p className="text-sm text-foreground/50">{total} notícia{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}</p>

                    {loading ? (
                        <div className="glass-panel p-12 text-center text-foreground/40">Carregando...</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {articles.map(a => (
                                <div key={a.id} className="glass-panel px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${a.status === "published" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                                                {a.status === "published" ? "Publicado" : "Rascunho"}
                                            </span>
                                            <span className="text-xs text-foreground/40">{a.category}</span>
                                            <span className="text-xs text-foreground/30">· {new Date(a.published_at).toLocaleDateString("pt-BR")}</span>
                                        </div>
                                        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{a.title}</p>
                                        <p className="text-xs text-foreground/40 mt-0.5">{a.source_name}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <a href={`/noticias/${a.slug}`} target="_blank" className="text-xs px-3 py-1.5 rounded-lg border border-card-border text-foreground/60 hover:text-foreground">Ver</a>
                                        <button onClick={() => openEdit(a.id)} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">Editar</button>
                                        <button onClick={() => deleteArticle(a.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {total > 20 && (
                        <div className="flex justify-center gap-3">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border border-card-border text-foreground/60 disabled:opacity-30">← Anterior</button>
                            <span className="px-4 py-2 text-foreground/60 text-sm">Página {page} de {Math.ceil(total / 20)}</span>
                            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border border-card-border text-foreground/60 disabled:opacity-30">Próxima →</button>
                        </div>
                    )}
                </div>
            )}

            {tab === "pipeline" && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="glass-panel p-8 flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-1">Executar Pipeline</h2>
                            <p className="text-sm text-foreground/50">Busca até <strong>10 notícias</strong> financeiras nos feeds RSS, reescreve com Claude e publica. Limite diário: 30 notícias.</p>
                        </div>

                        <button
                            onClick={runPipeline}
                            disabled={pipelineRunning}
                            className="self-start px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                        >
                            {pipelineRunning ? "Processando..." : "Executar Agora"}
                        </button>

                        {pipelineProgress && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-foreground/60 font-medium">
                                        {pipelineRunning ? `Processando ${pipelineProgress.index} de ${pipelineProgress.total}...` : "Concluído"}
                                    </span>
                                    <span className="text-foreground/40 text-xs">
                                        {pipelineProgress.total > 0 ? Math.round((pipelineProgress.index / pipelineProgress.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-card-bg border border-card-border overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: pipelineProgress.total > 0 ? `${(pipelineProgress.index / pipelineProgress.total) * 100}%` : "0%" }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                                    {pipelineProgress.log.map((entry, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            <span className={entry.status === "ok" ? "text-emerald-500 shrink-0" : "text-red-500 shrink-0"}>
                                                {entry.status === "ok" ? "✓" : "✗"}
                                            </span>
                                            <span className="text-foreground/60 line-clamp-1">{entry.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {pipelineDone && (
                            <div className="rounded-xl px-5 py-4 bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                                ✓ Publicadas: <strong>{pipelineDone.processed}</strong> &nbsp;·&nbsp; Erros: {pipelineDone.errors}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-8">
                        <h3 className="text-lg font-bold text-foreground mb-3">Cron Automático (aaPanel)</h3>
                        <p className="text-sm text-foreground/60 mb-3">Configure no aaPanel um cron job com este comando para rodar o pipeline automaticamente 3× ao dia:</p>
                        <code className="block bg-card-bg border border-card-border rounded-xl p-4 text-xs text-foreground/80 font-mono break-all">
                            {`curl -s -X POST "https://seusite.com/api/news/run?secret=horaja_pipeline_2026" || true`}
                        </code>
                        <p className="text-xs text-foreground/40 mt-2">Sugestão de horários: 07:00, 13:00 e 19:00 (horário de Brasília)</p>
                    </div>
                </div>
            )}

            {tab === "config" && (
                <div className="flex flex-col gap-6 max-w-2xl">
                    <div className="glass-panel p-8 flex flex-col gap-6">
                        <h2 className="text-xl font-black text-foreground">Configurações do Pipeline</h2>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2 block">Notícias por dia (10–20)</label>
                            <input
                                type="number" min={10} max={20}
                                value={config.articles_per_day}
                                onChange={e => setConfig(c => ({ ...c, articles_per_day: e.target.value }))}
                                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2 block">Pipeline ativo</label>
                            <div className="flex gap-3">
                                {["true", "false"].map(v => (
                                    <button key={v} onClick={() => setConfig(c => ({ ...c, pipeline_enabled: v }))}
                                        className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${config.pipeline_enabled === v ? "bg-primary text-white" : "border border-card-border text-foreground/60"}`}>
                                        {v === "true" ? "Ativo" : "Pausado"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2 block">Fontes RSS (separadas por vírgula)</label>
                            <input
                                value={config.rss_sources}
                                onChange={e => setConfig(c => ({ ...c, rss_sources: e.target.value }))}
                                className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-foreground/40 mt-1">Disponíveis: infomoney, valoreconomico, g1economia, exame, investing</p>
                        </div>

                        <button onClick={saveConfig} className="self-start px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover">
                            {configSaved ? "Salvo!" : "Salvar Configurações"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
