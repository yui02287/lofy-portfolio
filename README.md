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

## 作品頁還缺的圖片

作品頁的內文在 Figma 裡是外框化的向量文字，所以網站用「每個 Frame 匯出一張圖」的方式呈現。
目前只有 `uiux` 的 Banner 和第一個區塊已匯出；其餘圖片還沒放進來時，網頁上會顯示一個虛線框，寫明要匯出哪個 Frame、存成哪個檔名。

匯出方式：在 Figma 選取該 Frame → 右側 Export → 格式 **JPG**、倍率 **2x** → 存成下面的檔名。

### uiux（畫框「UIUX」→ Desktop - 2）
- `assets/pages/uiux/02-frame41.jpg` ← Frame 41（事前調查）
- `assets/pages/uiux/03-frame42.jpg` ← Frame 42（功能改良選擇）
- `assets/pages/uiux/04-frame40.jpg` ← Frame 40（緊急求助改良）
- `assets/pages/uiux/05-frame43.jpg` ← Frame 43（成績查詢改良）
- `assets/pages/uiux/06-frame44.jpg` ← Frame 44（測試結果）
- `assets/pages/uiux/07-thanks.png` ← 圖層「1 4987979」（Thank for Watching 旁的手機圖，PNG 2x）

### vis（畫框「VIS」）
- `banner.jpg` ← Banner
- `01-frame47.jpg`、`02-frame46.jpg`、`03-frame38.jpg`、`04-frame39.jpg`、`05-frame44.jpg`、`06-frame45.jpg`、`07-frame40.jpg`、`08-frame43.jpg`、`09-frame42.jpg`、`10-frame41.jpg` ← 依畫面由上到下的 Frame 47、46、38、39、44、45、40、43、42、41

### lamp（畫框「燈」）
- `banner.jpg` ← Banner
- `01-frame47.jpg`、`02-frame39.jpg`、`03-frame46.jpg`、`04-frame38.jpg`、`05-frame49.jpg`、`06-frame48.jpg`、`07-frame50.jpg`、`08-frame51.jpg` ← Frame 47、39、46、38、49、48、50、51

### others（畫框「其他」）
- `banner.jpg` ← Banner
- `01-frame39.jpg`、`02-frame46.jpg`、`03-post2.jpg`（圖層「貼文2 1」）、`04-frame47.jpg`、`05-frame48.jpg`

### liuchongxi（畫框「六重溪」）
- `banner.jpg` ← Banner
- `01-frame43.jpg`、`02-frame38.jpg`、`03-frame39.jpg`、`04-frame40.jpg`、`05-frame41.jpg`、`06-frame42.jpg`

圖片放進對應資料夾後重新整理網頁即可，不用改程式。

## 與 Figma 稿的差異

- 首頁作品集多加了第五張「行動雲科 UX 改良提案」卡片（Figma 首頁只放四張，但卡片元件庫和 UIUX 頁都已做好）。不要的話把 `build.js` 裡最後一個 `card({...})` 刪掉再 `node build.js`。
- 卡片 hover 時底線變橘色並拉滿寬度，對應 Figma 元件的 hover 變體。
- 燈具頁 Banner 上的「介紹影片」按鈕在圖片裡，若要可點請提供影片連結。
