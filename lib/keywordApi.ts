/**
 * Mock API layer for keyword management.
 * Each function simulates an async API call with a brief delay.
 *
 * Production endpoint pattern:
 *   GET    /api/keywords/config         → fetchKeywordConfig()
 *   POST   /api/keywords/categories     → createCategory()
 *   PUT    /api/keywords/categories/:id  → updateCategory()
 *   DELETE /api/keywords/categories/:id  → deleteCategory()
 *   POST   /api/keywords/rules          → createRule()
 *   PUT    /api/keywords/rules/:id       → updateRule()
 *   DELETE /api/keywords/rules/:id       → deleteRule()
 *   PUT    /api/keywords/risk-config     → updateRiskConfig()
 *   POST   /api/keywords/scan            → triggerFullScan()
 *
 * Sharetribe Integration API webhook:
 *   Event: message/created → server-side function runs keyword detection
 *   against the current config, flags conversation if hits detected.
 */

import type { KeywordConfig, KeywordCategoryConfig, KeywordRule, RiskConfig } from './types';
import { MOCK_KEYWORD_CONFIG } from './mockData';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export async function fetchKeywordConfig(): Promise<KeywordConfig> {
  await delay();
  // Production: return fetch('/api/keywords/config').then(r => r.json());
  return structuredClone(MOCK_KEYWORD_CONFIG);
}

export async function createCategory(
  cat: Omit<KeywordCategoryConfig, 'id' | 'createdAt' | 'updatedAt'>
): Promise<KeywordCategoryConfig> {
  await delay();
  // Production: return fetch('/api/keywords/categories', { method: 'POST', body: JSON.stringify(cat) }).then(r => r.json());
  const now = new Date().toISOString();
  return { ...cat, id: `cat_${Date.now()}`, createdAt: now, updatedAt: now };
}

export async function updateCategory(cat: KeywordCategoryConfig): Promise<KeywordCategoryConfig> {
  await delay();
  // Production: return fetch(`/api/keywords/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify(cat) }).then(r => r.json());
  return { ...cat, updatedAt: new Date().toISOString() };
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await delay();
  // Production: return fetch(`/api/keywords/categories/${categoryId}`, { method: 'DELETE' });
}

export async function createRule(
  rule: Omit<KeywordRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<KeywordRule> {
  await delay();
  // Production: return fetch('/api/keywords/rules', { method: 'POST', body: JSON.stringify(rule) }).then(r => r.json());
  const now = new Date().toISOString();
  return { ...rule, id: `kw_${Date.now()}`, createdAt: now, updatedAt: now };
}

export async function updateRule(rule: KeywordRule): Promise<KeywordRule> {
  await delay();
  // Production: return fetch(`/api/keywords/rules/${rule.id}`, { method: 'PUT', body: JSON.stringify(rule) }).then(r => r.json());
  return { ...rule, updatedAt: new Date().toISOString() };
}

export async function deleteRule(ruleId: string): Promise<void> {
  await delay();
  // Production: return fetch(`/api/keywords/rules/${ruleId}`, { method: 'DELETE' });
}

export async function updateRiskConfig(cfg: RiskConfig): Promise<RiskConfig> {
  await delay();
  // Production: return fetch('/api/keywords/risk-config', { method: 'PUT', body: JSON.stringify(cfg) }).then(r => r.json());
  return { ...cfg };
}

export async function triggerFullScan(): Promise<{ scanned: number; flagged: number }> {
  await delay(800);
  // Production: POST /api/keywords/scan → triggers server-side rescan of all conversations
  // against current keyword config. Returns count of scanned/newly-flagged.
  return { scanned: 80, flagged: 3 };
}
