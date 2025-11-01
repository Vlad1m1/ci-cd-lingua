import {Button, Typography} from "@maxhub/max-ui";

import {usePopup} from "../../contexts/PopupContext";
import NestedPage from "../NestedPage/NestedPage";

import styles from "./DetailPage.module.scss";

// сгенерировано чатом жпт, НЕ ИСПОЛЬЗОВАТЬ В КАЧЕСТВЕ РЕФЕРЕНСА!!!
const DetailPage = () => {
	const { openPopup } = usePopup();
	
	const handleOpenPopup = () => {
		openPopup(<NestedPage/>);
	};
	
	return (
		<>
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.title}>
						<Typography.Headline variant="large-strong">Детальная страница</Typography.Headline>
					</div>
					<div className={styles.description}>
						<Typography.Body variant="medium">
							Это пример детальной страницы с вложенными popup окнами.
						</Typography.Body>
					</div>
					<div className={styles.content}>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Информация</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									Страница открывается справа с плавной анимацией и затемнением фона.
								</Typography.Body>
							</div>
						</div>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Навигация</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									Используйте кнопку "Назад" или свайп вправо для возврата на предыдущую страницу.
								</Typography.Body>
							</div>
							<Button
								className={styles.button}
								onClick={handleOpenPopup}
							>
								Открыть вложенный popup
							</Button>
						</div>
						<div className={styles.card}>
							<div className={styles.cardTitle}>
								<Typography.Headline variant="medium-strong">Особенности</Typography.Headline>
							</div>
							<div className={styles.cardText}>
								<Typography.Body variant="medium">
									TabBar скрыт на этой странице, что позволяет сфокусироваться на контенте.
								</Typography.Body>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DetailPage;
