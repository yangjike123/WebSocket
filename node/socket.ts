import WebSocket from 'ws';
import { MessageData } from '../types/ISocket'
function snedText(content: string, sendType: MessageData['sendType'] = 'message') {
    return JSON.stringify({
        sendType,
        content,
        timestamp: Date.now(),
        isMy: false
    } as MessageData);
}
export default () => {
    const wss = new WebSocket.Server({ port: 8088 });
    let client1: WebSocket | null = null;
    let client2: WebSocket | null = null;
    wss.on('connection', (ws) => { // 开启连接
        if (!client1) {
            client1 = ws;
            client1.send(snedText("等待匹配"));
        } else if (!client2) {
            client2 = ws;
            client2.send(snedText("可以开始聊天了"));
            client1.send(snedText("匹配完成,可以开始聊天了"));
        }
        // 接收客户端消息
        ws.on('message', (message) => {
            const data: MessageData = JSON.parse(message as unknown as string);
            if (ws === client1) {
                if (client2 && client2.readyState === WebSocket.OPEN) {
                    data.isMy = !data.isMy
                    client2.send(JSON.stringify(data));
                }
            } else if (ws === client2) {
                if (client1 && client1.readyState === WebSocket.OPEN) {
                    data.isMy = !data.isMy
                    client1.send(JSON.stringify(data));
                }
            }
        });
        ws.on('close', () => {
            if (ws === client1) {
                client1 = null;
                if (client2) client2.send(snedText('第一个用户已断开连接'));
            } else if (ws === client2) {
                client2 = null;
                if (client1) client1.send(snedText('第二个用户已断开连接'));
            }
            console.log('客户端断开连接');
        });

        ws.on('error', (err) => {
            console.log(err);
        });
    })
}