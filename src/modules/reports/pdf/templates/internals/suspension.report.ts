import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultFooter, defaultHeader, defaultDate, customLayout } from '../layouts/layout_5';

export const suspension = (data: any): TDocumentDefinitions => {

  const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;

  return {
    pageSize: 'A4',
    pageMargins: [40, 75, 40, 100],
    header: defaultHeader(qrData),
    footer: defaultFooter,
    content: [
      {
        text: 'ACTA DE NOTIFICACIÓN SUSPENSIÓN TEMPORAL ALOJAMIENTO',
        style: 'title'
      },
      {
        text: 'MINISTERIO DE TURISMO DEL ECUADOR',
        style: 'subtitle'
      },
      {
        text: 'ESMERALDAS - ATACAMES,' + defaultDate(),
        style: 'date'
      },
      {
        text: 'Señor/a.',
        style: 'small',
        margin: [0, 0, 0, 10]
      },
      {
        text: 'GUARDERAS RIOFRIO ESTEBAN',
        bold: true,
        style: 'small',
        margin: [0, 0, 0, 10]
      },
      {
        text: [
          'En la ciudad de ',
          { text: 'ATACAMES', bold: true },
          ', a los ',
          { text: '20 días del mes octubre del año 2024,', bold: true },
          ', la ',
          { text: 'DIRECCION ZONAL 1 - DZ1', bold: true },
          ', representado por el funcionario ',
          { text: 'CASANOVA ROJAS MARLY YIMABEL', bold: true },
          ', en su calidad de Técnico Zonal; y, el señor(a) ',
          { text: 'ANALUISA FAJARDO MARCIA YOLANDA', bold: true },
          ' en su calidad de propietario o representante legal del establecimiento ',
          { text: 'DWJ', bold: true },
          ', de manera libre y voluntaria suscriben la presente ',
          { text: 'Acta de Suspensión Temporal', bold: true },
          ' del establecimiento con la siguiente información:'
        ],
        style: 'small',
        margin: [0, 0, 0, 10]
      },
      {
        text: 'INFORMACIÓN DEL ESTABLECIMIENTO',
        style: 'tableTitle',
      },
      {
        table: {
          widths: ['40%', '60%'],
          body: [
            [
              { text: 'Número de Establecimiento:', style: 'tableSubtitle' },
              { text: '1', style: 'defaultText' }
            ],
            [
              { text: 'R.U.C.:', style: 'tableSubtitle' },
              { text: '1706577796001', style: 'defaultText' }
            ],
            [
              { text: 'Razón Social:', style: 'tableSubtitle' },
              { text: 'ANALUISA FAJARDO MARCIA YOLANDA', style: 'defaultText' }
            ],
            [
              { text: 'Nombre Comercial:', style: 'tableSubtitle' },
              { text: 'DWJ', style: 'defaultText' }
            ],
            [
              { text: 'Actividad:', style: 'tableSubtitle' },
              { text: 'AMERICAN DELI', style: 'defaultText' }
            ], [
              { text: 'Clasificaión:', style: 'tableSubtitle' },
              { text: 'AMERICAN DELI', style: 'defaultText' }
            ],
            [
              { text: 'Representante Legal/Propietario:', style: 'tableSubtitle' },
              { text: 'ANALUISA FAJARDO MARCIA YOLANDA', style: 'defaultText' }
            ],
            [
              { text: 'Número de Registro:', style: 'tableSubtitle' },
              { text: '1706577796001.001.2014173', style: 'defaultText' }
            ],
            [
              { text: 'Dirección:', style: 'tableSubtitle' },
              { text: 'ESMERALDAS, ATACAMES, ATACAMES, CALLE 23 SL32 CALLE C6', style: 'defaultText' }
            ],
            [
              { text: 'Correo Electrónico:', style: 'tableSubtitle' },
              { text: 'marcia_974@hotmail.com', style: 'defaultText' }
            ]
          ]
        },
        layout: customLayout,

        margin: [0, 0, 0, 15]
      },
      {
        text: [
          'Mediante Check list de control de fecha ',
          { text: '2024-10-20', bold: true },
          ', suscritos por el funcionario ',
          { text: 'CASANOVA ROJAS MARLY YIMABEL', bold: true },
          ' y el señor/a: ',
          { text: 'ANALUISA FAJARDO MARCIA YOLANDA', bold: true },
          ' propietario / Representante legal del establecimiento inspeccionado, se determinan el ',
          { text: 'incumplimiento de la normativa legal', bold: true },
          ', por lo que de conformidad a lo establecido en el Acuerdo Ministerial No. 2022-0010, se procede con la ',
          { text: 'SUSPENSIÓN TEMPORAL', bold: true },
          ' de la actividad turística.'
        ],
        style: 'small',
        margin: [0, 0, 0, 10],
      },

      {
        text: [
          'El prestador de servicio, durante los 30 días término posteriores a la presente notificación, ',
          { text: 'deberá solicitar de forma obligatoria una segunda inspección,', bold: true },
          ' una vez subsanadas las observaciones identificadas en el check list de control de normativa en referencia; de lo contrario, la Autoridad Nacional de Turismo procederá con lo dispuesto en el Acuerdo Ministerial 2022-0010.'
        ],
        style: 'small',
        margin: [0, 0, 0, 10]
      },
      {
        text: 'En caso de verificarse de que el establecimiento continúa con el ejercicio de la actividad turística o de verificarse que los sellos hayan sido retirados o rotos, se procederá con el inicio del proceso de sanción correspondiente, conforme la normativa legal vigente.',
        style: 'small',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Observaciones:', colSpan: 2, style: 'tableSubtitle', margin: [0, 5, 0, 5] },
              {}
            ],
            [
              { text: '', colSpan: 2, margin: [0, 10, 0, 10] },
              {}
            ],
            [
              { text: 'Técnico Zonal:', style: 'tableSubtitle', },
              { text: 'Propietario/Gerente/Administrador:', style: 'tableSubtitle', }
            ],
            [
              { text: 'Firma:', style: 'defaultText', margin: [0, 15, 0, 15] },
              { text: 'Firma:', style: 'defaultText', margin: [0, 15, 0, 15] }
            ],
            [
              { text: 'CASANOVA ROJAS MARLY YIMABEL', style: 'defaultText', },
              { text: 'Nombre:', style: 'defaultText', }
            ],
            [
              { text: 'C.I. 1308972627', style: 'defaultText', },
              { text: 'Documento de Identidad:', style: 'defaultText', }
            ],
            [
              { text: 'Dirección Zonal: DZ1', style: 'defaultText', },
              { text: 'Fecha y Hora:', style: 'defaultText', }
            ],
          ]
        },
        layout: {
          hLineColor: () => '#D1D1D1',
          vLineColor: () => '#D1D1D1', //FFFFFF
          paddingTop: () => 2,
          paddingBottom: () => 2
        },
        margin: [0, 10, 0, 10]
      },

      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }
        ]
      },
      {
        text: 'Observaciones:',
        style: 'subtitle',
        margin: [0, 5, 0, 5]
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }
        ],
        margin: [0, 20, 0, 5]
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Técnico Zonal', style: 'subtitle' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Firma:', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'CARCELÉN CÓRDOVA RICARDO ESTEBAN', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'C.I. 1716437718', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Dirección Zonal: DZ1', style: 'defaultText' },
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Propietario/Gerente/Administrador', style: 'subtitle' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Firma:', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Nombre:', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Documento de Identidad:', style: 'defaultText' },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
              },
              { text: 'Fecha y Hora:', style: 'defaultText' },
            ]
          }
        ]
      },
    ],

    styles: {
      title: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [100, 0, 100, 5],
      },
      subtitle: {
        alignment: 'center',
        fontSize: 9,
        margin: [0, 0, 0, 5]
      },
      date: {
        fontSize: 7,
        alignment: 'right',
        margin: [0, 5, 0, 5]
      },
      small: {
        fontSize: 7,
        alignment: 'justify',
      },
      /* tableHeader: {
          fontSize: 20,
          alignment: 'center',
          //color: '#444',
          fillColor: '#D1D1D1',
          margin: [0, 0, 0, 4],
      }, */
      tableTitle: {
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 5]
      },
      tableSubtitle: {
        fontSize: 8,
        bold: true,
        //color: '#000000',      // texto negro
        //alignment: 'left',
      },
      defaultText: {
        fontSize: 8,
      }
    },
  };
};
