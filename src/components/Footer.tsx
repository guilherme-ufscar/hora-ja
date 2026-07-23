import Link from "next/link";

const footerLinks = [
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
    { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    { href: "/termos-de-uso", label: "Termos de Uso" },
];

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-card-border/60 bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Hora<span className="text-primary">Já</span> Cambio
                    </span>
                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-foreground/70">
                        {footerLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <p className="text-xs text-foreground/45 max-w-3xl">
                    O HoraJá Cambio pode receber comissão por indicações feitas através de links de parceiros exibidos no site. Isso não altera o valor pago pelo usuário. As cotações têm caráter informativo e não constituem recomendação de investimento.
                </p>

                <p className="text-xs text-foreground/40">
                    © {new Date().getFullYear()} HoraJá Cambio. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
