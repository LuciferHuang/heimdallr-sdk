import express from 'express';
import cors from 'cors';
import formidable from 'express-formidable';
import router from './route';
import expressIp from "express-ip";

const port = <%= server_port %>;

const app = express();

app.use(formidable());
app.use(cors());
app.use(expressIp().getIpInfoMiddleware);
app.use(router);

app.listen(port, () => {
  console.log(`server running on localhost:${port}`)
});
