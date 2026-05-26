// New API structure types based on backend refactor

export interface SubscriptionTier {
  name: string;
  price_sats: number;
  monthly_limit: string;
}

export interface SubscriptionTiersConfig {
  tiers: SubscriptionTier[];
}

export interface ReadAccessConfig {
  enabled: boolean;
  scope: "all_users" | "paid_users" | "allowed_users";
}

export interface WriteAccessConfig {
  enabled: boolean;
}

export interface AllowedUsersSettings {
  mode: "free" | "paid" | "exclusive";
  read_access: ReadAccessConfig;
  write_access: WriteAccessConfig;
  auto_add_repo_collaborators: boolean;
  tiers: SubscriptionTier[];
  last_updated: number;
}

export interface MediaDefinition {
  mime_patterns: string[];
  extensions: string[];
  max_size_mb: number;
}

export interface DynamicKindsConfig {
  enabled: boolean;
  allowed_kinds: number[];
}

export interface ProtocolsConfig {
  enabled: boolean;
  allowed_protocols: string[];
}

export interface EventFilteringConfig {
  allow_unregistered_kinds: boolean; // Controls whether unregistered kinds are accepted
  registered_kinds: number[]; // List of all kinds with specific handlers (read-only from frontend)
  moderation_mode: "basic" | "strict" | "full";
  kind_whitelist: string[];
  media_definitions: Record<string, MediaDefinition>;
  dynamic_kinds: DynamicKindsConfig;
  protocols: ProtocolsConfig;
}

export interface TextFilterConfig {
  enabled: boolean;
  cache_size: number;
  cache_ttl_seconds: number;
  full_text_search_kinds: number[];
}

export interface ImageModerationConfig {
  enabled: boolean;
  mode: string;
  threshold: number;
  timeout_seconds: number;
  check_interval_seconds: number;
  concurrency: number;
}

export interface ContentFilteringConfig {
  text_filter: TextFilterConfig;
  image_moderation: ImageModerationConfig;
}

export interface ServerConfig {
  port: number;
  host: string;
  private_key: string;
  demo_mode: boolean;
  web: boolean;
  proxy: boolean;
}

export interface ExternalServicesConfig {
  wallet: {
    wallet_api_key: string;
    wallet_name: string;
  };
  ollama: {
    ollama_url: string;
    ollama_model: string;
    ollama_timeout: number;
  };
  nest_feeder: {
    nest_feeder_enabled: boolean;
    nest_feeder_url: string;
    nest_feeder_timeout: number;
    nest_feeder_cache_size: number;
    nest_feeder_cache_ttl: number;
  };
  xnostr: {
    xnostr_enabled: boolean;
    xnostr_browser_path: string;
    xnostr_browser_pool_size: number;
    xnostr_check_interval: number;
    xnostr_concurrency: number;
    xnostr_temp_dir: string;
    xnostr_update_interval: number;
  };
}

export interface LoggingConfig {
  level: string;
  file_path: string;
}

export interface RelayConfig {
  relay_name: string;
  relay_description: string;
  relay_pubkey: string;
  relay_contact: string;
  relay_icon: string;
  relay_software: string;
  relay_version: string;
  relay_supported_nips: number[];
  relay_dht_key: string;
  service_tag: string;
  relay_stats_db: string;
}

export interface Settings {
  server: ServerConfig;
  external_services: ExternalServicesConfig;
  logging: LoggingConfig;
  relay: RelayConfig;
  content_filtering: ContentFilteringConfig;
  event_filtering: EventFilteringConfig;
  subscriptions: SubscriptionTiersConfig;
  allowed_users: AllowedUsersSettings;
}

export interface SettingsResponse {
  settings: Settings;
}

export interface SettingsUpdateRequest {
  settings: Partial<Settings>;
}

// File count response with dynamic media types
export interface FileCountResponse {
  kinds: number;
  [mediaType: string]: number; // Dynamic media types based on media_definitions
}

// Default settings for initialization
export const getDefaultSettings = (): Partial<Settings> => ({
  allowed_users: {
    mode: "free",
    read_access: { enabled: true, scope: "all_users" },
    write_access: { enabled: true },
    tiers: [],
    last_updated: Date.now()
  },
  subscriptions: {
    tiers: [
      { name: "Free", price_sats: 0, monthly_limit: "100 MB" },
      { name: "Basic", price_sats: 1000, monthly_limit: "1 GB" },
      { name: "Standard", price_sats: 10000, monthly_limit: "5 GB" },
      { name: "Premium", price_sats: 15000, monthly_limit: "10 GB" }
    ]
  },
  event_filtering: {
    allow_unregistered_kinds: false, // Default to strict mode (only registered kinds)
    registered_kinds: [], // Will be populated from backend
    moderation_mode: "strict",
    kind_whitelist: [],
    media_definitions: {
      image: {
        mime_patterns: ["image/*"],
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        max_size_mb: 100
      },
      video: {
        mime_patterns: ["video/*"],
        extensions: [".mp4", ".webm", ".avi", ".mov"],
        max_size_mb: 500
      },
      audio: {
        mime_patterns: ["audio/*"],
        extensions: [".mp3", ".wav", ".ogg", ".flac"],
        max_size_mb: 100
      },
      git: {
        mime_patterns: ["application/x-git"],
        extensions: [".git", ".bundle", ".json"],
        max_size_mb: 100
      }
    },
    dynamic_kinds: {
      enabled: false,
      allowed_kinds: []
    },
    protocols: {
      enabled: false,
      allowed_protocols: []
    }
  }
});