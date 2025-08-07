import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultHeader, defaultDate, defaultFooter, customLayout } from '@modules/reports/pdf/templates/layouts/layout_3';

export const tariff = (data: any): TDocumentDefinitions => {
    const rows = data.users.map((item: any) => {
    return [item.identification];
  });

    const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;

    return {
        pageOrientation: 'portrait',
        pageMargins: [40, 85, 40, 40],
        header: defaultHeader(qrData),
        footer: defaultFooter,
        pageSize: 'A4',

        content: [
            {
                text: 'TARIFARIO RACK O MOSTRADOR',
                style: 'title'
            },
            {
                text: 'SANTA CRUZ, ' + defaultDate(),
                style: 'date',
            },
            {
                text:
                    'Conforme a lo determinado en la Disposición General Cuarta del Reglamento de Alojamiento Turístico de la Provincia de Galápagos: “Los establecimientos de alojamiento turístico deberán informar a la Autoridad Nacional de Turismo hasta el primero de diciembre de cada año sobre las tarifas rack o mostrador del año siguiente. Estas considerarán el valor por huésped, por noche, por tipo de habitación y por temporada baja y alta, incluido impuestos; de no hacerlo la Autoridad Nacional de Turismo sancionará conforme a la normativa vigente”, a fin de dar cumplimiento se detalla a continuación, la información declarada por el prestador de servicios:',
                style: 'small',
                margin: [0, 0, 0, 20],
            },
            {
                table: {
                    widths: ['25%', '25%', '25%', '25%'],
                    body: [
                        [
                            {
                                text: 'DATOS GENERALES',
                                colSpan: 4,
                                style: 'tableHeader',
                            },
                            {},
                            {},
                            {}
                        ],
                        [
                            { text: 'RAZÓN SOCIAL:', style: 'subtitle' },
                            { text: 'DELI INTERNACIONAL S.A.', colSpan: '3', style: 'defaultText' },
                            {},
                            {},
                        ],
                        [
                            { text: 'NOMBRE COMERCIAL:', style: 'subtitle' },
                            { text: 'TROPIBURGER', style: 'defaultText' },
                            { text: 'REGISTRO:', style: 'subtitle' },
                            { text: '1792072018001.039.2014236', style: 'defaultText', fontSize: 8, }
                        ],
                        [

                            { text: 'RUC:', style: 'subtitle' },
                            { text: '1792072018001', style: 'defaultText' },
                            { text: 'REPRESENTANTE LEGAL:', style: 'subtitle' },
                            { text: 'GUARDERAS RIOFRIO ESTEBAN', style: 'defaultText' },
                        ],
                        [
                            { text: 'PROVINCIA:', style: 'subtitle' },
                            { text: 'GALÁPAGOS', style: 'defaultText' },
                            { text: 'CANTÓN:', style: 'subtitle' },
                            { text: 'SANTA CRUZ', style: 'defaultText' },
                        ],
                        [
                            { text: 'DIRECCIÓN:', style: 'subtitle' },
                            { text: 'ddg, sssg, sgg', colSpan: '3', style: 'defaultText' },
                            {},
                            {}
                        ],
                        [
                            { text: 'CLASIFICACIÓN:', style: 'subtitle' },
                            { text: 'HOSTAL', style: 'defaultText' },
                            { text: 'CATEGORÍA:', style: 'subtitle' },
                            { text: '3 Estrellas', style: 'defaultText' }
                        ],
                    ]
                },
                layout: customLayout,
                

                margin: [0, 0, 0, 20]
            },
            {
                table: {
                    widths: ['20%', '20%', '20%', '20%', '20%'],
                    body: [
                        [
                            {
                                text: 'LISTADO DE TARIFAS (2025)',
                                colSpan: 5,
                                style: 'tableHeader',
                            },
                            {},
                            {},
                            {},
                            {}
                        ],
                        [
                            { text: ' ', style: 'tableSubtitle', },
                            { text: 'TARIFA POR HABITACIÓN EN TEMPORADA', colSpan: 2, style: 'tableSubtitle' },
                            {},
                            { text: 'TARIFA POR PERSONA EN TEMPORADA', colSpan: 2, style: 'tableSubtitle' },
                            {}
                        ],
                        [
                            { text: 'TIPO', style: 'tableSubtitle' },
                            { text: 'ALTA', style: 'tableSubtitle' },
                            { text: 'BAJA', style: 'tableSubtitle' },
                            { text: 'ALTA', style: 'tableSubtitle' },
                            { text: 'BAJA', style: 'tableSubtitle' },
                        ],
                        [
                            { text: 'Individual o Simple', style: 'subtitle' },
                            { text: '1 USD', style: 'defaultText' },
                            { text: '2 USD', style: 'defaultText' },
                            { text: '3 USD', style: 'defaultText' },
                            { text: '4 USD', style: 'defaultText' },
                        ],
                    ]
                },
                layout: customLayout,

                margin: [0, 0, 0, 10]
            },
            {
                text: '* Precios incluyen IVA',
                style: 'small',
            }
        ],

        styles: {
            title: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 5],
            },
            date: {
                fontSize: 10,
                alignment: 'right',
                margin: [0, 5, 0, 15]
            },
            small: {
                fontSize: 8,
                //characterSpacing: 0.1 as any,
                //lineHeight: 1.2,
                alignment: 'justify',
            },
            tableHeader: {
                fontSize: 15,
                alignment: 'center',
                //color: '#444',
                fillColor: '#D1D1D1',
                margin: [0, 0, 0, 4],
            },
            tableSubtitle: {
                fontSize: 9,
                bold: true,
                fillColor: '#D1D1D1',
                //color: '#000000',      // texto negro
                alignment: 'center',
            },
            subtitle: {
                fontSize: 9,
                bold: true,
                alignment: 'center',
            },
            defaultText: {
                fontSize: 9,
                alignment: 'center',
            }
        },
    };
};