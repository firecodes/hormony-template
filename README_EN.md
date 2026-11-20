<div align="center">

<img src="docs/images/graphs/logo.svg" width="120" alt="HarmonyKit Logo"/>

# HarmonyKit

_An out-of-the-box HarmonyOS rapid development framework_

<!-- Language Switch Button -->
<div align="center">
  <a href="README.md">🌍 中文</a>
</div>

[![GitHub](https://img.shields.io/badge/GitHub-HarmonyKit-blue?style=flat-square&logo=github)](https://github.com/Joker-x-dev/HarmonyKit)
[![Gitee](https://img.shields.io/badge/Gitee-HarmonyKit-red?style=flat-square&logo=gitee)](https://gitee.com/Joker-x-dev/HarmonyKit)
[![Docs](https://img.shields.io/badge/Docs-harmony.dusksnow.top-orange?style=flat-square&logo=readthedocs)](https://harmony.dusksnow.top)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Joker-x-dev/HarmonyKit)

</div>

## 📖 Project Overview

HarmonyKit is a rapid development framework built on **HarmonyOS NEXT / ArkTS / ArkUI**. It ships with the most common app capabilities (networking, paging, database, local storage, state management, navigation, etc.) and provides clean module structure plus demo pages so you can **clone → run → build** quickly.

> If this project helps you, please give it a Star ⭐ It means a lot and keeps the project moving forward!

## 📱 Project Preview

<img src="docs/images/preview/mobile.png" alt="Mobile"/>

<img src="docs/images/preview/foldable.png" alt="Foldable"/>

<img src="docs/images/preview/tablet.png" alt="Tablet"/>

### 📍 Project Links

- **GitHub**: https://github.com/Joker-x-dev/HarmonyKit
- **Gitee**: https://gitee.com/Joker-x-dev/HarmonyKit

> This framework comes from the real-world CoolMall (HarmonyOS) practice. It keeps only the generic capabilities and demos. For the full e-commerce project, see:
> GitHub: https://github.com/Joker-x-dev/CoolMallArkTS
> Gitee: https://gitee.com/Joker-x-dev/CoolMallArkTS

### 📚 Documentation

- **Docs**: [View online](https://harmony.dusksnow.top)
  - Kept in sync with the code, covering quick start, architecture, sample routes, and common customization points
- **IBest-UI-V2**: [View online](https://ibestui-v2.ibestservices.com)
  - Component usage and parameters with common examples
- **IBest-ORM**: [View online](https://ibest-orm.ibestservices.com)
  - Local database usage and entity definitions with basic examples

## 🧩 Built-in Capabilities

- **Base Networking**: unified request + loading/error/empty handling
- **Paged List**: paging logic with refresh/load more/empty states
- **Navigation**: args passing, result returning, route interception demos
- **Database**: IBest-ORM CRUD demos
- **Local Storage**: lightweight account storage demo
- **State Management**: V2 (ObservedV2 / AppStorageV2 / PersistenceV2) demos
- **Screen Adaptation**: breakpoint + safe-area demos
- **Design System**: unified spacing/colors/fonts and shared components

## 🛠️ Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| Language | ArkTS | HarmonyOS NEXT primary language |
| UI Framework | ArkUI | Declarative UI framework |
| Architecture | MVVM | View + ViewModel separation |
| Navigation | Navigation | Route & navigation management |
| State | V2 | ObservedV2 / AppStorageV2 |
| UI Library | IBest-UI-V2 | Business UI components |
| Network | Axios | HTTP client & interceptors |
| Database | IBest-ORM | Local database |

## 📱 Feature Module Directory

- **Main Module (main)**
  - Core demo (core)
  - Navigation demo (navigation)
  - Expand demo (expand)
  - About page (about)

- **Auth Module (auth)**
  - Login page (login)

- **User Module (user)**
  - User profile (profile)

- **Demo Module (demo)**
  - Base network demo (network-demo)
  - Paged list demo (network-list-demo)
  - Database demo (database)
  - Local storage demo (local-storage)
  - State management demo (state-management)
  - Network request demo (network-request)
  - Navigation with args (navigation-with-args)
  - Result passing demo (navigation-result)
  - Safe-area demo (safe-area)
  - Screen adaptation demo (screen-adapt)

## 📁 Project Structure

```
AppScope/               # App configuration
entry/                  # App entry module
core/                   # Core modules
│   ├── base/           # Base classes
│   ├── data/           # Data layer
│   ├── database/       # Database
│   ├── datastore/      # Local storage
│   ├── designsystem/   # Design system
│   ├── ibestui/        # IBest UI components
│   ├── model/          # Data models
│   ├── navigation/     # Navigation
│   ├── network/        # Network layer
│   ├── result/         # Result handling
│   ├── state/          # Global state
│   ├── ui/             # UI components
│   └── util/           # Utilities
feature/                # Feature modules
│   ├── auth/           # Auth module
│   ├── demo/           # Demo module
│   ├── main/           # Main module
│   └── user/           # User module
```

## 🚀 Quick Start

1. Open the project in DevEco Studio and sync dependencies.
2. Run the entry module to experience the demos.
3. Follow the feature modules to start building your own business logic.

## 👥 Join the Community

Welcome to the developer group—share learning notes and discuss technical questions together!

<div align="left">
  <img src="docs/images/group/qq.jpg" width="200" alt="QQ group QR code"/>
  <p>Scan or search the group number to join the QQ group</p>
</div>

## 🤝 Contributing

PRs and Issues are welcome. Let’s make HarmonyOS development faster and better together.
