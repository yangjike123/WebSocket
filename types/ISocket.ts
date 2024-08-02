export enum ESendType {
    text = 'text', // 用户消息
    message = 'message', // 系统提示消息
    image = 'image', // 发送图片
    video = 'video' // 发送视频
};

export interface MessageData {
    sendType: keyof typeof ESendType; // 发送类型
    content: string; // 发送内容
    timestamp: number; // 发送时间
    isMy: boolean; 
};
