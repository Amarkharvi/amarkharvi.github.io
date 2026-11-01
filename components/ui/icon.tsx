import { cn } from "@/lib/cn";

type IconProps = {
	name: string;
	className?: string;
	filled?: boolean;
};

export function Icon({ name, className, filled }: IconProps) {
	return (
		<span
			aria-hidden="true"
			className={cn("material-symbols-outlined shrink-0", className)}
			style={filled ? { fontVariationSettings: '"FILL" 1' } : undefined}
		>
			{name}
		</span>
	);
}
