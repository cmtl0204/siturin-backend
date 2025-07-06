import { TDocumentDefinitions } from 'pdfmake/interfaces';

export const usersReport = (data: any): TDocumentDefinitions => {
  const rows = data.users.map((item: any) => {
    return [item.identification];
  });

  return {
    pageOrientation: 'landscape',

    pageSize: 'A4',

    header: {
      columns: [
        {
          image: './storage/resources/reports/layouts/header.png',
          alignment: 'left',
          width: 50,
          height: 50,
          marginLeft: 30,
        },
        {
          text: 'UNIVERSIDAD INTERCULTURAL DE LAS NACIONALIDADES Y PUEBLOS INDÍGENAS AMAWTAY WASI',
          alignment: 'center',
          color: 'gray',
          marginTop: 20,
        },
      ],
    },

    footer: function (currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'right',
        fontSize: 10,
        marginRight: 30,
      };
    },

    content: [
      {
        text: 'INFORME DE CALIFICACIONES',
        fontSize: 12,
        bold: true,
        alignment: 'center',
        marginTop: 30,
        marginBottom: 20,
      },
    ],
  };
};
