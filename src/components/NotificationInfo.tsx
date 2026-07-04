interface NotificationInfoProps {
    currencyCode: string;
    currencyName: string;
    currencyFlag: string;
}

import NotificationBell from "./NotificationBell";

export default function NotificationInfo({ currencyCode, currencyName, currencyFlag }: NotificationInfoProps) {
    return (
        <section className="glass-panel p-8 rounded-[2rem] mb-8">
            <div className="flex items-start gap-6">
                <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">
                        {currencyFlag} Receba alertas de {currencyName}
                    </h3>
                    <p className="text-foreground/60 mb-4">
                        Nunca perca o melhor momento para comprar ou vender! Configure notificações e receba alertas por email quando {currencyName} atingir o valor que você deseja.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card-bg">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-500">
                                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-foreground text-sm">Notificações por Email</div>
                                <div className="text-xs text-foreground/50">Receba alertas diretamente na sua caixa de entrada</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-foreground/5">
                        <h4 className="text-sm font-bold text-foreground mb-2">Como funciona?</h4>
                        <ul className="text-sm text-foreground/60 space-y-1">
                            <li>• Configure o valor desejado (ex: avisar quando {currencyCode} atingir R$ 6,00)</li>
                            <li>• Informe seu email</li>
                            <li>• Receba o alerta automaticamente quando a condição for atingida</li>
                        </ul>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <NotificationBell
                            currencyCode={currencyCode}
                            currencyName={currencyName}
                            currencyFlag={currencyFlag}
                            className="text-base py-3 px-6"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
