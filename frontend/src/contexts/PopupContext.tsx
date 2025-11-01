import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PopupItem {
  id: number;
  content: ReactNode;
  isOpen: boolean;
}

interface PopupContextType {
  openPopup: (content: ReactNode) => void;
  closePopup: () => void;
  popups: PopupItem[];
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error("usePopup must be used within PopupProvider");
	}
	return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

let nextPopupId = 0;

export const PopupProvider = ({ children }: PopupProviderProps) => {
	const [popups, setPopups] = useState<PopupItem[]>([]);

	const openPopup = useCallback((newContent: ReactNode) => {
		const id = nextPopupId++;
		setPopups(prev => [...prev, { id, content: newContent, isOpen: true }]);
	}, []);

	const closePopup = useCallback(() => {
		setPopups(prev => {
			if (prev.length === 0) return prev;
			
			const newPopups = [...prev];
			newPopups[newPopups.length - 1] = {
				...newPopups[newPopups.length - 1],
				isOpen: false,
			};
			
			setTimeout(() => {
				setPopups(current => current.slice(0, -1));
			}, 300);
			
			return newPopups;
		});
	}, []);

	return (
		<PopupContext.Provider value={{ openPopup, closePopup, popups }}>
			{children}
		</PopupContext.Provider>
	);
};
