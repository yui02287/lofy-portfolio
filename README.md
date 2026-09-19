# IT's LOFY DESIGN — 作品集網站

由 Figma「LOFY's Design Portfolio」轉成的靜態網站，純 HTML / CSS，不需要任何框架。

## 檔案

| 檔案 | 說明 |
|---|---|
| `index.html` | 首頁（Banner、專長、About me、作品集卡片、Footer） |
| `uiux.html` | 行動雲科 UX 改良提案 |
| `vis.html` | 水牛安養中心 VIS 設計 |
| `lamp.html` | 化蛇 - 仿生燈具設計 |
| `others.html` | 其他作品 |
| `liuchongxi.html` | 六重溪部落 - 文創行銷計畫 |
| `css/style.css` | 全站樣式（含手機版） |
| `build.js` | 產生上面六個 HTML 的腳本（`node build.js`），共用 header / footer 改這裡 |
| `assets/` | 首頁素材 |
| `assets/pages/<頁面>/` | 各作品頁的區塊圖片 |

本機預覽：

```bash
npx --yes serve -l 5173 .
```

## 作品頁圖片來源

作品頁的內文在 Figma 裡是外框化的向量文字，所以網站用「每個 Frame 匯出一張圖」的方式呈現，圖片放在 `assets/pages/<頁面>/`，檔名對應 Figma 的 Frame（例如 `03-frame38.jpg` = 由上往下第 3 塊，Figma 裡叫 Frame 38）。

目前狀態：

| 頁面 | 來源 | 解析度 |
|---|---|---|
| vis、lamp | 你從 Figma 逐 Frame 匯出的 JPG 2x（`VIS/`、`蛇燈/` 資料夾） | 2x，清晰 |
| uiux 的 Banner、第 1 區塊 | Figma MCP 抓的 JPG 2x | 2x |
| uiux 其餘、others、liuchongxi | 從 `所有頁面/` 的整頁 1x 圖裁切 | 1x，Retina 螢幕上略糊 |

想讓 others、liuchongxi、uiux 更清晰，只要像 VIS 那樣逐 Frame 匯出 JPG 2x，用同樣檔名覆蓋即可（Frame 清單見 `build.js` 的 `PROJECTS`）。圖片缺檔時網頁會顯示虛線框並寫明要匯出哪個 Frame。

`VIS/`、`蛇燈/`、`所有頁面/` 三個資料夾是原始匯出檔，網站不會讀取它們，可自行保留或刪除。

## 與 Figma 稿的差異

- 首頁作品集多加了第五張「行動雲科 UX 改良提案」卡片（Figma 首頁只放四張，但卡片元件庫和 UIUX 頁都已做好）。不要的話把 `build.js` 裡最後一個 `card({...})` 刪掉再 `node build.js`。
- 卡片 hover 時底線變橘色並拉滿寬度，對應 Figma 元件的 hover 變體。
- 燈具頁 Banner 上的「介紹影片」按鈕在圖片裡，若要可點請提供影片連結。
