import express from 'express';
import socket from './socket';
const port = process.env.PORT || 3000;
const app = express();
socket();

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});