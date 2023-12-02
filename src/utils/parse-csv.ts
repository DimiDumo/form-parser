import { promises as fs } from 'fs';

async function parseCsv(
  filename: string,
  headerKeys?: { [headerKey: string]: string },
  delimiter = ';',
): Promise<Record<string, string>[]> {
  const fileText = await fs.readFile(filename, 'utf-8');

  const rows: string[][] = fileText
    .split('\n')
    .map((row) => row.split(delimiter));
  if (rows.length < 2) {
    return [];
  }

  const headers = rows.shift() as string[];
  const data: Record<string, string>[] = [];

  for (const row of rows) {
    const dataRow = {} as Record<string, string>;

    for (let i = 0; i < headers.length; i++) {
      if (headerKeys) {
        const headerKey = Object.entries(headerKeys).find(
          ([_, headerStrValue]) => headers[i] === headerStrValue,
        )?.[0];
        if (headerKey) {
          dataRow[headerKey] = row[i];
        }
      } else {
        dataRow[headers[i]] = row[i];
      }
    }
    data.push(dataRow);
  }
  return data;
}

export default parseCsv;
