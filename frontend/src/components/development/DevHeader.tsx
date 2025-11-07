import styles from "@styles/components/development/DevHeader.module.scss";

interface DevHeaderProps {
	showBackButton: boolean;
	onBack: () => void;
	onClose: () => void;
}

const DevHeader = ({ showBackButton, onBack, onClose }: DevHeaderProps) => {
	return (
		<div className={styles.devHeader}>
			<div className={styles.devHeaderLeft}>
				{showBackButton ? (
					<button className={styles.devButton} onClick={onBack}>
						← Back
					</button>
				) : (
					<button className={styles.devButton} onClick={onClose}>
						✕ Close
					</button>
				)}
			</div>
			<div className={styles.devHeaderCenter}>
				<span className={styles.devTitle}>DEV MODE</span>
			</div>
			<div className={styles.devHeaderRight}></div>
		</div>
	);
};

export default DevHeader;
