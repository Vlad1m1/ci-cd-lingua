import { useEffect, useState } from "react";

import styles from "@styles/components/development/DevNotifications.module.scss";

export interface DevNotification {
	id: string;
	message: string;
	duration: number;
	timestamp: number;
}

interface DevNotificationsProps {
	notifications: DevNotification[];
	onRemove: (id: string) => void;
}

const DevNotifications = ({ notifications, onRemove }: DevNotificationsProps) => {
	const [visible, setVisible] = useState<Record<string, boolean>>({});

	useEffect(() => {
		notifications.forEach((notification) => {
			if (!visible[notification.id]) {
				setVisible((prev) => ({ ...prev, [notification.id]: true }));

				setTimeout(() => {
					setVisible((prev) => ({ ...prev, [notification.id]: false }));
					setTimeout(() => onRemove(notification.id), 300);
				}, notification.duration);
			}
		});
	}, [notifications, onRemove, visible]);

	return (
		<div className={styles.devNotifications}>
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={`${styles.devNotification} ${visible[notification.id] ? styles.visible : ""}`}
				>
					{notification.message}
				</div>
			))}
		</div>
	);
};

export default DevNotifications;
