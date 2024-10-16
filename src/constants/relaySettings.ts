export type Settings = {
  mode: string;
  protocol: string[];
  kinds: string[];
  dynamicKinds: string[];
  photos: string[];
  videos: string[];
  gitNestr: string[];
  audio: string[];
  appBuckets: string[];
  dynamicAppBuckets: string[];
  isKindsActive: boolean;
  isPhotosActive: boolean;
  isVideosActive: boolean;
  isGitNestrActive: boolean;
  isAudioActive: boolean;
  isFileStorageActive: boolean;
};

export type Category = 'kinds' | 'photos' | 'videos' | 'gitNestr' | 'audio' | 'dynamicKinds' | 'appBuckets' | 'dynamicAppBuckets';  
export const noteOptions = [
  { kind: 0, kindString: 'kind0', description: 'Metadata', category: 1 },
  { kind: 1, kindString: 'kind1', description: 'Text Note', category: 1 },
  { kind: 2, kindString: 'kind2', description: 'Recommend Relay', category: 1 },
  { kind: 3, kindString: 'kind3', description: 'Follow List', category: 1 },
  { kind: 5, kindString: 'kind5', description: 'Event Deletion', category: 1 },
  { kind: 6, kindString: 'kind6', description: 'Repost', category: 1 },
  { kind: 7, kindString: 'kind7', description: 'Reaction', category: 1 },
  { kind: 8, kindString: 'kind8', description: 'Badge Award', category: 2 },
  { kind: 16, kindString: 'kind16', description: 'Generic Repost', category: 1 },
  { kind: 10000, kindString: 'kind10000', description: 'Mute List', category: 1 },
  { kind: 10001, kindString: 'kind10001', description: 'Pinned Note(s)', category: 1 },
  { kind: 10002, kindString: 'kind10002', description: 'Tiny Relay List', category: 1 },
  { kind: 1984, kindString: 'kind1984', description: 'Reporting', category: 1 },
  { kind: 30000, kindString: 'kind30000', description: 'Custom Follow List', category: 1 },
  { kind: 30008, kindString: 'kind30008', description: 'Profile Badge', category: 2 },
  { kind: 30009, kindString: 'kind30009', description: 'Badge Definition', category: 2 },
  { kind: 30023, kindString: 'kind30023', description: 'Formatted Articles', category: 1 },
  { kind: 30079, kindString: 'kind30079', description: 'Event Paths', category: 1 },
  //{ kind: 9734, kindString: 'kind9734', description: 'Lightning Zap Request', category: 2 },
  { kind: 9735, kindString: 'kind9735', description: 'Zap Receipt', category: 2 },
  { kind: 10011, kindString: 'kind10011', description: 'Issue Notes', category: 3 },
  { kind: 10022, kindString: 'kind10022', description: 'PR Notes', category: 3 },
  { kind: 9803, kindString: 'kind9803', description: 'Commit Notes', category: 3 },
];
export const appBuckets = [
  { id: 'nostr', label: 'Nostr' },
  {
    id: 'gitnestr',
    label: 'GitNestr',
  },
  {
    id: 'NostrBox',
    label: 'NostrBox',
  },
];
export const categories = [
  { id: 1, name: 'Basic Nostr Features' },
  { id: 2, name: 'Extra Nostr Features' },
  { id: 3, name: 'GitNestr Features' },
];
