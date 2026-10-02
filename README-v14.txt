注音發聲板 v14－教育部官方注音發音完成版

基準：v12 教育部《國語辭典簡編本》候選字庫。
注音發音：使用使用者提供之教育部《國語注音符號手冊》 zh.epub：
OEBPS/bopomofo.mp3 + OEBPS/bopomofo.smil。

處理方式：
- 完全依 EPUB 內 SMIL 的 37 組 clipBegin/clipEnd 切割。
- 編號 01～37 依手冊標準注音順序對應 ㄅ～ㄦ。
- 37 個音檔均加入 Service Worker 快取，供 PWA 離線播放。
- 注音鍵不再呼叫 iPad/Safari TTS。
- 候選漢字、常用語、整句仍使用原本中文 TTS。
- v12 教育部候選字庫未更動。

GitHub 建議整包覆蓋，尤其必須新增 audio 資料夾及其中 37 個 MP3。
