interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
	<div className={`bg-white border border-black p-4 ${className}`}>
		{children}
	</div>
);
