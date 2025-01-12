// c.f. https://docs.mapbox.com/api/maps/styles/

export type MapboxStyle = {
  description: string;
  name: string;
  value: string;
};

export const MapboxStyles = [
  {
    description: 'ライト',
    name: 'light',
    value: 'mapbox://styles/mapbox/light-v10',
  },
  {
    description: 'ダーク',
    name: 'dark',
    value: 'mapbox://styles/mapbox/dark-v10',
  },
  {
    description: '衛星写真',
    name: 'satellite',
    value: 'mapbox://styles/mapbox/satellite-v9',
  },
  {
    description: 'ストリート',
    name: 'streets',
    value: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    description: 'アウトドア',
    name: 'outdoors',
    value: 'mapbox://styles/mapbox/outdoors-v11',
  },
  {
    description: '交通情報(昼)',
    name: 'trafficDay',
    value: 'mapbox://styles/mapbox/traffic-day-v2',
  },
  {
    description: '交通情報(夜)',
    name: 'trafficNight',
    value: 'mapbox://styles/mapbox/traffic-night-v2',
  },
  {
    description: 'ナビゲーションプレビュー(昼)',
    name: 'navigationPreviewDay',
    value: 'mapbox://styles/mapbox/navigation-preview-day-v4',
  },
  {
    description: 'ナビゲーションプレビュー(夜)',
    name: 'navigationPreviewNight',
    value: 'mapbox://styles/mapbox/navigation-preview-night-v4',
  },
  {
    description: 'ナビゲーションガイダンス(昼)',
    name: 'navigationGuidanceDay',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
  },
  {
    description: 'ナビゲーションガイダンス(夜)',
    name: 'navigationGuidanceNight',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4',
  },
];
