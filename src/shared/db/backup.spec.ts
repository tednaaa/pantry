import type { Backup } from './backup';
import { BACKUP_VERSION, backupFileName, describeBackup, readBackup } from './backup';

function backup(overrides: Partial<Backup> = {}): Backup {
  return {
    version: BACKUP_VERSION,
    exportedAt: '2026-08-27T10:00:00.000Z',
    plan: [{ id: 'dish:borsch', kind: 'dish', refId: 'borsch', qty: 1, addedAt: 1 }],
    checks: [{ key: 'bread', checkedAt: 2 }],
    customProducts: [{ id: 'custom-foil', name: 'фольга', category: 'other', createdAt: 0, updatedAt: 0 }],
    ...overrides,
  };
}

function read(value: unknown) {
  return readBackup(JSON.stringify(value));
}

describe('readBackup', () => {
  it('should accept a well-formed copy', () => {
    const result = read(backup());

    expect(result.ok).toBe(true);
  });

  it('should reject something that is not JSON', () => {
    const result = readBackup('{');

    expect(result).toEqual({ ok: false, reason: 'Файл не похож на JSON' });
  });

  it('should reject an unknown version', () => {
    const result = read({ ...backup(), version: 99 });

    expect(result).toEqual({ ok: false, reason: 'Незнакомый формат копии' });
  });

  it('should reject a plan item with an unknown kind', () => {
    const result = read({ ...backup(), plan: [{ id: 'x', kind: 'recipe', refId: 'x', qty: 1, addedAt: 0 }] });

    expect(result).toEqual({ ok: false, reason: 'План в файле повреждён' });
  });

  it('should reject a custom product whose category left the vocabulary', () => {
    const broken = [{ id: 'a', name: 'фольга', category: 'aisle-7', createdAt: 0, updatedAt: 0 }];
    const result = read({ ...backup(), customProducts: broken });

    expect(result).toEqual({ ok: false, reason: 'Свои продукты в файле повреждены' });
  });

  it('should treat missing checks as an empty list rather than a broken file', () => {
    const { checks, ...withoutChecks } = backup();
    const result = read(withoutChecks);

    expect(checks).toHaveLength(1);
    expect(result.ok && result.backup.checks).toEqual([]);
  });

  it('should drop fields the format does not know', () => {
    const result = read({ ...backup(), weightLog: [{ kg: 80 }] });

    expect(result.ok && 'weightLog' in result.backup).toBe(false);
  });
});

describe('describeBackup', () => {
  it('should count everything the file carries', () => {
    expect(describeBackup(backup())).toBe('позиций плана: 1, своих продуктов: 1, отмечено купленным: 1');
  });
});

describe('backupFileName', () => {
  it('should stamp the local calendar date, not the UTC one', () => {
    expect(backupFileName(new Date(2026, 7, 27, 23, 30))).toBe('pantry-2026-08-27.json');
  });
});
