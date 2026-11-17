export interface AuditEvent {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  occurredAt: string;
}

export function createAuditEvent(event: Omit<AuditEvent, "occurredAt">): AuditEvent {
  return {
    ...event,
    occurredAt: new Date().toISOString()
  };
}
