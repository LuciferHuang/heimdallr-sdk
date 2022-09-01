import express from 'express';
import { resolve } from 'path';
import { init as projInit, list as projList } from '../controller/projCtrl';
import { upload as logUpload, list as logList, detail as logDetail } from '../controller/logCtrl';
import { upload as smUpload, search as smSearch } from '../controller/sourcemapCtrl';

const resolveDirname = (target: string) => resolve(__dirname, target);

const router = express.Router(); // 创建路由对象

router.get('/project/init', projInit);
router.get('/project/list', projList);

router.post('/log/upload', logUpload);
router.get('/log/list', logList);
router.get('/log/detail', logDetail);

router.post('/sourcemap/upload', smUpload);
router.get('/sourcemap/search', smSearch);

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
router.use('/browser-dist', express.static(resolve('./packages/browser/dist')));
router.use('/customer-dist', express.static(resolve('./packages/customer/dist')));
router.use('/dom-dist', express.static(resolve('./packages/dom/dist')));
router.use('/fetch-dist', express.static(resolve('./packages/fetch/dist')));
router.use('/hash-dist', express.static(resolve('./packages/hash/dist')));
router.use('/history-dist', express.static(resolve('./packages/history/dist')));
router.use('/crash-dist', express.static(resolve('./packages/page_crash/dist')));
router.use('/crash-worker', express.static(resolve('./packages/page_crash_worker/dist')));
router.use('/performance-dist', express.static(resolve('./packages/performance/dist')));
router.use('/xhr-dist', express.static(resolve('./packages/xhr/dist')));

// views
router.use('/', express.static(resolveDirname('../views')));

export default router;
