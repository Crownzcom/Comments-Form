/**
 * Handles POST requests.
 * @param {Object} e - The event object containing the request data.
 * @returns {Object} - The response object.
 */
function doPost(e) {
    try {
      // Parse the incoming JSON request body to extract data.
      var requestData = JSON.parse(e.postData.contents);
  
      // Get the active Google Sheet.
      var ss = SpreadsheetApp.getActiveSpreadsheet();
  
      // Access the 'Users' sheet.
      var usersSheet = ss.getSheetByName('Users');
      if (!usersSheet) throw new Error("Users sheet not found.");
  
      // Fetch all emails from the 'Users' sheet for validation.
      var users = usersSheet.getDataRange().getValues();
      var userEmail = requestData.email;
      var userId = null;
  
      // Validate email and get user_id
      for (var i = 0; i < users.length; i++) {
        if (users[i][2] == userEmail) {
          userId = users[i][0];
          break;
        }
      }
  
      if (userId) {
        // Access the 'Comments' sheet.
        var commentsSheet = ss.getSheetByName('Comments');
        if (!commentsSheet) throw new Error("Comments sheet not found.");
  
        // Determine the comment ID.
        var lastRow = commentsSheet.getLastRow();
        var commentId;
        if (lastRow === 0 || lastRow === 1 && isNaN(commentsSheet.getRange(lastRow, 1).getValue())) {
          // Start from 1 if the sheet is empty or the first row contains a header instead of a number
          commentId = 1;
        } else {
          var lastCommentId = commentsSheet.getRange(lastRow, 1).getValue();
          commentId = isNaN(lastCommentId) ? 1 : parseInt(lastCommentId, 10) + 1;
        }
  
        var currentDate = new Date();
        commentsSheet.appendRow([commentId, userId, requestData.slide_name, currentDate, requestData.comment]);
  
        return ContentService.createTextOutput(JSON.stringify({ result: 'Success' }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        throw new Error('User not found');
      }
  
    } catch (error) {
      // Log any errors for debugging purposes.
      Logger.log(error.toString());
  
      // Return an error response.
      return ContentService.createTextOutput(JSON.stringify({ result: 'Error', message: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }