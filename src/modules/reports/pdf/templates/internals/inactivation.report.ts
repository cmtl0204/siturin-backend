import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { customLayout, defaultDate, defaultFooter, defaultHeader } from '../layouts/layout_4';

export const inactivation = (data: any): TDocumentDefinitions => {

    const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;
    /* let message = [
        'En la ciudad de ',
        { text: 'CHILLANES', bold: true },
        ', el Ministerio de Turismo certifica que, el señor(a) ',
        { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
        ' en su calidad de propietario o representante legal del establecimiento ',
        { text: 'AMERICAN DELI', bold: true },
        ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
    ];
    message = [
        'En la ciudad de ',
        { text: 'ATACAMES', bold: true },
        ', el ssMinisterio de Turismo certifica que, el señor(a) ',
        { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
        ' en su calidad de propietario o representante legal del establecimiento ',
        { text: 'AMERICAN DELI', bold: true },
        ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
    ]; */

    const origin: string  = 'CHILLANES'; // o 'ATACAMES', o lo que necesites

    let message;

    if (origin === 'CHILLANES') {
        message = [
            '11En la ciudad de ',
            { text: 'CHILLANES', bold: true },
            ', el AAMinisterio de Turismo certifica que, el señor(a) ',
            { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
            ' en su calidad de propietario o representante legal del establecimiento ',
            { text: 'AMERICAN DELI', bold: true },
            ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
        ];
    } else if (origin === 'ATACAMES') {
        message = [
            '22En la ciudad de ',
            { text: 'ATACAMES', bold: true },
            ', el BBMinisterio de Turismo certifica que, el señor(a) ',
            { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
            ' en su calidad de propietario o representante legal del establecimiento ',
            { text: 'AMERICAN DELI', bold: true },
            ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
        ];
    }

    const message1 = [
        '11En la ciudad de ',
        { text: 'CHILLANES', bold: true },
        ', el Ministerio de Turismo certifica que, el señor(a) ',
        { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
        ' en su calidad de propietario o representante legal del establecimiento ',
        { text: 'AMERICAN DELI', bold: true },
        ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
    ];

    const message2 = [
        '22En la ciudad de ',
        { text: 'ATACAMES', bold: true },
        ', el ssMinisterio de Turismo certifica que, el señor(a) ',
        { text: 'GUARDERAS RIOFRIO ESTEBAN', bold: true },
        ' en su calidad de propietario o representante legal del establecimiento ',
        { text: 'AMERICAN DELI', bold: true },
        ', de manera libre y voluntaria realiza el trámite de Inactivación del establecimiento con la siguiente información:'
    ];


    const city = (data.city || 'ATACAMES').trim().toUpperCase();

    //const message = city === 'ATACAMES' ? message1 : message2;

    const list = {
        ul: [
            {
                text: 'El establecimiento turístico ha cambiado de actividad a no turístico.',
                bold: true,
            }
        ]
    };



    return {
        pageSize: 'A4',
        pageMargins: [40, 85, 40, 40],
        header: defaultHeader(qrData),
        footer: defaultFooter,

        content: [
            {
                text: 'CERTIFICADO DE INACTIVACIÓN',
                style: 'title'
            },
            {
                text: 'MINISTERIO DE TURISMO DEL ECUADOR',
                style: 'subtitle',
                marginBottom: 10,
            },
            {
                text: 'BOLÍVAR - CHILLANES,' + defaultDate(),
                style: 'date'
            },
            {
                text: 'Señor/a.',
                style: 'small',
                marginBottom: 10,
            },
            {
                text: 'GUARDERAS RIOFRIO ESTEBAN',
                bold: true,
                style: 'small',
                marginBottom: 10,
            },
            {
                text: message,
                style: 'small',
                marginBottom: 25,
            },
            {
                text: 'INFORMACIÓN DEL ESTABLECIMIENTO',
                style: 'label',
                marginBottom: 5,
            },
            {
                table: {
                    widths: ['45%', '55%'],
                    body: [
                        [
                            { text: 'Número de Establecimiento:', style: 'tableTitle' },
                            { text: '3', style: 'defaultText' }
                        ],
                        [
                            { text: 'R.U.C.:', style: 'tableTitle' },
                            { text: '1792072018001', style: 'defaultText' }
                        ],
                        [
                            { text: 'Razón Social:', style: 'tableTitle' },
                            { text: 'DELI INTERNACIONAL S.A.', style: 'defaultText' }
                        ],
                        [
                            { text: 'Nombre Comercial:', style: 'tableTitle' },
                            { text: 'AMERICAN DELI', style: 'defaultText' }
                        ],
                        [
                            { text: 'Actividad:', style: 'tableTitle' },
                            { text: 'AMERICAN DELI', style: 'defaultText' }
                        ], [
                            { text: 'Clasificaión:', style: 'tableTitle' },
                            { text: 'AMERICAN DELI', style: 'defaultText' }
                        ],
                        [
                            { text: 'Representante Legal/Propietario:', style: 'tableTitle' },
                            { text: 'GUARDERAS RIOFRIO ESTEBAN', style: 'defaultText' }
                        ],
                        [
                            { text: 'Número de Registro:', style: 'tableTitle' },
                            { text: '1792072018001.003.1013851', style: 'defaultText' }
                        ],
                        [
                            { text: 'Dirección:', style: 'tableTitle' },
                            { text: 'BOLÍVAR, CHILLANES, CHILLANES, nose, nose, nose', style: 'defaultText' }
                        ]
                    ]
                },
                layout: customLayout,

                marginBottom: 15,
            },
            {
                text: 'De conformidad a lo establecido en el Acuerdo Ministerial No. 2022-0010, el establecimiento se inactiva por la(s) siguiente(s) causal(es):',
                style: 'small',
                marginBottom: 10,
            },
            {
                ...list,
                style: 'small',
                margin: [15, 0, 0, 10],
            },
            {
                text: 'Recuerde que la información proporcionada para el trámite de inactivación será verificada por el Ministerio de Turismo mediante inspección, y se procederá con el inicio del proceso de sanción previstas en la ley en caso de falsedad o perjurio.',
                style: 'small',
                marginBottom: 10,
            },
            {
                image: './storage/resources/reports/layouts/firma.png',
                alignment: 'center',
                marginBottom: 10,
            },
            {
                text: 'DIRECTOR/A ZONAL 8 - DZ8 FANNY LORENA CONDO TAMAYO',
                style: 'firm',
                margin: [140, 0, 140, 0]
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
                fontSize: 8,
                alignment: 'right',
                margin: [0, 5, 0, 5]
            },
            subtitle: {
                alignment: 'center',
                fontSize: 10,
            },
            small: {
                fontSize: 8,
                //characterSpacing: 0.1 as any,
                //lineHeight: 1.2,
                alignment: 'justify',
            },
            label: {
                fontSize: 15,
                alignment: 'center',
            },
            firm: {
                bold: true,
                fontSize: 13,
                alignment: 'center',
            },
            tableTitle: {
                fontSize: 8,
                bold: true,
                //color: '#000000',      // texto negro
                alignment: 'left',
            },
            defaultText: {
                fontSize: 8,
            }
        },
    };
};
