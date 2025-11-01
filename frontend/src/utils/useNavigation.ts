import { useState, useEffect, useCallback, useRef } from "react";

import WebApp from "../WebApp/WebApp";


interface NavigationItem {
  backFunction: () => void;
}

export const useNavigation = () => {
	const [navigationStack, setNavigationStack] = useState<NavigationItem[]>([]);

	const currentView = navigationStack[navigationStack.length - 1];

	const navigate = (backFunction: () => void) => {
		setNavigationStack(prev => [...prev, {backFunction}]);
	};
  
	const goBack = useCallback(() => {
		setNavigationStack(prev => {
			if (prev.length === 0) return prev;
      
			const currentItem = prev[prev.length - 1];
			currentItem.backFunction(); // Вызываем функцию закрытия
      
			return prev.slice(0, -1);
		});
	}, []);

	const reset = () => {
		setNavigationStack([]);
	};
  
	// Use ref to avoid re-creating handleBack when goBack changes
	const goBackRef = useRef(goBack);
	goBackRef.current = goBack;

	const handleBack = useCallback(() => {
		goBackRef.current();
	}, []);

	// Register BackButton callback once
	useEffect(() => {
		WebApp.BackButton.onClick(handleBack);

		return () => {
			WebApp.BackButton.offClick(handleBack);
		};
	}, [handleBack]);

	// Show/hide BackButton based on navigation stack length
	useEffect(() => {
		if (navigationStack.length > 0) {
			WebApp.BackButton.show();
		} else {
			WebApp.BackButton.hide();
		}
	}, [navigationStack.length]);

	return {
		currentView,
		navigate,
		goBack,
		reset,
		canGoBack: navigationStack.length > 1,
		stackLength: navigationStack.length,
	};
};
