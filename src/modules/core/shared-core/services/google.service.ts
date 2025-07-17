import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  async getSheetData(spreadsheetId: string, range: string) {
    const sheets = google.sheets({ version: 'v4' });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: 'AIzaSyCUbyE7ZwmPUs7-VGYxow-DKjb_7fcxGHA', // Reemplaza con tu API Key
    });

    return response.data.values;
  }
}
