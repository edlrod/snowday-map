interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
	<div
		className={`bg-white dark:bg-zinc-900 border border-black dark:border-zinc-600 text-black dark:text-white p-4 ${className}`}
	>
		{children}
	</div>
);
