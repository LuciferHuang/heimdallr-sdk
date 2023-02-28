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

// resource
router.use('/browser-dist', express.static(resolveDirname('../../../browser/dist')));
router.use('/customer-dist', express.static(resolveDirname('../../../customer/dist')));
router.use('/dom-dist', express.static(resolveDirname('../../../dom/dist')));
router.use('/fetch-dist', express.static(resolveDirname('../../../fetch/dist')));
router.use('/hash-dist', express.static(resolveDirname('../../../hash/dist')));
router.use('/history-dist', express.static(resolveDirname('../../../history/dist')));
router.use('/crash-dist', express.static(resolveDirname('../../../page_crash/dist')));
router.use('/crash-worker', express.static(resolveDirname('../../../page_crash_worker/dist')));
router.use('/performance-dist', express.static(resolveDirname('../../../performance/dist')));
router.use('/xhr-dist', express.static(resolveDirname('../../../xhr/dist')));

// views
router.use('/', express.static(resolveDirname('../views')));
router.use('/demo', express.static(resolveDirname('../views/demo.html')));

export default router;
