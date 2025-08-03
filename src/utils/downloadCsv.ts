import type { BasePokemon } from '@types';

export function downloadCsv(filename: string, items: BasePokemon[]) {
  console.log(`Preparing to download CSV file:`, { items });
  const header = ['id', 'name', 'weight', 'height', 'abilities', 'types'];
  const rows = items.map((item) => [
    item.id,
    item.name,
    String(item.weight),
    String(item.height),
    item.abilities.join('; '),
    item.types.join('; '),
  ]);
  const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join(
    '\n'
  );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
