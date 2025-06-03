# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

# My React Router App

基于 React Router v7 的现代Web应用，集成了AI语音助手和咖啡订购系统。

## 功能特性

- 🎤 **AI语音助手** - 基于腾讯云ASR服务的语音识别
- ☕ **咖啡订购系统** - 语音点单，自动添加到购物车
- 🛒 **购物车管理** - 完整的购物车功能
- 📱 **响应式设计** - 支持各种设备

## 技术栈

- **前端**: React 19, React Router v7, TypeScript, TailwindCSS
- **后端**: React Router SSR
- **语音识别**: 腾讯云ASR服务
- **工具**: Vite, ESLint

## 腾讯云ASR配置

### 1. 获取腾讯云密钥

1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/cam/capi)
2. 创建或使用现有的API密钥
3. 复制 `SecretId` 和 `SecretKey`

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 腾讯云ASR服务配置
TENCENT_SECRET_ID=你的SecretId
TENCENT_SECRET_KEY=你的SecretKey
TENCENT_REGION=ap-beijing
```

### 3. 音频格式支持

支持的音频格式：
- WAV
- MP3  
- M4A
- WEBM
- FLAC

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置腾讯云密钥

复制并修改环境变量文件：

```bash
cp env.example .env
# 编辑 .env 文件，填入你的腾讯云密钥
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 使用说明

### AI语音助手

1. **权限设置**: 首次使用需要允许浏览器麦克风权限
2. **开始录音**: 点击麦克风按钮开始录制
3. **停止录音**: 再次点击麦克风按钮停止录制
4. **自动识别**: 录音结束后自动发送到腾讯云进行语音识别
5. **智能处理**: 识别结果会被智能分析，支持咖啡点单等功能

### 语音点单示例

- "我要一杯拿铁"
- "来两杯美式咖啡"  
- "要一杯热的卡布奇诺"
- "给我来杯冰美式"

## 故障排除

### 常见问题

**1. 语音识别失败**
- 检查网络连接
- 确认腾讯云密钥配置正确
- 检查音频格式是否支持

**2. 麦克风权限问题**
- 在浏览器设置中允许麦克风访问
- 检查操作系统麦克风权限
- 尝试刷新页面重新授权

**3. 音频文件过大**
- 音频文件限制为5MB以内
- 尝试缩短录音时间

### 错误代码

- `AuthFailure`: 认证失败，检查密钥配置
- `InvalidParameter`: 参数错误，检查音频格式
- `RequestLimitExceeded`: 请求频率限制，稍后重试

## 开发

### 项目结构

```
app/
├── components/          # React组件
│   └── AIAssistant.tsx # AI语音助手组件
├── routes/             # 路由和API
│   ├── api.tencent-asr.tsx      # 腾讯云ASR API
│   └── api.speech-processing.tsx # 语音处理API
└── ...
```

### API端点

- `POST /api/tencent-asr` - 腾讯云语音识别
- `POST /api/speech-processing` - 语音语义处理

## 许可证

MIT License
