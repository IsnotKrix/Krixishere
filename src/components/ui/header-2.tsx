'use client';
import { useScroll } from '@/components/ui/use-scroll';
import { cn } from '@/lib/utils';

export function Header() {
	const scrolled = useScroll(10);

	return (
		<>
			<header
				className={cn(
					'fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300',
					scrolled
						? 'bg-[#0a0a0a]/95 backdrop-blur-md border-white/8'
						: 'bg-[#0a0a0a]/70 backdrop-blur-sm border-white/5',
				)}
			>
				<nav className="max-w-5xl mx-auto flex h-14 items-center px-6">
					<a href="/" className="text-white font-semibold tracking-tight text-lg">
						krix<span className="text-violet-400">.</span>
					</a>
				</nav>
			</header>

			<div className="h-14" />
		</>
	);
}
