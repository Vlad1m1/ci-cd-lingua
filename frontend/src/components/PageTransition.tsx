import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import styles from "@styles/components/PageTransition.module.scss";

interface PageTransitionProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
}

const PageTransition = ({ isOpen, children }: PageTransitionProps) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			setTimeout(() => setIsAnimating(true), 10);
		} else {
			setIsAnimating(false);
			setTimeout(() => setShouldRender(false), 400);
		}
	}, [isOpen]);

	if (!shouldRender) return null;

	return (
		<div
			className={`${styles.overlay} ${isAnimating ? styles.active : ""}`}
		>
			<div
				className={`${styles.page} ${isAnimating ? styles.active : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default PageTransition;
