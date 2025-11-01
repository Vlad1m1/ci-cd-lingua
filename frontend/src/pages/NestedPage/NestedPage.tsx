import {Typography} from "@maxhub/max-ui";

import styles from "../DetailPage/DetailPage.module.scss";

const NestedPage = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.title}>
					<Typography.Headline variant="large-strong">Вложенный popup</Typography.Headline>
				</div>
				<div className={styles.description}>
					<Typography.Body variant="medium">
						Это вложенное popup окно, которое открывается поверх детальной страницы.
					</Typography.Body>
				</div>
			</div>
		</div>
	);
};

export default NestedPage;
