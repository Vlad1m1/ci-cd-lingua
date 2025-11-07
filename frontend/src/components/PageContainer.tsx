import {FC, ReactNode} from "react";

import styles from "@styles/components/PageContainer.module.scss";

interface OwnProps {
	children: ReactNode | ReactNode[] | string;
}

const PageContainer:FC<OwnProps> = ({children}) => {
	return (
		<div className={styles.page}>
			{children}
		</div>
	);
};

export default PageContainer;
