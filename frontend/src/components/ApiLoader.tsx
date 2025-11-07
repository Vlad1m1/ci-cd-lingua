import {CSSProperties, useCallback, useEffect} from "react";

import styles from "@styles/components/ApiLoader.module.scss";


const ANIMATION_DURATION_MS = 1500;

const ApiLoader = () => {
	
	const handleAnimationEnd = useCallback(() => {
		console.log("animation end");
	}, []);
	
	useEffect(() => {
		const id = setInterval(handleAnimationEnd, ANIMATION_DURATION_MS);
		return () => clearInterval(id);
	}, [handleAnimationEnd]);
	
	
	return (
		<div
			className={styles.loader}
			style={{ "--animation-duration": `${ANIMATION_DURATION_MS}ms` } as CSSProperties}
		/>
	);
};

export default ApiLoader;
