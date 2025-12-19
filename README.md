# TypeScript 練習題目 - 主線任務三｜最終專案(前、後台)

## 題目概述

延續上一週 [任務(task2)](https://github.com/YPINPIN/2025-ts-task-2) 專案，完成功能開發：

- Level 1: 完成後台專案商品管理、優惠券管理
- Level 2: 完成前台專案的商品列表呈現與串接
- Level 3: 完成前台專案的購物流程

> 備註：Leve2, 3 的前台專案參考 [hexschool/ts-final-front - main 分支](https://github.com/hexschool/ts-final-front)

## 學習目標

- 練習 TypeScript 基本語法
- 理解型別註解的使用
- 學習介面 (Interface) 定義
- 熟練泛型 (Generic) 的應用
- 掌握函式型別定義

## 專案結構說明

```
src/
├── api/               # 與後端溝通的 API 函式
├── assets/            # 靜態資源（images、styles、fonts）
│   ├── images/
│   └── styles/
├── components/        # 可重用 Vue 組件（Header、Footer、Modal 等）
├── composable/        # Vue 組合式函式（useXxx）
├── types/             # TypeScript 型別定義
├── router/            # Vue Router 路由設定
├── stores/            # Pinia/Vuex 等狀態管理
├── utils/             # 共用工具函式（日期）
├── views/             # 頁面元件（對應路由）
└── constants.ts       # 後台側邊欄常數
```
