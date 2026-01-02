# Google Apps Script Setup for Form Submissions

This guide explains how to set up a free Google Apps Script webhook to receive form submissions and store them in a Google Spreadsheet.

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "OWN Mortgage Applications" (or any name you prefer)
4. In the first row, add the following headers:
   - Column A: `Timestamp`
   - Column B: `Communication Channel`
   - Column C: `Project Description`

## Step 2: Create the Apps Script

1. In your Google Spreadsheet, click on **Extensions** → **Apps Script**
2. Delete any code in the script editor
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Append a new row with the form data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.commsChannel || '',
      data.projectDescription || ''
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to test the script
function doGet(e) {
  return ContentService.createTextOutput('Webhook is active!');
}
```

4. Click the **Save** icon (💾) and name your project (e.g., "Form Submission Handler")

## Step 3: Deploy as Web App

⚠️ **IMPORTANT**: For Google Workspace accounts (like pwn.xyz), you need admin permissions to allow external access. Use a personal Gmail account instead if you don't have admin access.

1. Click the **Deploy** button (top right) → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Form submission webhook" (or any description)
   - **Execute as**: **Me (your email)** ← CRITICAL
   - **Who has access**: **Anyone** ← CRITICAL (not "Anyone with Google account")
4. Click **Deploy**
5. You **WILL** need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - You'll see a warning "Google hasn't verified this app"
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL** - it should look like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXX/exec
   ```
   **NOT** like this (workspace account):
   ```
   https://script.google.com/a/macros/yourdomain.com/s/XXXXX/exec
   ```

### If you get a 401 error:

1. **Check "Who has access" setting**:
   - Go to Apps Script → **Deploy** → **Manage deployments**
   - Click the pencil/edit icon ✏️
   - Verify "Who has access" is set to **Anyone** (not "Anyone with Google account")
   - Click **Deploy** (this creates a new version)

2. **If using Google Workspace account** (email ends with @pwn.xyz):
   - The workspace admin may have restricted external access
   - **Solution**: Use a personal Gmail account instead
   - Create a new spreadsheet with your personal account
   - Redo the setup steps

3. **Try redeploying**:
   - Delete the current deployment
   - Create a new deployment
   - Make sure to select "Anyone" not "Anyone with Google account"

## Step 4: Update Your Application

1. Open `/Users/0x04/Code/own-mortgage-ui/app/components/modals/EarlyAccessModal.vue`
2. Find the line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
   ```
3. Replace it with your Web app URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXXXXXX/exec'
   ```
4. Save the file

## Step 5: Test the Form

1. Submit a test application through your form
2. Check your Google Spreadsheet - you should see a new row with:
   - Timestamp
   - Communication channel
   - Project description

## Troubleshooting

### Form submissions not appearing in the spreadsheet

1. Check that the Web app URL is correct
2. Ensure the script is deployed with "Who has access" set to **Anyone**
3. Check the Apps Script execution logs:
   - In Apps Script editor, click **Executions** (⏱️ icon on the left sidebar)
   - Look for any errors

### Authorization issues

- You may need to re-authorize the script if you make changes
- Go to Apps Script → Deploy → Manage deployments → Edit → Deploy new version

### CORS errors in browser console

- These are expected with `mode: 'no-cors'` in the fetch request
- The form submission still works; we just can't read the response
- The spreadsheet will update successfully

## Optional: Email Notifications

To receive email notifications when someone submits the form, add this to your Apps Script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.commsChannel || '',
      data.projectDescription || ''
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: "your-email@example.com", // Replace with your email
      subject: "New Mortgage Application Received",
      body: "Communication Channel: " + data.commsChannel + "\n\n" +
            "Project Description:\n" + data.projectDescription
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Security Notes

- This setup allows anyone to submit to your spreadsheet
- For production use, consider adding:
  - Rate limiting
  - Input validation
  - reCAPTCHA verification
  - Authentication tokens
