import en from '@translations/en';
import fr from '@translations/fr';

function flattenKeys(obj: unknown, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
      const next = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(out, flattenKeys(v, next));
      } else {
        out[next] = typeof v;
      }
    });
  }
  return out;
}

describe('Translations consistency EN vs FR', () => {
  test('both locales have same keys and types', () => {
    const enFlat = flattenKeys(en);
    const frFlat = flattenKeys(fr);

    const enKeys = Object.keys(enFlat);
    const frKeys = Object.keys(frFlat);

    const missingInFr = enKeys.filter(k => !(k in frFlat));
    const missingInEn = frKeys.filter(k => !(k in enFlat));

    const typeMismatches = enKeys
      .filter(k => k in frFlat)
      .filter(k => enFlat[k] !== frFlat[k])
      .map(k => ({ key: k, en: enFlat[k], fr: frFlat[k] }));

    expect(missingInFr).toEqual([]);
    expect(missingInEn).toEqual([]);
    expect(typeMismatches).toEqual([]);
  });
});
