import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  async getSheetData() {
    const sheets = google.sheets({ version: 'v4' });

    const spreadsheetId = '18KFTMbFYwx-gLM8ThARblyW7QSVT0sd-TL6XvKnfdC8';
    const range = 'sheet!B1:K100';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: 'AIzaSyCUbyE7ZwmPUs7-VGYxow-DKjb_7fcxGHA', // Reemplaza con tu API Key
    });

    return response.data.values;
  }
}
