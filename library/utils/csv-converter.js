// Convert an array of objects into a CSV string
export const ConvertObjectArrayToCSV = (rows, headers) => {
  if (!rows || rows.length === 0) return "";

  // If no headers passed, use keys from the first object
  const cols = headers || Object.keys(rows[0]);

  const escape = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);

    // Escape quotes by doubling them
    const escaped = str.replace(/"/g, '""');

    // Wrap in quotes if it contains commas, quotes, or newlines
    if (/[",\n]/.test(escaped)) {
      return `"${escaped}"`;
    }

    return escaped;
  };

  const lines = [];

  // Header row
  lines.push(cols.join(","));

  // Data rows
  for (const row of rows) {
    const line = cols.map((col) => escape(row[col])).join(",");
    lines.push(line);
  }

  return lines.join("\n");
};
