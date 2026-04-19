const SHEET_NAME = 'PUT_WHATEVER_SHEET_NAME';
const SPREADSHEET_ID = 'SPREADSHEET_ID';

function doPost(e) {
  try {
    const sheet = getSheet_();

    const name = e.parameter.name || '';
    const company = e.parameter.company || '';
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    const stage = e.parameter.stage || '';
    const page = e.parameter.page || '';
    const submittedAt = e.parameter.submittedAt || '';

    if (!name || !email) {
      return ContentService.createTextOutput('Missing required fields');
    }

    sheet.appendRow([
      new Date(),
      name,
      company,
      email,
      phone,
      stage,
      page,
      submittedAt
    ]);

    SpreadsheetApp.flush();
    return ContentService.createTextOutput('Success');

  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Received At',
      'Full Name',
      'Company',
      'Email',
      'Phone',
      'Stage',
      'Page',
      'Submitted At'
    ]]);
  }

  return sheet;
}