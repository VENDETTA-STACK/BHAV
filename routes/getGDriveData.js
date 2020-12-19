const GoogleSpreadSheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('../client_secret_85699697092-fmhhvda25sb124ol8j0kvbqot9k8q9ba.apps.googleusercontent.com.json');

async function accessSpreadsheet(){
    const doc = new GoogleSpreadSheet('');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    
}


