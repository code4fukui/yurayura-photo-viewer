# yurayura-photo-viewer

Three.jsを使用して、優しくゆらぐ「ユラユラ」効果で写真を表示するWebコンポーネントです。画像は頂点アニメーションを持つ3D平面としてレンダリングされ、旗がはためくようなダイナミックな動きを生み出します。組み込みが簡単になるよう設計されており、AR環境もサポートしています。

## デモ

- [ライブデモ](https://code4fukui.github.io/yurayura-photo-viewer/)

## 機能

- **波打つアニメーション**: 静止画をダイナミックに波打つ動きで表示します。
- **Webコンポーネント**: シンプルで再利用可能な `<yurayura-photo-viewer>` 要素としてパッケージ化されています。
- **動的データ**: CSVファイルなどの外部ソースから画像データを簡単に読み込むことができます。
- **連続サイクル**: 写真のコレクションを垂直方向に連続してループ表示します。
- **メタデータコールバック**: 現在フォーカスされている写真を追跡するための `onchange` コールバックを提供します。
- **AR対応**: AR互換のシーンとカメラのセットアップが含まれています。

## 使い方

1. **HTMLにコンポーネントを追加します。**

    ```html
    <!-- ビューアーのコンテナを設定 -->
    <div id="viewer-container" style="width: 100vw; height: 100vh;"></div>

    <!-- 写真情報を表示する要素 -->
    <div id="photo-info"></div>
    ```

2. **JavaScriptモジュールでコンポーネントをインポートし、初期化します。**

    ```javascript
    import { YurayuraPhotoViewer } from "./yurayura-photo-viewer.js";
    import { CSV } from "https://js.sabae.cc/CSV.js";

    // 1. コンポーネントを作成して追加
    const viewer = new YurayuraPhotoViewer();
    document.getElementById("viewer-container").appendChild(viewer);

    // 2. ビューアーの設定
    viewer.setAttribute("duration", "6000"); // 6秒ごとに切り替える

    // 3. アクティブな写真の情報を表示するコールバックを設定
    const infoDiv = document.getElementById("photo-info");
    viewer.onchange = (photoData) => {
      console.log("現在の写真:", photoData);
      infoDiv.innerHTML = `
        <a href="${photoData.url}">
          ${photoData.title} by ${photoData.author}
        </a>
      `;
    };

    // 4. 画像データを読み込んでビューアーに割り当て
    async function loadImages() {
      const imageList = await CSV.fetchJSON("https://code4fukui.github.io/find47/find47images.csv");
      
      const images = imageList.slice(0, 100).map(d => ({
        file: `~~https://code4fukui.github.io/find47/photo/${d.id}.jpg`~~ *(unavailable)*,
        width: 960,  // アスペクト比計算用の元画像の幅
        height: 540, // 元画像の高さ
        data: d      // onchangeコールバック用に元のメタデータを渡す
      }));

      viewer.value = images;
    }

    loadImages();
    ```

## API: `<yurayura-photo-viewer>`

### プロパティ

- **`.value = [imageObjects]`**
  表示する写真を設定します。`imageObjects` は、各オブジェクトが以下のキーを持つ配列である必要があります。
  - `file` (string): 画像ファイルのURL。
  - `width` (number): 正しいアスペクト比を計算するための元画像の幅。
  - `height` (number): 元画像の高さ。
  - `data` (any, オプション): 関連するメタデータ（例: 元のCSVの行データなど）。
