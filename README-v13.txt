注音發聲板 v13－iPad 注音發音修正版

基準：v12 教育部官方字音資料版（候選字庫未更動）

修正：
1. 不再直接把 ㄅ、ㄆ、ㄇ… Unicode 注音符號交給 iPad Safari TTS。
2. 37 個注音符號各自使用國語示範中文字作為 TTS 發音代理。
3. 畫面顯示、組音、教育部候選字庫完全維持注音符號，不受代理字影響。
4. 聲調鍵固定朗讀：一聲、二聲、三聲、四聲、輕聲。
5. 候選漢字、常用語、整句仍使用 zh-TW TTS。

GitHub 請覆蓋：
index.html
app.js
sw.js
zhuyin-dictionary.js

更新 iPad PWA 後若仍載入舊版，先關閉 App，再重新開啟；必要時移除主畫面舊 PWA 後重新加入。
