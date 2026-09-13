// ============================================================
// Firebase 共通初期化ファイル(簡略版・認証なし)
// 全ページから <script type="module" src="../shared/firebase-config.js"></script>
// のように読み込んで使います。
//
// 変更点: Firebase Authentication は使用しません。
// アクセス制御は staff-links の合言葉ゲートのみで行います。
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
  set,
  update,
  push,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwTbMBVw90GbVpApee0OxwWSKcQ7__kl8",
  authDomain: "shinsoku-geigeki.firebaseapp.com",
  databaseURL: "https://shinsoku-geigeki-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shinsoku-geigeki",
  storageBucket: "shinsoku-geigeki.firebasestorage.app",
  messagingSenderId: "928960912138",
  appId: "1:928960912138:web:8926a0993ddd2f98c538f3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
  db,
  ref,
  get,
  onValue,
  set,
  update,
  push,
  runTransaction,
  serverTimestamp
};

// ------------------------------------------------------------
// スタッフ用ページ共通: staff-links の合言葉ゲートを通過しているか確認する
// 通過していなければ staff-links にリダイレクトする
// (完全なセキュリティ機構ではなく、直接URLを開かれた際の簡易的な抑止です)
// ------------------------------------------------------------
export function requireStaffGate(redirectPath = "../staff-links/index.html") {
  if (sessionStorage.getItem("staffLinksUnlocked") !== "1") {
    window.location.href = redirectPath;
  }
}
