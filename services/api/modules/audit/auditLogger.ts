import { type QueryableDatabase } from "../../db/client";
import { auditWriteFailed } from "../../shared/errors";

export type AuditOutcome = "allowed" | "denied";

export interface AuditEventInput {
  actorUserId?: string;
  branchId?: string;
  action: string;
  targetType: string;
  targetId: string;
  authorizationOutcome?: AuditOutcome;
  metadata?: Record<string, unknown>;
  requestId?: string;
}

export interface AuditEvent extends AuditEventInput {
  occurredAt: string;
}

export interface AuditLogger {
  record(event: AuditEventInput): Promise<AuditEvent>;
}

function createEvent(input: AuditEventInput): AuditEvent {
  return {
    ...input,
    metadata: input.metadata ?? {},
    occurredAt: new Date().toISOString()
  };
}

export function createAuditLogger(database?: QueryableDatabase): AuditLogger {
  return {
    async record(input: AuditEventInput): Promise<AuditEvent> {
      const event = createEvent(input);

      if (!database) {
        return event;
      }

      try {
        await database.query(
          `INSERT INTO audit_logs (
            occurred_at,
            actor_user_id,
            branch_id,
            action,
            target_type,
            target_id,
            authorization_outcome,
            metadata,
            request_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)`,
          [
            event.occurredAt,
            event.actorUserId ?? null,
            event.branchId ?? null,
            event.action,
            event.targetType,
            event.targetId,
            event.authorizationOutcome ?? null,
            JSON.stringify(event.metadata ?? {}),
            event.requestId ?? null
          ]
        );
      } catch {
        throw auditWriteFailed();
      }

      return event;
    }
  };
}

export async function recordAuditEvent(
  logger: AuditLogger,
  event: AuditEventInput
): Promise<AuditEvent> {
  return logger.record(event);
}
