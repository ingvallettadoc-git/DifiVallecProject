// ── Alert Domain Model ────────────────────────────────────────

import { AlertCategory, Confidence, Severity } from './enums';

export interface AlertItem {
  id: string;
  timestamp: string;
  category: AlertCategory;
  severity: Severity;
  confidence: Confidence;
  title: string;
  description: string;
  eventId?: string;
  bookmakerKey?: string;
  metadata?: Record<string, string | number>;
}
