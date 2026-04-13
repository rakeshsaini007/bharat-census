/**
 * Google Apps Script Backend for Bharat Census 2027
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into the editor.
 * 4. Deploy as a Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into the React app's configuration.
 */

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getRecords') {
    return getRecords();
  }
  
  return ContentService.createTextOutput("Bharat Census API is running").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'saveRecord') {
      return saveRecord(data.record);
    }
    
    return createJsonResponse({ success: false, message: "Invalid action" });
  } catch (err) {
    return createJsonResponse({ success: false, message: err.toString() });
  }
}

function getRecords() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = data[i][index];
    });
    records.push(record);
  }
  
  return createJsonResponse({ success: true, records: records });
}

function saveRecord(record) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // If sheet is empty, setup headers
  if (data.length === 1 && data[0][0] === "") {
    const defaultHeaders = Object.keys(record);
    sheet.appendRow(defaultHeaders);
    sheet.appendRow(defaultHeaders.map(h => record[h]));
    return createJsonResponse({ success: true, message: "Data saved successfully", isUpdate: false });
  }

  // Check if record exists (using buildingNumber and censusHouseNumber as unique key)
  let rowIndex = -1;
  const buildingCol = headers.indexOf('buildingNumber');
  const houseCol = headers.indexOf('censusHouseNumber');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][buildingCol] == record.buildingNumber && data[i][houseCol] == record.censusHouseNumber) {
      rowIndex = i + 1;
      break;
    }
  }

  // Add timestamp
  record.timestamp = new Date().toISOString();

  const rowData = headers.map(header => record[header] || "");

  if (rowIndex > -1) {
    // Update existing row
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return createJsonResponse({ success: true, message: "Data updated successfully", isUpdate: true });
  } else {
    // Append new row
    sheet.appendRow(rowData);
    return createJsonResponse({ success: true, message: "Data saved successfully", isUpdate: false });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
