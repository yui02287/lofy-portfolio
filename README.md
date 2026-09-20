# IT's LOFY DESIGN — 作品集網站

純 HTML / CSS 的靜態作品集，不需要任何框架。設計作品頁來自 Figma「LOFY's Design Portfolio」，資訊作品頁來自歐萊德實習成果簡報。

頁面架構：首頁（About me）→ 資訊作品總頁 / 設計作品總頁 → 各個作品介紹。

色系：大地色（白、米、卡其、咖啡），對齊 Behance PORTFOLIO 2025；色票在 `css/style.css` 最上方的 `:root`。

## 檔案

| 檔案 | 說明 |
|---|---|
| `index.html` | 首頁（Banner、專長、About me、兩個作品分類入口） |
| `tech.html` | 資訊作品總頁（歐萊德實習十項 AI 實作的卡片，點進去跳到 `oright.html` 對應段落） |
| `design.html` | 設計作品總頁（Behance 嵌入＋五個設計專案卡片） |
| `oright.html` | 資訊作品：歐萊德 AI 實習成果（由實習成果簡報改排成網頁，圖在 `assets/pages/oright/`） |
| `uiux.html` | 行動雲科 UX 改良提案 |
| `vis.html` | 水牛安養中心 VIS 設計 |
| `lamp.html` | 化蛇 - 仿生燈具設計 |
| `others.html` | 其他作品 |
| `liuchongxi.html` | 六重溪部落 - 文創行銷計畫 |
| `css/style.css` | 全站樣式（含手機版） |
| `build.js` | 產生全部 HTML 的腳本（`node build.js`）；header / footer、卡片文字、歐萊德頁內容都在這裡 |
| `assets/` | 首頁素材 |
| `assets/pages/<頁面>/` | 各作品頁的區塊圖片 |
| `figma-exports/` | 從 Figma 匯出的原始檔（備份用） |

本機預覽：

```bash
npx --yes serve -l 5173 .
```

## 作品頁圖片來源

作品頁的內文在 Figma 裡是外框化的向量文字，所以網站用「每個 Frame 匯出一張圖」的方式呈現，圖片放在 `assets/pages/<頁面>/`，檔名對應 Figma 的 Frame（例如 `03-frame38.jpg` = 由上往下第 3 塊，Figma 裡叫 Frame 38）。

六頁的圖片都已是 Figma 逐 Frame 匯出的 JPG 2x。原始匯出檔放在 `figma-exports/`（網站不會讀取，git 也不追蹤），要更新某個區塊時，重新匯出後覆蓋 `assets/pages/<頁面>/` 裡的同名檔即可；缺檔時網頁會顯示虛線框並寫明要匯出哪個 Frame。

## 歐萊德頁的圖片排版

每一組截圖由 `build.js` 的 `gallery()` 自動排版：編譯時讀出每張 JPG 的真實長寬，算出每列的欄寬比例寫進 `--cols`。結果是同一列的圖等高、不裁切、整列填滿內容寬度；只有在一列會變太矮時才分成兩列（目前只有 LINE 客服那組六張圖）。要調整高度上下限改 `gallery()` 的 `minHeight` / `maxHeight`。

## 與 Figma 稿的差異

- 桌機（視窗寬 ≥1200px）整頁會依視窗寬度自動縮放（視窗寬 ÷ 1440），讓 1440 的稿永遠左右滿版、比例不變。邏輯在各頁底部的 inline script（原始碼在 `build.js`）；不想自動縮放就把那段 script 移除。

- 首頁作品區改成「資訊作品」「設計作品」兩張入口卡；原本的五張設計專案卡片移到 `design.html`。
- 首頁 Banner 是 Figma 匯出的平面圖，原本有粉紅／橘色色塊；目前用 CSS 混色（`.banner--home::after`，hue blend）把色塊轉成卡其色。若之後在 Figma 改好顏色重新匯出 `assets/banner-home.png`，把那段 CSS 刪掉即可。
- 卡片 hover 時底線變橘色並拉滿寬度，對應 Figma 元件的 hover 變體。
- 燈具頁 Banner 上的「介紹影片」按鈕在圖片裡，若要可點請提供影片連結。
