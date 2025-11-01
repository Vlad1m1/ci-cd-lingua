import { useState, useEffect, useRef } from "react";

import Loader, { type LoaderRef } from "./components/Loader/Loader";
import PopupContainer from "./components/PopupContainer/PopupContainer";
import TabNavigator from "./components/TabNavigator/TabNavigator";
import { tabsConfig } from "./config/tabsConfig";
import { PopupProvider } from "./contexts/PopupContext";
import DevWrapper from "./components/DEVELOPMENT/DevWrapper/DevWrapper";

const isDev = import.meta.env.DEV;

function App() {
	const [showLoader, setShowLoader] = useState(true);
	const [isContentReady, setIsContentReady] = useState(false);
	const loaderRef = useRef<LoaderRef>(null);
	
	useEffect(() => {
		setIsContentReady(true);
	}, []);
	
	useEffect(() => {
		if (isContentReady) {
			loaderRef.current?.exit();
		}
	}, [isContentReady]);

	const handleLoaderComplete = () => {
		setShowLoader(false);
	};

	const appContent = (
		<PopupProvider>
			<TabNavigator tabs={tabsConfig} defaultTabId="puzzle" />
			<PopupContainer />
			{showLoader && <Loader ref={loaderRef} onComplete={handleLoaderComplete} />}
		</PopupProvider>
	);

	return isDev ? <DevWrapper>{appContent}</DevWrapper> : appContent;
}

export default App;
