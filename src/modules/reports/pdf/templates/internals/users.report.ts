import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultFooter, defaultHeader } from '@modules/reports/pdf/templates/layouts/layout_1';

export const usersReport = (data: any): TDocumentDefinitions => {
  const rows = data.users.map((item: any) => {
    return [item.identification];
  });

  const dataTable = [
    [
      { text: '1Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '2Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '3Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '4Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '5Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '6Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '7Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '8Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '9Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '10Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '11Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '12Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '13Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '14Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '15Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '16Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '17Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '18Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '19Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '20Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '21Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '22Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '23Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '24Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '25Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '26Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '27Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '28Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '29Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '30Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '31Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '32Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '33Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '34Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '35Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '36Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '36Nombre Técnico Zonal', style: 'value' },
    ],
    [
      {
        text: `37Al momento de la inspección se verificará el documento que contenga políticas de cobro, alcance y excepciones, cancelación y reembolso que apliquen a los servicios contratados. También se deberá informar sobre las políticas que apliquen en caso de modificación deservicios por fuerza mayor o caso fortuito.`,
        style: 'tableHeader',
      },
      { text: '37Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '38Nombre Técnico Zonal', style: 'tableHeader' },
      { text: '38Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '39Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '40Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '41Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '42Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '43Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: '44Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
    [
      { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
      { text: 'Nombre Técnico Zonal', style: 'value' },
    ],
  ];
  const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;

  return {
    pageOrientation: 'portrait',

    pageMargins: [40, 100, 30, 100],

    pageSize: 'A4',

    header: defaultHeader(qrData),
    footer: defaultFooter,

    content: [
      {
        text: 'MATRIZ DE CONTROL - OPERACIÓN E INTERMEDIACIÓN',
        alignment: 'center',
      },
      {
        text: 'REGISTRO',
        alignment: 'center',
        marginBottom: 20,
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Nombre Técnico Zonal', style: 'tableHeader' },
              { text: 'Fecha Primera Inspección', style: 'tableHeader' },
              { text: 'Fecha Segunda Inspección', style: 'tableHeader' },
            ],
            [
              {
                text: data.nombreTecnicoZonal || 'Cesar Mauricio Tamayo Lopez',
                style: 'value',
              },
              {},
              {},
            ],
          ],
        },
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ['15%', '20%', '15%', '15%', '20%', '15%'],
          body: [
            [
              {
                text: 'DATOS GENERALES DEL ESTABLECIMIENTO',
                colSpan: 6,
                alignment: 'center',
                style: 'headerTitle',
              },
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'INFORMACIÓN USUARIO', style: 'tableHeader', colSpan: '2' },
              {},
              { text: 'INFORMACIÓN TÉCNICO ZONAL', style: 'tableHeader' },
              { text: 'INFORMACIÓN USUARIO', style: 'tableHeader', colSpan: '2' },
              {},
              { text: 'INFORMACIÓN TÉCNICO ZONAL', style: 'tableHeader' },
            ],
            [
              { text: 'Nombre Comercial', style: 'label' },
              { text: 'Nombre Comercialasdsadadsasdasdasdsad', style: 'value' },
              {},
              { text: 'Número de Registro', style: 'label' },
              { text: 'Nombre Comercial', style: 'value' },
              {},
            ],
            [
              { text: 'Razón Social', bold: true, style: 'label' },
              data.razonSocial || '',
              {},
              { text: 'Tipo de Trámite', bold: true, style: 'label' },
              data.tipoTramite || '',
              {},
            ],
            [
              { text: 'Actividad', bold: true, style: 'label' },
              data.actividad || '',
              {},
              { text: 'Categoría', bold: true, style: 'label' },
              '',
              {},
            ],
            [
              { text: 'Clasificación', bold: true, style: 'label' },
              data.clasificacion || '',
              {},
              { text: 'Nombre Franquicia o Cadena', bold: true, style: 'label' },
              '',
              {},
            ],
            [
              { text: 'Tipo de Establecimientos', bold: true, style: 'label' },
              '',
              {},
              { text: 'Contacto Establecimiento', bold: true, style: 'label' },
              data.contactoEstablecimiento || '',
              {},
            ],
            [
              { text: 'Representante Legal/Propietario', bold: true, style: 'label' },
              data.representanteLegal || '',
              {},
              { text: 'Teléfono Secundario', bold: true, style: 'label' },
              data.telefonoSecundario || '',
              {},
            ],
            [
              { text: 'Teléfono Principal', bold: true, style: 'label' },
              data.telefonoPrincipal || '',
              {},
              { text: 'Correo Electrónico', bold: true, style: 'label' },
              data.email || '',
              {},
            ],
            [
              { text: 'Local', bold: true, style: 'label' },
              data.local || '',
              {},
              { text: 'Página WEB', bold: true, style: 'label' },
              data.web || '',
              {},
            ],
          ],
        },
      },
      {
        text: `NOTA: Velar por el cumplimiento de lo dispuesto en el Reglamento General a la Ley de Turismo: Art. 49.- "Registro y razón social.- El Ministerio de Turismo no concederá el registro, a establecimientos o sujetos pasivos cuya denominación o razón social guarde identidad o similitud" Art. 63.- "Uso de denominación.- Ningún establecimiento podrá usar denominación, razón social o nombre comercial y clasificación o categoría distintas a las que constan en el registro (...)"`,
        fontSize: 8,
        color: 'red',
        margin: [0, 10, 0, 0],
      },
      {
        text: '',
        pageBreak: 'after',
      },

      {
        table: {
          widths: ['*', '*'],
          body: dataTable,
        },
      },
    ],

    styles: {
      headerTitle: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 8],
      },
      tableHeader: {
        fontSize: 8,
        bold: true,
        color: '#444',
        fillColor: '#D9D9D9',
        margin: [0, 4, 0, 4],
      },
      label: {
        fontSize: 8,
        bold: true,
        color: '#222',
      },
      value: {
        fontSize: 8,
        color: '#333',
      },
    },
  };
};
