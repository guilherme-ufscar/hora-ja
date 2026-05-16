interface AdSlotProps {
    label: string;
    width: number;
    height: number;
    className?: string;
}

export default function AdSlot({ label, width, height, className = "" }: AdSlotProps) {
    return (
        <div
            className={`glass-panel border-dashed border-primary/20 flex flex-col items-center justify-center text-center text-foreground/50 ${className}`.trim()}
            style={{ minHeight: height, width: "100%", maxWidth: width }}
        >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Espaço reservado
            </span>
            <strong className="mt-2 text-base text-foreground/80">{label}</strong>
            <span className="mt-1 text-sm">{width}×{height}</span>
        </div>
    );
}
