# AI Caption Editor 🎬

<div align="center">
  <img src="https://img.shields.io/badge/react_native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/convex-3E3B9D?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
  <img src="https://img.shields.io/badge/elevenlabs-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1oZWFkcGhvbmVzIj48cGF0aCBkPSJNMyA1YTIgMiAwIDAgMSAyLTJoM2EyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yeiIvPjxwYXRoIGQ9Ik0yIDE1aDQiLz48cGF0aCBkPSJNMiAxOWg0Ii8+PHBhdGggZD0iTTIyIDE1aC0zIi8+PHBhdGggZD0iTTE5IDExaDMiLz48cGF0aCBkPSJNMTkgN2gzIi8+PHBhdGggZD0iTTE5IDNoLTMiLz48L3N2Zz4=&logoColor=white" alt="ElevenLabs" />
</div>

## Overview

AI Caption Editor is a modern, cross-platform mobile application that leverages artificial intelligence to help users create, edit, and manage video captions with ease. The app provides an intuitive interface for generating accurate captions, customizing their appearance, and exporting them in various formats.

Packages:

- [Expo Router](https://docs.expo.dev/routing/introduction/) file-based navigation
- [Convex Database](https://docs.convex.dev/database?utm_source=simon_grimm&utm_medium=video&dub_id=eV96rPl11O0EC58S) for data storage
- [Convex File Storage](https://docs.convex.dev/file-storage?utm_source=simon_grimm&utm_medium=video&dub_id=eV96rPl11O0EC58S) for file storage
- [Sentry](https://dub.sh/sentry-galaxies) for error tracking
- [Clerk Passkeys](https://docs.clerk.com/passkeys/overview?utm_source=simong&utm_medium=youtube&utm_campaign=captions-clone&dub_id=5zB4z5fxgHWQzbgE) for passwordless authentication
- [Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) for haptic feedback
- [Jotai](https://jotai.pmnd.rs/) for state management
- [NativeWind](https://www.nativewind.dev/) for styling
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/secure-store/) for secure storage
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/image-picker/) for image picking
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/) for video playback
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/) for audio playback

## ✨ Features

- 🎥 **Video Integration**: Seamlessly import and preview videos from your device
- 🤖 **AI-Powered Captioning**: Generate accurate captions using ElevenLabs' advanced AI speech recognition models
- 🎙️ **Speech-to-Text**: Automatically transcribe video speech to text with high accuracy
- 🎵 **Text-to-Speech**: Generate natural-sounding voiceovers using ElevenLabs' premium AI voices
- 🎭 **Voice Selection**: Choose from a variety of pre-made voices to match your content's style
- ✏️ **Intuitive Editor**: Easily edit and customize captions with a user-friendly interface
- 🎨 **Custom Styling**: Personalize caption appearance with various fonts, colors, and animations
- 🔄 **Real-time Preview**: See changes instantly as you edit
- 📂 **Export**: Export your video with captions burned-in
- 🌐 **Cross-Platform**: Works on both iOS and Android devices
- 🔒 **Secure Authentication**: Built with Clerk for secure user management
- ⚡ **Offline Support**: Work without an internet connection

## 🚀 Tech Stack

### Frontend

- **React Native**: Cross-platform mobile application development
- **Expo**: Development platform for building universal apps
- **TypeScript**: Type-safe JavaScript development
- **NativeWind**: Utility-first CSS framework for React Native
- **React Navigation**: Routing and navigation for React Native
- **Jotai**: State management
- **Expo AV**: Audio/Video playback and recording

### Backend

- **Convex**: Backend-as-a-Service with real-time database
- **Clerk**: Authentication and user management
- **ElevenLabs**: AI-powered speech recognition for generating accurate captions from video audio and natural-sounding text-to-speech capabilities

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Static type checking

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or physical device with Expo Go

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ahsant4riq/ai-caption-editor.git
   cd ai-caption-editor
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   EXPO_PUBLIC_CONVEX_URL=your_convex_url
   ```

4. Start the development server

   ```bash
   bun expo prebuild
   bun start
   ```

5. Run on your preferred platform
   - iOS: `bun ios`
   - Android: `bun android`

### Convex Setup

1. Create an account on [Convex](https://convex.dev)
2. Run `bunx convex dev` to start the development server

### Microservice Setup

1. `brew install ffmpeg` to install `ffmpeg`
2. Go into the `/microservice` folder
3. Run `bun install` to install the dependencies
4. Run `bun run dev` to start the microservice

You then have to add the URL to the Convex environment variable `MICROSERVICE_URL`. I recommend using something like [ngrok](https://ngrok.com/) to test the microservice locally.

```bash
bunx convex env set MICROSERVICE_URL <your-microservice-url>
```

### Authentication Setup

Create a [Clerk](https://clerk.com/) account and project, then update the `convex/auth.config.js` file with your `domain` and `applicationID`.

```bash
bunx convex env set CLERK_FRONTEND_API_URL your-clerk-frontend-api-url
```

```js
export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: 'convex',
    },
  ],
};
```

You also need to connect Convex and Clerk with a JWT template. For this, cehck out the video and [Convex docs](https://docs.convex.dev/auth).

### Webhook Setup

You need to set up a webhook in Clerk to handle the user creation and update events.

1. Go to [Clerk](https://clerk.com/) and select your project
2. Go to **API** and select **Webhooks**
3. Add the following webhook, which should point to your Convex instance and include the `user.created` and `user.deleted` events:

### ElevenLabs Setup

1. Create an account on [ElevenLabs](https://elevenlabs.io/)
2. Get an API key from ElevenLabs
3. Add the key to Convex by running `bunx convex env set ELEVENLABS_API_KEY=<your-api-key>`

### Sentry Setup

1. Create a new project on [Sentry](https://sentry.io/)
2. Use the `bunx @sentry/wizard@latest -s -i reactNative` command to setup Sentry for your project

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

This project makes use of the following amazing technologies and services:

- [ElevenLabs](https://elevenlabs.io/) for their powerful AI speech recognition, text-to-speech, and caption generation capabilities
- [React Native](https://reactnative.dev/) for cross-platform mobile development
- [Expo](https://expo.dev/) for the amazing development platform
- [Convex](https://www.convex.dev/) for the powerful backend solution
- [Clerk](https://clerk.dev/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Ahsan Tariq | [LinkedIn](https://linkedin.com/in/ahsant4riq)
