export enum ItemTypeName {
  Text = 'テキスト',
  Photo = '写真',
  DateTime = '日時',
  Number = '数値',
  Boolean = '真偽値',
}

export const ItemType = [
  { id: 1, name: ItemTypeName.Text },
  { id: 2, name: ItemTypeName.Photo },
  { id: 3, name: ItemTypeName.DateTime },
  { id: 4, name: ItemTypeName.Number },
  { id: 5, name: ItemTypeName.Boolean },
];
