import { createHash, randomUUID } from "node:crypto";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface SafeLogContext {
  correlationId?: string;
  requestId?: string;
  userId?: string;
  branchId?: string;
  route?: string;
  method?: string;
  module?: string;
  [key: string]: unknown;
}

export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, unknown>;
}

export interface Logger {
  child(context: SafeLogContext): Logger;
  debug(message: string, context?: SafeLogContext): void;
  info(message: string, context?: SafeLogContext): void;
  warn(message: string, context?: SafeLogContext): void;
  error(message: string, context?: SafeLogContext): void;
}

const redactedValue = "[REDACTED]";
const sensitiveKeys = [
  "authorization",
  "bearer",
  "token",
  "secret",
  "password",
  "credential",
  "cookie",
  "session",
  "api[-_]?key",
  "card",
  "cvv",
  "iban",
  "routing",
  "account",
  "payment",
  "email",
  "phone",
  "address",
  "contact"
];
const sensitiveKeyPattern = new RegExp(`(${sensitiveKeys.join("|")})`, "i");

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function normalizeIdentifier(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return hashIdentifier(value.trim());
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (sensitiveKeyPattern.test(key)) {
    return redactedValue;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(key, item));
  }

  if (value && typeof value === "object") {
    return sanitizeContext(value as Record<string, unknown>);
  }

  return value;
}

export function createCorrelationId(): string {
  return randomUUID();
}

export function sanitizeContext(context: SafeLogContext | Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    if (key === "userId") {
      const userHash = normalizeIdentifier(value);
      if (userHash) {
        sanitized.userHash = userHash;
      }
      continue;
    }

    if (key === "branchId") {
      const branchHash = normalizeIdentifier(value);
      if (branchHash) {
        sanitized.branchHash = branchHash;
      }
      continue;
    }

    const safeValue = sanitizeValue(key, value);
    if (safeValue !== undefined) {
      sanitized[key] = safeValue;
    }
  }

  return sanitized;
}

export function createLogger(baseContext: SafeLogContext = {}): Logger {
  const safeBaseContext = sanitizeContext(baseContext);

  function write(level: LogLevel, message: string, context: SafeLogContext = {}) {
    const event: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        correlationId: safeBaseContext.correlationId ?? createCorrelationId(),
        ...safeBaseContext,
        ...sanitizeContext(context)
      }
    };

    const line = JSON.stringify(event);
    if (level === "error") {
      console.error(line);
      return;
    }

    if (level === "warn") {
      console.warn(line);
      return;
    }

    console.log(line);
  }

  return {
    child(context: SafeLogContext): Logger {
      return createLogger({
        ...safeBaseContext,
        ...sanitizeContext(context)
      });
    },
    debug(message: string, context?: SafeLogContext): void {
      write("debug", message, context);
    },
    info(message: string, context?: SafeLogContext): void {
      write("info", message, context);
    },
    warn(message: string, context?: SafeLogContext): void {
      write("warn", message, context);
    },
    error(message: string, context?: SafeLogContext): void {
      write("error", message, context);
    }
  };
}

export const logger = createLogger();
