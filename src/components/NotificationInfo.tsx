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
                        Nunca perca o melhor momento para comprar ou vender! Configure notificações e receba alertas por email ou WhatsApp quando {currencyName} atingir o valor que você deseja.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card-bg">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-foreground text-sm">Notificações por WhatsApp</div>
                                <div className="text-xs text-foreground/50">Alertas instantâneos no seu celular</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-foreground/5">
                        <h4 className="text-sm font-bold text-foreground mb-2">Como funciona?</h4>
                        <ul className="text-sm text-foreground/60 space-y-1">
                            <li>• Configure o valor desejado (ex: avisar quando {currencyCode} atingir R$ 6,00)</li>
                            <li>• Escolha receber por email ou WhatsApp</li>
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
