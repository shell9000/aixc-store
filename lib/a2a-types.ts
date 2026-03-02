// A2A Protocol Types (Google A2A Standard)
// Based on: https://a2a-protocol.org/latest/specification/

// ============================================================================
// Agent Card (Discovery)
// ============================================================================

export interface AgentCard {
  // Identity
  id: string;
  name: string;
  description?: string;
  version: string;
  
  // Service Endpoint
  serviceUrl: string;
  
  // Capabilities
  capabilities: {
    streaming?: boolean;
    pushNotifications?: boolean;
    extendedAgentCard?: boolean;
  };
  
  // Skills (what the agent can do)
  skills?: Skill[];
  
  // Security
  securitySchemes?: Record<string, SecurityScheme>;
  security?: SecurityRequirement[];
  
  // Extensions
  extensions?: Extension[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  inputModes?: string[]; // e.g., ["text/plain", "application/json"]
  outputModes?: string[]; // e.g., ["text/plain", "image/png"]
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2';
  scheme?: string; // e.g., "bearer"
  in?: 'header' | 'query' | 'cookie';
  name?: string; // parameter name
}

export interface SecurityRequirement {
  [schemeName: string]: string[];
}

export interface Extension {
  uri: string;
  required?: boolean;
}

// ============================================================================
// Task & Message
// ============================================================================

export interface Task {
  id: string;
  contextId?: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  history?: Message[];
  artifacts?: Artifact[];
  metadata?: Record<string, any>;
}

export type TaskStatus = 
  | 'working'
  | 'input_required'
  | 'auth_required'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'rejected';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  parts: Part[];
  contextId?: string;
  taskId?: string;
  referenceTaskIds?: string[];
  metadata?: Record<string, any>;
}

export interface Part {
  type: 'text' | 'file' | 'data';
  text?: string;
  file?: FileReference;
  data?: any;
  mimeType?: string;
}

export interface FileReference {
  url: string;
  name?: string;
  mimeType?: string;
  size?: number;
}

export interface Artifact {
  id: string;
  name?: string;
  parts: Part[];
  createdAt: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// JSON-RPC 2.0
// ============================================================================

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any;
  id: string | number;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: JsonRpcError;
  id: string | number | null;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

// Standard JSON-RPC error codes
export const JsonRpcErrorCode = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

// A2A-specific error codes (custom range: -32000 to -32099)
export const A2AErrorCode = {
  TASK_NOT_FOUND: -32001,
  TASK_NOT_CANCELABLE: -32002,
  PUSH_NOTIFICATION_NOT_SUPPORTED: -32003,
  UNSUPPORTED_OPERATION: -32004,
  CONTENT_TYPE_NOT_SUPPORTED: -32005,
  INVALID_AGENT_RESPONSE: -32006,
  EXTENDED_AGENT_CARD_NOT_CONFIGURED: -32007,
  EXTENSION_SUPPORT_REQUIRED: -32008,
  VERSION_NOT_SUPPORTED: -32009,
} as const;

// ============================================================================
// A2A Methods
// ============================================================================

// message/send
export interface SendMessageRequest {
  message: Message;
  configuration?: SendMessageConfiguration;
  metadata?: Record<string, any>;
}

export interface SendMessageConfiguration {
  acceptedOutputModes?: string[];
  pushNotificationConfig?: PushNotificationConfig;
  historyLength?: number;
  blocking?: boolean;
}

export interface PushNotificationConfig {
  webhookUrl: string;
  events?: ('status' | 'artifact')[];
}

// task/get
export interface GetTaskRequest {
  id: string;
  historyLength?: number;
}

// task/list
export interface ListTasksRequest {
  contextId?: string;
  status?: TaskStatus;
  pageSize?: number;
  pageToken?: string;
  historyLength?: number;
  includeArtifacts?: boolean;
}

export interface ListTasksResponse {
  tasks: Task[];
  nextPageToken: string;
  pageSize: number;
  totalSize: number;
}

// task/cancel
export interface CancelTaskRequest {
  id: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// Streaming Events
// ============================================================================

export interface TaskStatusUpdateEvent {
  taskId: string;
  status: TaskStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TaskArtifactUpdateEvent {
  taskId: string;
  artifact: Artifact;
  timestamp: string;
}

export type StreamEvent = 
  | { type: 'task'; data: Task }
  | { type: 'message'; data: Message }
  | { type: 'statusUpdate'; data: TaskStatusUpdateEvent }
  | { type: 'artifactUpdate'; data: TaskArtifactUpdateEvent };
