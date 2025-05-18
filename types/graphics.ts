export type graphicOption = 'weekly' | 'monthly' | 'productivity' | null;

export const graphicFilters: { label: string; value: graphicOption }[] = [
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensual ', value: 'monthly' },
  { label: 'Productividad', value: 'productivity' },
];