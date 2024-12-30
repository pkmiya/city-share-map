// NOTE: 2024-12-30　投稿取得用APIのリファクタリング提案用

// ------------------------------
// v2
// ------------------------------
// 0-1. 投稿の基本情報
export type postSummary = {
  // 対象ロール：自治体職員、市民
  // 対象画面：投稿一覧画面、可視化マップ画面
  id: string;
  isSolved: boolean;
  user: {
    userId: string;
    userName: string;
  };
  problem: {
    problemId: string;
    problemName: string;
  };
  coordinate: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;

  // 対象ロール：自治体職員
  // 対象画面：投稿一覧画面、可視化マップ画面
  isOpen?: boolean;
  deletedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;

  // 対象ロール：自治体職員、市民
  // 対象画面：可視化マップ画面
  photoField?: {
    // 写真のカスタム項目が存在して、うち1件以上の写真が登録されていた場合、うち1件の項目名と写真データを返す
    itemName: string;
    value: string;
  };
  description?: {
    // テキストのカスタム項目が存在して、うち1件以上のテキストが登録されていた場合、うち1件の項目名とテキストデータを返す
    itemName: string;
    value: string;
  };
};

// 0-2. 投稿の追加情報＝カスタム項目
// 対象ロール：自治体職員、市民
// 対象画面：投稿詳細画面
export type customField = {
  [key: string]: number | string | boolean | Date; // 一旦この4種類。stringはテキストと写真を含む
  //   [key: string]: any; // anyにしようとしたけど、オブジェクトや配列も許容してしまい、柔軟すぎて型安全性が下がるのでやめたい
};

// 1. 投稿一覧取得API
// 対象ロール：自治体職員と市民
// 対象画面：投稿一覧画面、可視化マップ画面
export type getListOfPostsResponse = postSummary[];

// 2. 投稿詳細取得API
// 対象ロール：自治体職員と市民
// 対象画面：投稿詳細画面
export type getPostDetailResponse = postSummary & customField;
