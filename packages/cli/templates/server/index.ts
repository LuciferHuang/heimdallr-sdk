import express from 'express';
import cors from 'cors';
import formidable from 'express-formidable';
import { create } from 'browser-sync';
import router from './route';

const port = 7777;
const proxyPort = <%= server_port %>;

const app = express();

app.use(formidable());
app.use(cors());
app.use(router);

const bs = create();

app.listen(port, () => {
  bs.init({
    open: false,
    ui: false,
    notify: true,
    proxy: `localhost:${port}`,
    files: ['packages/**/dist/*.iife.js'],
    port: proxyPort
  });
});
