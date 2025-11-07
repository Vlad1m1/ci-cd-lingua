export interface MockWebAppAPI {
	platform: string;
	version: string;
	isExpanded: boolean;
	viewportHeight: number;
	viewportStableHeight: number;
	headerColor: string;
	backgroundColor: string;
	isClosingConfirmationEnabled: boolean;
	initData: string;
	BackButton: {
		isVisible: boolean;
		show: () => void;
		hide: () => void;
		onClick: (callback: () => void) => void;
		offClick: (callback: () => void) => void;
	};
	HapticFeedback: {
		impactOccurred: (style: string) => void;
		notificationOccurred: (type: string) => void;
		selectionChanged: () => void;
	};
	ready: () => void;
	expand: () => void;
	close: () => void;
	enableClosingConfirmation: () => void;
	disableClosingConfirmation: () => void;
	showPopup: (params: { message: string }) => void;
	showAlert: (message: string) => void;
	showConfirm: (message: string) => void;
}

export type DevNotificationCallback = (message: string, duration: number) => void;

const backButtonCallbacksStore: Array<() => void> = [];

export const createMockWebAppAPI = (
	onNotification: DevNotificationCallback,
	onBackButtonChange: (isVisible: boolean) => void,
	onClose: () => void,
): MockWebAppAPI => {
	let backButtonVisible = false;

	return {
		platform: "web",
		version: "7.0",
		isExpanded: true,
		viewportHeight: window.innerHeight,
		viewportStableHeight: window.innerHeight,
		headerColor: "#667eea",
		backgroundColor: "#ffffff",
		isClosingConfirmationEnabled: false,
		initData: "auth_date%3D1733485316394%26query_id%3D158b120b-7aa3-4a0f-a198-52ace06d0658%26user%3D%257B%2522language_code%2522%253A%2522ru%2522%252C%2522first_name%2522%253A%2522%25D0%2592%25D0%25B0%25D1%2581%25D1%258F%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522photo_url%2522%253Anull%252C%2522username%2522%253Anull%252C%2522id%2522%253A400%257D%26hash%3Df982406d90b118d8e90e26b33c5cec0cadd3fc30354f2955c75ff8e3d14d130d",

		BackButton: {
			get isVisible() {
				return backButtonVisible;
			},
			show() {
				backButtonVisible = true;
				onBackButtonChange(true);
				onNotification("BackButton.show()", 1000);
			},
			hide() {
				backButtonVisible = false;
				onBackButtonChange(false);
				onNotification("BackButton.hide()", 1000);
			},
			onClick(callback: () => void) {
				backButtonCallbacksStore.push(callback);
				onNotification(`BackButton.onClick() registered (${backButtonCallbacksStore.length} total)`, 1000);
			},
			offClick(callback: () => void) {
				const index = backButtonCallbacksStore.indexOf(callback);
				if (index > -1) {
					backButtonCallbacksStore.splice(index, 1);
					onNotification(`BackButton.offClick() removed (${backButtonCallbacksStore.length} left)`, 1000);
				} else {
					onNotification(`BackButton.offClick() - callback not found (${backButtonCallbacksStore.length} total)`, 1000);
				}
			},
		},

		HapticFeedback: {
			impactOccurred(style: string) {
				onNotification(`Haptic: impact (${style})`, 1000);
			},
			notificationOccurred(type: string) {
				onNotification(`Haptic: notification (${type})`, 1000);
			},
			selectionChanged() {
				onNotification("Haptic: selection changed", 1000);
			},
		},

		ready() {
			onNotification("WebApp.ready()", 1000);
		},

		expand() {
			onNotification("WebApp.expand()", 1000);
		},

		close() {
			onClose();
			onNotification("WebApp.close()", 1000);
		},

		enableClosingConfirmation() {
			onNotification("Closing confirmation enabled", 1000);
		},

		disableClosingConfirmation() {
			onNotification("Closing confirmation disabled", 1000);
		},

		showPopup(params: {message: string}) {
			onNotification(`showPopup: ${params.message || ""}`, 2000);
		},

		showAlert(message: string) {
			alert(`[DEV] ${message}`);
			onNotification(`showAlert: ${message}`, 2000);
		},

		showConfirm(message: string) {
			const result = confirm(`[DEV] ${message}`);
			onNotification(`showConfirm: ${message}`, 2000);
			return result;
		},
	};
};

export const triggerBackButtonCallbacks = () => {
	const callbacks = [...backButtonCallbacksStore];
	callbacks.forEach((callback) => {
		try {
			callback();
		} catch (error) {
			console.error("Error in BackButton callback:", error);
		}
	});
};
