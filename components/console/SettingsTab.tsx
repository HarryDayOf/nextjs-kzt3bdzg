/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Btn, CopyBtn, NAVY } from './ui';
import { mkC, type Role, type KeywordConfig, type KeywordCategoryConfig, type KeywordRule, type RiskConfig } from '../../lib/types';
import { createRule, updateRule, deleteRule, createCategory, updateCategory, deleteCategory, updateRiskConfig, triggerFullScan } from '../../lib/keywordApi';

interface SettingsTabProps {
  kwConfig: KeywordConfig;
  onUpdateKwConfig: (config: KeywordConfig) => void;
  darkMode: boolean;
  currentRole: Role;
  toast: (msg: string) => void;
  addAudit: (action: string, entity_type: string, entity_id: string, entity_label: string, detail: string) => void;
  user: any;
}

export function SettingsTab({ kwConfig, onUpdateKwConfig, darkMode, currentRole, toast, addAudit }: SettingsTabProps) {
  const C = mkC(darkMode);
  const isAdmin = currentRole === 'admin';
  const [section, setSection] = useState<'rules' | 'categories' | 'risk' | 'autoscan'>('rules');

  // ─── Rule add/edit state ────────────────────────────────────────────────────
  const [showAddRule, setShowAddRule] = useState(false);
  const [editRuleId, setEditRuleId] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState({ categoryId: kwConfig.categories[0]?.id ?? '', pattern: '', type: 'exact' as 'exact' | 'regex', description: '' });
  const [regexTest, setRegexTest] = useState('');
  const [regexError, setRegexError] = useState('');

  // ─── Category add/edit state ────────────────────────────────────────────────
  const [showAddCat, setShowAddCat] = useState(false);
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ label: '', color: '#c62828', bg: '#fdecea', description: '', weight: 18 });

  // ─── Risk config state ─────────────────────────────────────────────────────
  const [riskForm, setRiskForm] = useState<RiskConfig>({ ...kwConfig.riskConfig });

  // ─── Scan state ────────────────────────────────────────────────────────────
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ scanned: number; flagged: number } | null>(null);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const now = () => new Date().toISOString();

  const validateRegex = (pattern: string) => {
    if (!pattern) { setRegexError(''); return true; }
    try { new RegExp(pattern, 'gi'); setRegexError(''); return true; }
    catch (e: any) { setRegexError(e.message || 'Invalid regex'); return false; }
  };

  const getRegexMatches = (pattern: string, text: string): string[] => {
    if (!pattern || !text) return [];
    try {
      const re = new RegExp(pattern, 'gi');
      const matches: string[] = [];
      let m;
      while ((m = re.exec(text)) !== null) { matches.push(m[0]); if (!m[0].length) break; }
      return matches;
    } catch { return []; }
  };

  // ─── Rule CRUD ─────────────────────────────────────────────────────────────
  const handleSaveRule = async () => {
    if (!ruleForm.pattern.trim()) return;
    if (ruleForm.type === 'regex' && !validateRegex(ruleForm.pattern)) return;

    if (editRuleId) {
      const existing = kwConfig.rules.find(r => r.id === editRuleId);
      if (!existing) return;
      const updated = await updateRule({ ...existing, ...ruleForm, updatedAt: now() });
      onUpdateKwConfig({ ...kwConfig, rules: kwConfig.rules.map(r => r.id === editRuleId ? updated : r), lastUpdated: now() });
      addAudit('Updated keyword rule', 'keyword_config', updated.id, updated.pattern, `Type: ${updated.type}, Category: ${updated.categoryId}`);
      toast('Keyword rule updated.');
    } else {
      const created = await createRule({ ...ruleForm, enabled: true });
      onUpdateKwConfig({ ...kwConfig, rules: [...kwConfig.rules, created], lastUpdated: now() });
      addAudit('Added keyword rule', 'keyword_config', created.id, created.pattern, `Type: ${created.type}, Category: ${created.categoryId}`);
      toast('Keyword rule added.');
    }
    setShowAddRule(false);
    setEditRuleId(null);
    setRuleForm({ categoryId: kwConfig.categories[0]?.id ?? '', pattern: '', type: 'exact', description: '' });
    setRegexTest('');
  };

  const handleDeleteRule = async (rule: KeywordRule) => {
    await deleteRule(rule.id);
    onUpdateKwConfig({ ...kwConfig, rules: kwConfig.rules.filter(r => r.id !== rule.id), lastUpdated: now() });
    addAudit('Deleted keyword rule', 'keyword_config', rule.id, rule.pattern, `Removed from category: ${rule.categoryId}`);
    toast('Keyword rule deleted.');
  };

  const handleToggleRule = async (rule: KeywordRule) => {
    const updated = await updateRule({ ...rule, enabled: !rule.enabled, updatedAt: now() });
    onUpdateKwConfig({ ...kwConfig, rules: kwConfig.rules.map(r => r.id === rule.id ? updated : r), lastUpdated: now() });
  };

  // ─── Category CRUD ─────────────────────────────────────────────────────────
  const handleSaveCat = async () => {
    if (!catForm.label.trim()) return;
    if (editCatId) {
      const existing = kwConfig.categories.find(c => c.id === editCatId);
      if (!existing) return;
      const updated = await updateCategory({ ...existing, ...catForm, updatedAt: now() });
      onUpdateKwConfig({ ...kwConfig, categories: kwConfig.categories.map(c => c.id === editCatId ? updated : c), lastUpdated: now() });
      addAudit('Updated keyword category', 'keyword_config', updated.id, updated.label, `Weight: ${updated.weight}`);
      toast('Category updated.');
    } else {
      const created = await createCategory({ ...catForm, enabled: true });
      onUpdateKwConfig({ ...kwConfig, categories: [...kwConfig.categories, created], lastUpdated: now() });
      addAudit('Added keyword category', 'keyword_config', created.id, created.label, `Weight: ${created.weight}`);
      toast('Category added.');
    }
    setShowAddCat(false);
    setEditCatId(null);
    setCatForm({ label: '', color: '#c62828', bg: '#fdecea', description: '', weight: 18 });
  };

  const handleDeleteCat = async (cat: KeywordCategoryConfig) => {
    const ruleCount = kwConfig.rules.filter(r => r.categoryId === cat.id).length;
    if (ruleCount > 0 && !confirm(`This will also remove ${ruleCount} keyword rule${ruleCount > 1 ? 's' : ''} in this category. Continue?`)) return;
    await deleteCategory(cat.id);
    onUpdateKwConfig({ ...kwConfig, categories: kwConfig.categories.filter(c => c.id !== cat.id), rules: kwConfig.rules.filter(r => r.categoryId !== cat.id), lastUpdated: now() });
    addAudit('Deleted keyword category', 'keyword_config', cat.id, cat.label, `Removed with ${ruleCount} rules`);
    toast('Category deleted.');
  };

  const handleToggleCat = async (cat: KeywordCategoryConfig) => {
    const updated = await updateCategory({ ...cat, enabled: !cat.enabled, updatedAt: now() });
    onUpdateKwConfig({ ...kwConfig, categories: kwConfig.categories.map(c => c.id === cat.id ? updated : c), lastUpdated: now() });
  };

  // ─── Risk config save ─────────────────────────────────────────────────────
  const handleSaveRisk = async () => {
    const updated = await updateRiskConfig(riskForm);
    onUpdateKwConfig({ ...kwConfig, riskConfig: updated, lastUpdated: now() });
    addAudit('Updated risk config', 'keyword_config', 'risk_config', 'Risk Configuration', `High: ${updated.highThreshold}, Medium: ${updated.mediumThreshold}, Bonus: ${updated.flaggedBonus}`);
    toast('Risk configuration saved.');
  };

  // ─── Scan ─────────────────────────────────────────────────────────────────
  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    const result = await triggerFullScan();
    setScanResult(result);
    setScanning(false);
    toast(`Re-scan complete: ${result.scanned} conversations scanned, ${result.flagged} newly flagged.`);
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const sideBtn = (id: string, label: string, icon: string) => (
    <button key={id} onClick={() => setSection(id as any)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: section === id ? 600 : 400, color: section === id ? (darkMode ? '#e2e8f0' : NAVY) : C.textMuted, backgroundColor: section === id ? (darkMode ? '#334155' : '#f3f4f6') : 'transparent', width: '100%', textAlign: 'left' }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>{label}
    </button>
  );

  const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid ' + C.inputBorder, borderRadius: '8px', fontSize: '13px', color: C.text, backgroundColor: C.inputBg, outline: 'none', width: '100%', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: '11px', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' };
  const cardStyle: React.CSSProperties = { backgroundColor: C.surfaceAlt, border: '1px solid ' + C.borderLight, borderRadius: '8px', padding: '14px 16px', marginBottom: '8px' };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ backgroundColor: C.surface, borderRadius: '10px', border: '1px solid ' + C.border, boxShadow: darkMode ? 'none' : '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', minHeight: '600px' }}>

        {/* SIDEBAR */}
        <div style={{ width: '200px', borderRight: '1px solid ' + C.border, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 14px 12px', borderBottom: '1px solid ' + C.borderLight, marginBottom: '8px' }}>Settings</div>
          {sideBtn('rules', 'Keyword Rules', '🔑')}
          {sideBtn('categories', 'Categories', '🏷')}
          {sideBtn('risk', 'Risk Scoring', '⚡')}
          {sideBtn('autoscan', 'Auto-Scan', '🔄')}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* ─── KEYWORD RULES ────────────────────────────────────────────── */}
          {section === 'rules' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: C.text }}>Keyword Rules</div>
                  <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>{kwConfig.rules.length} rules across {kwConfig.categories.length} categories</div>
                </div>
                {isAdmin && <Btn label="+ Add Rule" variant="primary" onClick={() => { setShowAddRule(true); setEditRuleId(null); setRuleForm({ categoryId: kwConfig.categories[0]?.id ?? '', pattern: '', type: 'exact', description: '' }); setRegexTest(''); }} darkMode={darkMode} />}
              </div>

              {/* Add/Edit rule form */}
              {(showAddRule || editRuleId) && (
                <div style={{ ...cardStyle, border: `1px solid ${darkMode ? '#3b82f6' : NAVY}`, marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>{editRuleId ? 'Edit Rule' : 'New Rule'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={labelStyle}>Category</div>
                      <select value={ruleForm.categoryId} onChange={e => setRuleForm({ ...ruleForm, categoryId: e.target.value })} style={inputStyle}>
                        {kwConfig.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={labelStyle}>Match Type</div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(['exact', 'regex'] as const).map(t => (
                          <button key={t} onClick={() => setRuleForm({ ...ruleForm, type: t })} style={{ flex: 1, padding: '8px', border: `1px solid ${ruleForm.type === t ? (darkMode ? '#3b82f6' : NAVY) : C.inputBorder}`, borderRadius: '8px', backgroundColor: ruleForm.type === t ? (darkMode ? '#1e3a5f' : '#eef2ff') : C.inputBg, color: ruleForm.type === t ? (darkMode ? '#60a5fa' : NAVY) : C.textMuted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={labelStyle}>Pattern</div>
                    <input value={ruleForm.pattern} onChange={e => { setRuleForm({ ...ruleForm, pattern: e.target.value }); if (ruleForm.type === 'regex') validateRegex(e.target.value); }} placeholder={ruleForm.type === 'exact' ? 'e.g. venmo' : 'e.g. \\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b'} style={{ ...inputStyle, fontFamily: ruleForm.type === 'regex' ? 'monospace' : 'inherit', border: regexError ? '1px solid #c62828' : inputStyle.border }} />
                    {regexError && <div style={{ fontSize: '11px', color: '#c62828', marginTop: '4px' }}>{regexError}</div>}
                  </div>
                  {ruleForm.type === 'regex' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={labelStyle}>Description (shown instead of raw regex)</div>
                      <input value={ruleForm.description} onChange={e => setRuleForm({ ...ruleForm, description: e.target.value })} placeholder="e.g. US phone number pattern" style={inputStyle} />
                    </div>
                  )}
                  {ruleForm.type === 'regex' && (
                    <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb', border: '1px solid ' + C.borderLight, borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                      <div style={{ ...labelStyle, marginBottom: '8px' }}>Regex Test</div>
                      <input value={regexTest} onChange={e => setRegexTest(e.target.value)} placeholder="Paste sample text to test matches..." style={{ ...inputStyle, marginBottom: '8px' }} />
                      {regexTest && ruleForm.pattern && !regexError && (() => {
                        const matches = getRegexMatches(ruleForm.pattern, regexTest);
                        return matches.length > 0 ? (
                          <div style={{ fontSize: '12px', color: '#2e7d32' }}>
                            ✓ {matches.length} match{matches.length > 1 ? 'es' : ''}: {matches.map((m, i) => <span key={i} style={{ fontFamily: 'monospace', backgroundColor: darkMode ? '#1a2e1a' : '#e8f5e9', padding: '1px 6px', borderRadius: '3px', marginLeft: '4px', fontWeight: 600 }}>{m}</span>)}
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: C.textMuted }}>No matches found.</div>
                        );
                      })()}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Btn label="Cancel" variant="ghost" onClick={() => { setShowAddRule(false); setEditRuleId(null); }} darkMode={darkMode} />
                    <Btn label={editRuleId ? 'Save Changes' : 'Add Rule'} variant="primary" onClick={handleSaveRule} disabled={!ruleForm.pattern.trim() || !!regexError} darkMode={darkMode} />
                  </div>
                </div>
              )}

              {/* Rules grouped by category */}
              {kwConfig.categories.map(cat => {
                const catRules = kwConfig.rules.filter(r => r.categoryId === cat.id);
                if (catRules.length === 0) return null;
                return (
                  <div key={cat.id} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: cat.color }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{cat.label}</span>
                      <span style={{ fontSize: '11px', color: C.textMuted }}>· {catRules.length} rule{catRules.length !== 1 ? 's' : ''}</span>
                      {!cat.enabled && <span style={{ fontSize: '10px', color: '#b45309', backgroundColor: darkMode ? '#2a1f05' : '#fff8e1', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>DISABLED</span>}
                    </div>
                    {catRules.map(rule => (
                      <div key={rule.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px', opacity: rule.enabled ? 1 : 0.5 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: C.text, fontWeight: 500 }}>{rule.pattern}</span>
                            <CopyBtn value={rule.pattern} size={11} />
                            <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 600, backgroundColor: rule.type === 'regex' ? (darkMode ? '#2d1b69' : '#f5f3ff') : (darkMode ? '#1a2e3a' : '#e0f2fe'), color: rule.type === 'regex' ? '#7c3aed' : '#0369a1' }}>{rule.type}</span>
                          </div>
                          {rule.description && <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{rule.description}</div>}
                        </div>
                        {isAdmin && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <button onClick={() => handleToggleRule(rule)} style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: rule.enabled ? '#2e7d32' : C.textFaint, position: 'relative', transition: 'background-color 0.2s' }}>
                              <span style={{ position: 'absolute', top: '2px', left: rule.enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                            </button>
                            <button onClick={() => { setEditRuleId(rule.id); setShowAddRule(false); setRuleForm({ categoryId: rule.categoryId, pattern: rule.pattern, type: rule.type, description: rule.description || '' }); setRegexTest(''); setRegexError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.textMuted, padding: '4px' }}>✎</button>
                            <button onClick={() => handleDeleteRule(rule)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#c62828', padding: '4px' }}>✕</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── CATEGORIES ────────────────────────────────────────────────── */}
          {section === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: C.text }}>Keyword Categories</div>
                  <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>Group keyword rules by violation type</div>
                </div>
                {isAdmin && <Btn label="+ Add Category" variant="primary" onClick={() => { setShowAddCat(true); setEditCatId(null); setCatForm({ label: '', color: '#c62828', bg: '#fdecea', description: '', weight: 18 }); }} darkMode={darkMode} />}
              </div>

              {/* Add/Edit category form */}
              {(showAddCat || editCatId) && (
                <div style={{ ...cardStyle, border: `1px solid ${darkMode ? '#3b82f6' : NAVY}`, marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>{editCatId ? 'Edit Category' : 'New Category'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={labelStyle}>Label</div>
                      <input value={catForm.label} onChange={e => setCatForm({ ...catForm, label: e.target.value })} placeholder="e.g. Payment" style={inputStyle} />
                    </div>
                    <div>
                      <div style={labelStyle}>Weight (points per hit)</div>
                      <input type="number" value={catForm.weight} onChange={e => setCatForm({ ...catForm, weight: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={labelStyle}>Text Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                        <input value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={labelStyle}>Background</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="color" value={catForm.bg} onChange={e => setCatForm({ ...catForm, bg: e.target.value })} style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                        <input value={catForm.bg} onChange={e => setCatForm({ ...catForm, bg: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={labelStyle}>Preview</div>
                      <div style={{ padding: '8px 12px', backgroundColor: catForm.bg, color: catForm.color, borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: `1px solid ${catForm.color}30`, marginTop: '4px' }}>sample keyword</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={labelStyle}>Description</div>
                    <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="e.g. Off-platform payment solicitation" style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Btn label="Cancel" variant="ghost" onClick={() => { setShowAddCat(false); setEditCatId(null); }} darkMode={darkMode} />
                    <Btn label={editCatId ? 'Save Changes' : 'Add Category'} variant="primary" onClick={handleSaveCat} disabled={!catForm.label.trim()} darkMode={darkMode} />
                  </div>
                </div>
              )}

              {/* Category list */}
              {kwConfig.categories.map(cat => {
                const ruleCount = kwConfig.rules.filter(r => r.categoryId === cat.id).length;
                return (
                  <div key={cat.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px', opacity: cat.enabled ? 1 : 0.5 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: cat.bg, border: `2px solid ${cat.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: cat.color }}>A</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{cat.label}</div>
                      <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '1px' }}>{cat.description || 'No description'} · {ruleCount} rule{ruleCount !== 1 ? 's' : ''} · Weight: {cat.weight}pts</div>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => handleToggleCat(cat)} style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: cat.enabled ? '#2e7d32' : C.textFaint, position: 'relative', transition: 'background-color 0.2s' }}>
                          <span style={{ position: 'absolute', top: '2px', left: cat.enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </button>
                        <button onClick={() => { setEditCatId(cat.id); setShowAddCat(false); setCatForm({ label: cat.label, color: cat.color, bg: cat.bg, description: cat.description || '', weight: cat.weight }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: C.textMuted, padding: '4px' }}>✎</button>
                        <button onClick={() => handleDeleteCat(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#c62828', padding: '4px' }}>✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── RISK SCORING ──────────────────────────────────────────────── */}
          {section === 'risk' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: C.text }}>Risk Scoring Configuration</div>
                <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>Adjust how risk scores are calculated and categorized</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={cardStyle}>
                  <div style={labelStyle}>High Risk Threshold</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input type="number" value={riskForm.highThreshold} onChange={e => setRiskForm({ ...riskForm, highThreshold: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '80px' }} disabled={!isAdmin} />
                    <span style={{ fontSize: '12px', color: '#c62828', fontWeight: 600 }}>Score ≥ {riskForm.highThreshold} = High Risk</span>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>Medium Risk Threshold</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input type="number" value={riskForm.mediumThreshold} onChange={e => setRiskForm({ ...riskForm, mediumThreshold: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '80px' }} disabled={!isAdmin} />
                    <span style={{ fontSize: '12px', color: '#f57f17', fontWeight: 600 }}>Score ≥ {riskForm.mediumThreshold} = Medium Risk</span>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>Flagged Conversation Bonus</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input type="number" value={riskForm.flaggedBonus} onChange={e => setRiskForm({ ...riskForm, flaggedBonus: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '80px' }} disabled={!isAdmin} />
                    <span style={{ fontSize: '12px', color: C.textMuted }}>Extra points when conversation is flagged</span>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>Maximum Score</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <input type="number" value={riskForm.maxScore} onChange={e => setRiskForm({ ...riskForm, maxScore: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '80px' }} disabled={!isAdmin} />
                    <span style={{ fontSize: '12px', color: C.textMuted }}>Score capped at this value</span>
                  </div>
                </div>
              </div>

              {/* Per-category weights */}
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Per-Category Weights</div>
              {kwConfig.categories.map(cat => (
                <div key={cat.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: cat.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: C.text, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: '12px', color: C.textMuted }}>{cat.weight} pts per hit</span>
                </div>
              ))}

              {/* Live preview */}
              <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb', border: '1px solid ' + C.borderLight, borderRadius: '8px', padding: '16px', marginTop: '16px', marginBottom: '20px' }}>
                <div style={{ ...labelStyle, marginBottom: '8px' }}>Score Preview</div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {[10, 25, riskForm.mediumThreshold, 45, riskForm.highThreshold, 80, riskForm.maxScore].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map(score => {
                    const color = score >= riskForm.highThreshold ? '#c62828' : score >= riskForm.mediumThreshold ? '#f57f17' : '#2e7d32';
                    const label = score >= riskForm.highThreshold ? 'High' : score >= riskForm.mediumThreshold ? 'Medium' : 'Low';
                    return (
                      <div key={score} style={{ fontSize: '12px', color, fontWeight: 600, backgroundColor: darkMode ? '#1e293b' : '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid ' + C.borderLight }}>
                        Score {score} → {label} Risk
                      </div>
                    );
                  })}
                </div>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Btn label="Reset to Defaults" variant="ghost" onClick={() => setRiskForm({ highThreshold: 60, mediumThreshold: 30, flaggedBonus: 20, maxScore: 100 })} darkMode={darkMode} />
                  <Btn label="Save Configuration" variant="primary" onClick={handleSaveRisk} darkMode={darkMode} />
                </div>
              )}
            </div>
          )}

          {/* ─── AUTO-SCAN ─────────────────────────────────────────────────── */}
          {section === 'autoscan' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: C.text }}>Server-Side Auto-Scan</div>
                <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>Automated keyword detection on all marketplace conversations</div>
              </div>

              {/* Status */}
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2e7d32', boxShadow: '0 0 6px #2e7d3260' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#2e7d32' }}>Active</span>
                <span style={{ fontSize: '12px', color: C.textMuted }}>— Last scan: {kwConfig.lastUpdated ? new Date(kwConfig.lastUpdated).toLocaleString() : 'Never'}</span>
              </div>

              {/* Pipeline */}
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Production Pipeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {[
                  { step: '1', title: 'Sharetribe Integration API Webhook', desc: 'Event fires on every new message (message/created)' },
                  { step: '2', title: 'Server-Side Keyword Detection', desc: 'Serverless function receives message, runs detection against current keyword config' },
                  { step: '3', title: 'Auto-Flag Conversations', desc: 'Conversations with keyword hits are automatically marked as flagged in the database' },
                  { step: '4', title: 'Console Notification', desc: 'Support console receives push notification or polls for new flags on page load' },
                ].map(item => (
                  <div key={item.step} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: darkMode ? '#334155' : NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{item.step}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '1px' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual re-scan */}
              <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb', border: '1px solid ' + C.borderLight, borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '4px' }}>Manual Re-Scan</div>
                <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '12px' }}>
                  In production, auto-scan runs automatically on every new message. Use manual re-scan to check historical conversations after adding or changing keyword rules.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Btn label={scanning ? 'Scanning...' : 'Trigger Re-Scan'} variant="primary" onClick={handleScan} disabled={scanning || !isAdmin} darkMode={darkMode} />
                  {scanResult && (
                    <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 500 }}>
                      ✓ {scanResult.scanned} conversations scanned · {scanResult.flagged} newly flagged
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
