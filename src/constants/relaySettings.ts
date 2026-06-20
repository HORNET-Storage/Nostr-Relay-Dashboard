export type Settings = {
  // Event filtering settings
  allowUnregisteredKinds: boolean;  // Controls whether unregistered kinds are accepted
  registeredKinds: number[];         // List of all kinds with specific handlers (from backend)
  protocol: string[];
  kinds: string[];
  dynamicKinds: string[];
  photos: string[];
  videos: string[];
  nosis: string[];
  audio: string[];
  isKindsActive: boolean;
  isPhotosActive: boolean;
  isVideosActive: boolean;
  isNosisActive: boolean;
  isAudioActive: boolean;
  isFileStorageActive: boolean;
  moderationMode: string;    // "strict" or "passive"
  // File size limits in MB
  photoMaxSizeMB: number;
  videoMaxSizeMB: number;
  audioMaxSizeMB: number;
}

export type Category = 'kinds' | 'photos' | 'videos' | 'nosis' | 'audio' | 'dynamicKinds' | 'photoMaxSizeMB' | 'videoMaxSizeMB' | 'audioMaxSizeMB';  
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
  { kind: 1060, kindString: 'kind1060', description: 'Double Ratchet DM', category: 1 },
  { kind: 1063, kindString: 'kind1063', description: 'File Metadata', category: 1 },
  { kind: 1808, kindString: 'kind1808', description: 'Audio Transcription', category: 1 },
  { kind: 1809, kindString: 'kind1809', description: 'Audio Transcription Repost', category: 1 },
  { kind: 1984, kindString: 'kind1984', description: 'Reporting', category: 1 },
  { kind: 30000, kindString: 'kind30000', description: 'Custom Follow List', category: 1 },
  { kind: 30008, kindString: 'kind30008', description: 'Profile Badge', category: 2 },
  { kind: 30009, kindString: 'kind30009', description: 'Badge Definition', category: 2 },
  { kind: 30023, kindString: 'kind30023', description: 'Formatted Articles', category: 1 },
  { kind: 30078, kindString: 'kind30078', description: 'Application-specific Data', category: 1 },
  { kind: 30079, kindString: 'kind30079', description: 'Event Paths', category: 1 },
  //{ kind: 9734, kindString: 'kind9734', description: 'Lightning Zap Request', category: 2 },
  { kind: 9735, kindString: 'kind9735', description: 'Zap Receipt', category: 2 },
  { kind: 10011, kindString: 'kind10011', description: 'Issue Notes', category: 3 },
  { kind: 10022, kindString: 'kind10022', description: 'PR Notes', category: 3 },
  { kind: 9803, kindString: 'kind9803', description: 'Commit Notes', category: 3 },
  // Core kinds essential for relay operation
  { kind: 10010, kindString: 'kind10010', description: 'Content Filtering', category: 1 },
  { kind: 22242, kindString: 'kind22242', description: 'NIP-42 Auth Events', category: 1 },
  { kind: 117, kindString: 'kind117', description: 'Blossom File Metadata', category: 1 },
  { kind: 19841, kindString: 'kind19841', description: 'Storage Manifest', category: 1 },
  { kind: 19842, kindString: 'kind19842', description: 'Storage Metadata', category: 1 },
  { kind: 19843, kindString: 'kind19843', description: 'Storage Delete', category: 1 },
];
export const categories = [
  { id: 1, name: 'Basic Nostr Features' },
  { id: 2, name: 'Extra Nostr Features' },
  { id: 3, name: 'Nosis Features' },
];

interface FormatOption {
  label: React.ReactNode;
  value: string;
}

export const mimeTypeOptions: FormatOption[] = [
  // Images
  { value: 'image/jpeg', label: 'JPEG Images' },
  { value: 'image/png', label: 'PNG Images' },
  { value: 'image/gif', label: 'GIF Images' },
  { value: 'image/bmp', label: 'BMP Images' },
  { value: 'image/tiff', label: 'TIFF Images' },
  { value: 'image/raw', label: 'RAW Images' },
  { value: 'image/svg+xml', label: 'SVG Images' },
  { value: 'image/webp', label: 'WebP Images' },
  { value: 'application/pdf', label: 'PDF Documents' },
  { value: 'image/eps', label: 'EPS Images' },
  { value: 'image/vnd.adobe.photoshop', label: 'PSD Images' },
  { value: 'application/postscript', label: 'AI/PS Images' },

  // Videos
  { value: 'video/avi', label: 'AVI Videos' },
  { value: 'video/mp4', label: 'MP4 Videos' },
  { value: 'video/mov', label: 'MOV Videos' },
  { value: 'video/wmv', label: 'WMV Videos' },
  { value: 'video/mkv', label: 'MKV Videos' },
  { value: 'video/flv', label: 'FLV Videos' },
  { value: 'video/mpeg', label: 'MPEG Videos' },
  { value: 'video/3gpp', label: '3GP Videos' },
  { value: 'video/webm', label: 'WebM Videos' },
  { value: 'video/ogg', label: 'OGG Videos' },

  // Audio
  { value: 'audio/mpeg', label: 'MP3 Audio' },
  { value: 'audio/wav', label: 'WAV Audio' },
  { value: 'audio/ogg', label: 'OGG Audio' },
  { value: 'audio/flac', label: 'FLAC Audio' },
  { value: 'audio/aac', label: 'AAC Audio' },
  { value: 'audio/x-ms-wma', label: 'WMA Audio' },
  { value: 'audio/mp4', label: 'M4A Audio' },
  { value: 'audio/opus', label: 'Opus Audio' },
  { value: 'audio/m4b', label: 'M4B Audiobooks' },
  { value: 'audio/midi', label: 'MIDI Audio' },
];

