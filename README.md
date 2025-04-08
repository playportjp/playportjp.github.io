# PlayPortJP - ECサイトプロジェクト

## プロジェクト概要
* コンセプト: シンプル化したAmazon風ECサイト
* 実装方法: HTML/CSS/JavaScript（フレームワークなし）

## ファイル構成
* index.html（ホームページ）
* style.css（メインスタイルシート）
* search-results.html（検索結果ページ）
* product-detail.html（商品詳細ページ）
* cart.html（ショッピングカートページ）
* components/
  * header.html（ヘッダーコンポーネント）
  * footer.html（フッターコンポーネント）
* js/
  * common.js（共通JavaScript）
  * index.js（ホームページ用JavaScript）

## 開発アプローチ
1. **コンポーネント指向**: 再利用可能なヘッダー・フッターを作成
2. **グローバルCSSの確立**: 一貫したデザインのための共通スタイル
3. **段階的実装**: 各ページを順次開発

## 開発優先順位
1. ホームページ（index.html）
2. 商品一覧・検索結果ページ
3. 商品詳細ページ
4. カートページ
