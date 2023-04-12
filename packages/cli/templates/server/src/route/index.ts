import express from 'express';
import { resolve } from 'path';
import { init as projInit, list as projList } from '../controller/projCtrl';
import { uploadPost as logPostUpload, uploadGet as logGetUpload, list as logList, detail as logDetail } from '../controller/logCtrl';
import { upload as smUpload, search as smSearch } from '../controller/sourcemapCtrl';
import { statisticTotalGet, statisticProjGet } from '../controller/statisticCtrl';
import { list as sessionList } from '../controller/sessionCtrl';

const resolveDirname = (target: string) => resolve(__dirname, target);

const router = express.Router(); // 创建路由对象

router.get('/project/init', projInit);
router.get('/project/list', projList);

router.get('/statistic/total', statisticTotalGet);
router.get('/statistic/proj', statisticProjGet);

router.post('/log/upload', logPostUpload);
router.get('/log/upload', logGetUpload);
router.get('/log/list', logList);
router.get('/log/detail', logDetail);

router.post('/sourcemap/upload', smUpload);
router.get('/sourcemap/search', smSearch);

router.get('/session/list', sessionList);

router.get('/test', (req, res) => {
  res.send({
    code: 0,
    data: {
      mesaage: '测试接口'
    },
    msg: 'succeed'
  });
});

// views
router.use('/', express.static(resolveDirname('../views')));

export default router;
