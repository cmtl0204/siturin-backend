import { Content } from 'pdfmake/interfaces';
import { format } from 'date-fns';

export const defaultHeader = (qrText: string): Content => {
  return {
    columns: [
      {
        qr: qrText,
        fit: 70,
        foreground: '#323796',
        absolutePosition: { x: 510, y: 10 },
      },
      {
        image: './storage/resources/reports/layouts/header.png',
        alignment: 'center',
        width: 450,
        height: 50,
        marginLeft: 20,
        absolutePosition: { x: -30, y: 10 },
      },
    ],
  };
};

export const defaultFooter = (currentPage: number, pageCount: number): Content => {
  return {
    stack: [
      {
        image: './storage/resources/reports/layouts/footer.png',
        width: 550,
        marginLeft: 20,
      },
      {
        text: `Página ${currentPage} de ${pageCount} | Generado por SITURIN ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
        alignment: 'center',
        fontSize: 10,
        color: '#323796',
      },
    ],
  };
};
