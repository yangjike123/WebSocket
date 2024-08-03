import { useEffect, useState } from "react";
import { MessageData } from '../../types/ISocket';
export default () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isSocketConnect, setIsSocketConnect] = useState<boolean>(false); // 连接状态
    const [sendValue, setSendValue] = useState<string>('');//发送内容
    const [messageList, setMessageList] = useState<MessageData[]>([]); // 消息记录
    // 发送消息
    function onSendMessage(event: React.KeyboardEvent) {
        if (event.code === 'Enter' && socket && isSocketConnect) {
            if (!sendValue) throw new Error('请输入内容');
            const value = {
                sendType: 'text',
                content: sendValue,
                timestamp: Date.now(),
                isMy: true,
            } as MessageData;
            socket.send(JSON.stringify(value));
            setMessageList((messageList) => messageList.concat(value));
            setSendValue(''); // 清空发送内容
        }
    }
    // 连接WebSocket
    function webSocketConnect() {
        const socket = new WebSocket('ws://localhost:8088');
        // WebSocket 连接已打开
        socket.onopen = () => {
            setSocket(socket);
            setIsSocketConnect(true);
            console.log('连接成功');
        };
        // 连接失败
        socket.onerror = (err) => {
            setIsSocketConnect(false);
            console.error(err, '连接失败');
        }
        // 关闭连接
        socket.onclose = () => setIsSocketConnect(false);
        // 接收服务端发送过来的消息
        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data) as MessageData;
            // 合并服务端发送过来的消息
            setMessageList((messageList) => messageList.concat(data));
        });
    }
    useEffect(() => {
        webSocketConnect();
    }, []);
    return (
        <main>
            <div>
                <input type="text" value={sendValue} onChange={(e) => setSendValue(e.target.value)} onKeyUp={onSendMessage} />
            </div>
            <div style={{ margin: 'auto', width: '100%' }}>
                {messageList.map((item) => {
                    return <div style={{ color: item.isMy ? 'red' : 'black' }}>{item.content}</div>
                })}
            </div>
        </main>
    )
}