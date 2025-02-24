export function convertToCSV(data: any[], fields: string[]) {
  const replacer = (key: string, value: any) => value === null ? '' : value;
  const header = fields.join(',');
  const csv = data.map(row =>
    fields.map(field => 
      JSON.stringify(row[field], replacer)
    ).join(',')
  );
  return [header, ...csv].join('\n');
}

export function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 