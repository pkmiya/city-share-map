import { ExtendedInit, LiffMockApi } from '@line/liff-mock';

declare module '@line/liff' {
  interface Liff {
    $mock: LiffMockApi;
    init: ExtendedInit;
  }
}
export interface LiffProfile {
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  userId: string;
}
