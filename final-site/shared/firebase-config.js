// ============================================================
// Firebase 共通初期化ファイル
// 全ページ(player, staff, owner, board, 静的サイト)から
// <script type="module" src="../shared/firebase-config.js"></script>
// のように読み込んで使います。
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
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// あなたのプロジェクトの設定情報
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
const auth = getAuth(app);

// 他のファイルから import { db, auth, ... } できるようにエクスポート
export {
  db,
  auth,
  ref,
  get,
  onValue,
  set,
  update,
  push,
  runTransaction,
  serverTimestamp,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};

// ------------------------------------------------------------
// プレイヤー端末用: 匿名ログイン + roleの自己登録
// (staff/owner ページでは使いません)
// ------------------------------------------------------------
export function ensurePlayerAuth() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          const cred = await signInAnonymously(auth);
          user = cred.user;
        } catch (e) {
          reject(e);
          return;
        }
      }
      // role が未登録の場合のみ "player" として登録する
      try {
        const roleRef = ref(db, `roles/${user.uid}`);
        const snapshot = await get(roleRef);
        if (!snapshot.exists()) {
          await set(roleRef, "player");
        }
      } catch (e) {
        // ルールにより拒否される場合も想定されるが致命的ではないので進める
        console.warn("role registration skipped:", e.message);
      }
      resolve(user);
    });
  });
}
