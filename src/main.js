import { loadSheets } from "./sheets.js";
import { Log } from "./Log.js";
import { config } from "./config.js";

const main = async ({ privKey, sheetId, depositRangeInput, depositRangeOutput }) => {
  const sheets = await loadSheets(privKey, sheetId);
  const rows = await sheets.loadRows(depositRangeInput);

  if (hasNoData(rows)) {
    Log.info('No data found.');
    return;
  }

  const deposits = sumDeposits(rows);

  Log.info(deposits);

  await sheets.writeRows(depositRangeOutput, deposits);
}

const hasNoData = (rows) => !rows || rows.length === 0;

function sumDeposits(rows) {
  return rows.reduce((totals, row) => {
    const key = row[0];
    if (totals[key] === undefined) totals[key] = 0;
    totals[key] = totals[key] + Number(row[1]) || 0;

    return totals;
  }, {});
}

main(config);
