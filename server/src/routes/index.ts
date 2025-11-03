import express from 'express';
import AuthRoute from './auth.route';
import LanguageRoute from './language.route';
import ModuleRoute from './module.route';
import LevelRoute from './level.route';
import QuestRoute from './quest.route';
import ProgressRoute from './progress.route';
import FriendRoute from './friend.route';

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/languages', LanguageRoute);
router.use('/modules', ModuleRoute);
router.use('/levels', LevelRoute);
router.use('/quests', QuestRoute);
router.use('/progress', ProgressRoute);
router.use('/friends', FriendRoute);

export default router;
