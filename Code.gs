/* =========================================================================
   HunarNet — Google Apps Script backend
   -------------------------------------------------------------------------
   Receives form submissions from the website and appends them as rows in a
   Google Sheet. One tab per form type: "Join", "Practice", "Discussion".

   Deploy this as a Web App (see README-appscript.md). No database needed —
   every submission becomes a spreadsheet row you can view, filter and export.
   ========================================================================= */

// If you bind this script to a Sheet (Extensions > Apps Script from the Sheet),
// leave SHEET_ID empty and it uses the active spreadsheet. If you run it as a
// standalone script, paste your Sheet's ID here (the long string in its URL).
var SHEET_ID = "";

// Column layout for each form type. The first row of each tab becomes a header.
var SCHEMAS = {
  join: {
    tab: "Join",
    headers: ["Timestamp", "Language", "Name", "School", "Role", "Experience", "Participate"],
    row: function (b) {
      var d = b.data || {};
      return [
        b.submittedAt || new Date().toISOString(),
        b.lang || "",
        d.name || "",
        d.school || "",
        d.role || "",
        (d.experience || []).join(", "),
        (d.participate || []).join(", ")
      ];
    }
  },
  practice: {
    tab: "Practice",
    headers: ["Timestamp", "Language", "Type", "Title", "About", "Challenge", "What Changed"],
    row: function (b) {
      var d = b.data || {};
      return [
        b.submittedAt || new Date().toISOString(),
        b.lang || "",
        d.type || "",
        d.title || "",
        d.about || "",
        d.challenge || "",
        d.changed || ""
      ];
    }
  },
  discussion: {
    tab: "Discussion",
    headers: ["Timestamp", "Language", "Title", "Details", "Tag"],
    row: function (b) {
      var d = b.data || {};
      return [
        b.submittedAt || new Date().toISOString(),
        b.lang || "",
        d.title || "",
        d.details || "",
        d.tag || ""
      ];
    }
  }
};

function getSpreadsheet_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(schema) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(schema.tab);
  if (!sheet) {
    sheet = ss.insertSheet(schema.tab);
    sheet.appendRow(schema.headers);
    sheet.getRange(1, 1, 1, schema.headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(schema.headers);
    sheet.getRange(1, 1, 1, schema.headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handles the POST from the website.
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var schema = SCHEMAS[body.formType];
    if (!schema) {
      return json_({ result: "error", message: "Unknown formType: " + body.formType });
    }
    var sheet = getSheet_(schema);
    sheet.appendRow(schema.row(body));
    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}

// Lets you open the Web App URL in a browser to confirm it is live.
function doGet() {
  return json_({ result: "ok", service: "HunarNet form endpoint" });
}

// Optional: run once from the editor to pre-create all three tabs.
function setupTabs() {
  Object.keys(SCHEMAS).forEach(function (k) { getSheet_(SCHEMAS[k]); });
}
