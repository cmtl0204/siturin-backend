import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultFooter, defaultHeader, customLayout, defaultDate } from '../layouts/layout_6';

export const update = (data: any): TDocumentDefinitions => {

    const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;

    return {
        pageSize: 'A4',
        pageMargins: [40, 75, 40, 100],
        header: defaultHeader(qrData),
        footer: defaultFooter,
        content: [
            {
                text: 'ACTA DE NOTIFICACIÓN ACTUALIZACIÓN POR CAMBIO DE DIRECCIÓN - ALOJAMIENTO',
                style: 'title'
            },
            {
                text: 'MINISTERIO DE TURISMO DEL ECUADOR',
                style: 'label'
            },
            {
                text: 'PICHINCHA - RUMIÑAHUI,' + defaultDate(),
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
                style: 'tableTitle'
            },
            {
                table: {
                    widths: ['45%', '55%'],
                    body: [
                        [
                            { text: 'Número de Establecimiento:', style: 'subtitle' },
                            { text: '1', style: 'defaultText' }
                        ],
                        [
                            { text: 'R.U.C.:', style: 'subtitle' },
                            { text: '1706577796001', style: 'defaultText' }
                        ],
                        [
                            { text: 'Razón Social:', style: 'subtitle' },
                            { text: 'ANALUISA FAJARDO MARCIA YOLANDA', style: 'defaultText' }
                        ],
                        [
                            { text: 'Nombre Comercial:', style: 'subtitle' },
                            { text: 'DWJ', style: 'defaultText' }
                        ],
                        [
                            { text: 'Actividad:', style: 'subtitle' },
                            { text: 'AMERICAN DELI', style: 'defaultText' }
                        ], [
                            { text: 'Clasificaión:', style: 'subtitle' },
                            { text: 'AMERICAN DELI', style: 'defaultText' }
                        ],
                        [
                            { text: 'Representante Legal/Propietario:', style: 'subtitle' },
                            { text: 'ANALUISA FAJARDO MARCIA YOLANDA', style: 'defaultText' }
                        ],
                        [
                            { text: 'Número de Registro:', style: 'subtitle' },
                            { text: '1706577796001.001.2014173', style: 'defaultText' }
                        ],
                        [
                            { text: 'Dirección:', style: 'subtitle' },
                            { text: 'ESMERALDAS, ATACAMES, ATACAMES, CALLE 23 SL32 CALLE C6', style: 'defaultText' }
                        ],
                        [
                            { text: 'Correo Electrónico:', style: 'subtitle' },
                            { text: 'marcia_974@hotmail.com', style: 'defaultText' }
                        ]
                    ]
                },
                layout: customLayout,

                margin: [0, 0, 0, 10]
            },
            {
                text: 'Posterior a la inspección se ha verificado lo siguiente:',
                style: 'small',
                margin: [0, 0, 0, 10]
            },
            {

                table: {
                    widths: ['30%', '35%', '35%'],
                    body: [
                        [
                            { text: '', style: 'tableSubtitle' },
                            { text: 'Cumple', style: 'tableSubtitle' },
                            { text: 'No Cumple', style: 'tableSubtitle' }
                        ],
                        [
                            { text: 'Normativa', style: 'defaultText' },
                            { text: '', style: 'defaultText' },
                            { text: '', style: 'defaultText' }
                        ],
                        [
                            { text: 'Dirección declarada', style: 'defaultText' },
                            { text: '', style: 'defaultText' },
                            { text: '', style: 'defaultText' }
                        ]
                    ]
                },
                layout: customLayout,
                margin: [0, 0, 0, 10]
            },
            {
                text: 'En caso de no cumplir con la normativa declarada al inicio de sus actividades turísticas, el prestador de servicios se compromete a realizar el trámite correspondiente de reclasificación y/o recategorización, de lo contrario la Autoridad Nacional de Turismo, procederá conforme lo dispuesto en la normativa vigente.',
                style: 'small',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Observaciones:', colSpan: 2, style: 'subtitle', margin: [0, 5, 0, 5] },
                            {}
                        ],
                        [
                            { text: '', colSpan: 2, margin: [0, 10, 0, 10] },
                            {}
                        ],
                        [
                            { text: 'Técnico Zonal:', style: 'subtitle', },
                            { text: 'Propietario/Gerente/Administrador:', style: 'subtitle', }
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
                                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 260260, y2: 0, lineWidth: 1, lineColor: '#D1D1D1' }], margin: [0, 5, 0, 5]
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
                margin: [123, 0, 123, 5],
            },
            label: {
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
            tableTitle: {
                alignment: 'center',
                fontSize: 12,
                margin: [0, 0, 0, 5]
            },
            tableSubtitle: {
                fontSize: 8,
                bold: true,
                fillColor: '#D1D1D1',
                //color: '#000000',      // texto negro
                alignment: 'center',
            },
            /* tableHeader: {
                fontSize: 20,
                alignment: 'center',
                //color: '#444',
                fillColor: '#D1D1D1',
                margin: [0, 0, 0, 4],
            }, */
            subtitle: {
                fontSize: 8,
                bold: true,
                //color: '#000000',      // texto negro
                //alignment: 'left',
            },
            defaultText: {
                fontSize: 8,
            },
        },
    };
};
