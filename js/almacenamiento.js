let listaProfesionales=[
    {
        "id": "2",
        "matricula": "12345",
        "apellido": "Pérez",
        "nombre": "Pablo",
        "especialidad": "1",
        "descripcion": "Médico especialista en cariodlogía, dédicado al diagnostico, tratamiento y prevención de enfermedades cardiovasculares.",
        "obraSociales":[
            {
                "id" : "1"
            },
            {
                "id" : "5"
            },
            {
                "id" : "7"
            },
            {
                "id" : "9"
            }
        ],
        "fotografia": "https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png",
        "valorConsulta": "40.000"
    },
    {
        "id": "3",
        "matricula": "45678",
        "apellido": "Martinez",
        "nombre": "María",
        "especialidad": "2",
        "descripcion": "Especialista en rehabilitación y tratamiento del movimiento corporal.",
        "obraSociales":[
            {
                "id" : "3"
            },
            {
                "id" : "4"
            },
            {
                "id" : "5"
            }
        ],
        "fotografia": "https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg?_gl=1*18n0lr1*_ga*MzY3MDc5MTMzLjE3NjEzMjQwODI.*_ga_8JE65Q40S6*czE3NjEzMjQwODIkbzEkZzEkdDE3NjEzMjQwOTQkajQ4JGwwJGgw",
        "valorConsulta": "50.000"
    },
    {
        "id": "4",
        "matricula": "23456",
        "apellido": "Ledesma",
        "nombre": "Paula",
        "especialidad": "5",
        "descripcion": "Especialista en rehabilitación y tratamiento del movimiento corporal.",
        "obraSociales":[
            {
                "id" : "1"
            },
            {
                "id" : "2"
            }
        ],
        "fotografia": "https://media.istockphoto.com/id/479378798/es/foto/retrato-de-mujer-m%C3%A9dico.jpg?s=612x612&w=0&k=20&c=Q-_ggCdXeHOUqTj8CaUseV1MmmyYk8OdV7YbeOoWhD4=",
        "valorConsulta": "40.000"
    },
    {
        "id": "5",
        "matricula": "13568",
        "apellido": "Zarate",
        "nombre": "Julian",
        "especialidad": "2",
        "descripcion": "Especialista en rehabilitación y tratamiento del movimiento corporal.",
       "obraSociales": [
            {
                "id" : "1"
            },
            {
                "id" : "4"
            },
            {
                "id" : "6"
            },
            {
                "id" : "10"
            }
       ],
        "fotografia": "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
        "valorConsulta": "60.000"
    },
    {
        "id": "6",
        "matricula": "12345",
        "apellido": "Pueyrredón",
        "nombre": "Juan Cruz",
        "especialidad": "1",
        "descripcion": "Médico especialista en Psicología, dédicado al diagnostico, tratamiento y prevención de enfermedades cardiovasculares.",
        "obraSociales":[
            {
                "id" : "1"
            },
            {
                "id" : "5"
            },
            {
                "id" : "7"
            },
            {
                "id" : "9"
            }
        ],
        "fotografia": "https://cdn.prod.website-files.com/62d4f06f9c1357a606c3b7ef/65ddf3cdf19abaf5688af2f8_shutterstock_1933145801%20(1).jpg",
        "valorConsulta": "40.000"
    },
    {
        "id": "7",
        "matricula": "12345",
        "apellido": "Zarate",
        "nombre": "Emilia",
        "especialidad": "5",
        "descripcion": "Psicóloga especializada en acompañamiento emocional, manejo del estrés y fortalecimiento de recursos personales",
        "obraSociales":[
        ],
        "fotografia": "https://img.freepik.com/foto-gratis/hermosa-joven-doctora-mirando-camara-oficina_1301-7807.jpg?semt=ais_hybrid&w=740&q=80",
        "valorConsulta": "80.000"
    }
]
let especialidades=[
    {
        'id': '1',
        'nombre' : 'Medicina General'
    },
    {
        'id': '2',
        'nombre' : 'Cardiología'
    },
    {
        'id': '3',
        'nombre' : 'Nefrología'
    },
    {
        'id': '4',
        'nombre' : 'Reumatología'
    },
    {
        'id': '5',
        'nombre' : 'Psicología'
    },
    {
        'id': '6',
        'nombre' : 'Endocrinología'
    },
    {
        'id': '7',
        'nombre' : 'Pediatría'
    },
    {
        'id': '8',
        'nombre' : 'Neurología'
    },
    {
        'id': '9',
        'nombre' : 'Nutrición'
    },
    {
        'id': '10',
        'nombre': 'Dermatología'
    },
    {
        'id': '11',
        'nombre': 'Hematología'
    },
    {
        'id': '12',
        'nombre': 'Traumatología'
    }
]
let obrassociales=[
    {
        "id" : "1",
        "nombre" : "AMTTA",
        "porcentajeDescuento": "75",
        "descripcion" : "Asociación Mutual de Trabajadores de la Televisión y Afines"
    },
    {
        "id" : "2",
        "nombre" : "Bancarios",
        "porcentajeDescuento": "60",
        "descripcion" : "Obra Social del Personal Bancario"
    },
    {
        "id" : "3",
        "nombre" : "IOSFA",
        "porcentajeDescuento": "50",
        "descripcion" : "Obra Social Fuerzas Armadas"
    },
    {
        "id" : "4",
        "nombre" : "Osecac",
        "porcentajeDescuento": "70",
        "descripcion" : "Empleados de Comercio"
    },
    {
        "id" : "5",
        "nombre" : "PAMI",
        "porcentajeDescuento": "100",
        "descripcion" : "Instituto Nacional de Servicios Sociales para Jubilados y Pensionados"
    },
    {
        "id" : "6",
        "nombre" : "OSMATA",
        "porcentajeDescuento": "25",
        "descripcion" : "Obra Social de los Trabajadores del Sindicato de Mecánicos y Afines del Transporte Automotor de la República Argentina"
    },
    {
        "id" : "7",
        "nombre" : "OSPF",
        "porcentajeDescuento": "80",
        "descripcion" : "Obra Social del Personal de Farmacia"
    },
    {
        "id" : "8",
        "nombre" : "OSPIA",
        "porcentajeDescuento": "25",
        "descripcion" : "Obra Social del Personal de la Industria de la Alimentación"
    },
    {
        "id" : "9",
        "nombre" : "IOMA",
        "porcentajeDescuento": "75",
        "descripcion" : "Instituto de Obra Médico Asistencial"
    },
    {
        "id" : "10",
        "nombre" : "Avalian",
        "porcentajeDescuento": "60",
        "descripcion" : "Coop, de Prestación de Servicios Médico Asistenciales Limitada"
    }
];
let turnos=[
    {
        "id": "1",
        "id_medico": "2",
        "fechayhora":[
            {
                "dia" : "Lunes",
                "hora_inicio" : "08:00",
                "hora_fin" : "12:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "08:00",
                "hora_fin" : "12:00",
            },
            {
                "dia" : "Viernes",
                "hora_inicio" : "08:00",
                "hora_fin" : "12:00",
            }
        ]
    },
    {
        "id": "2",
        "id_medico": "3",
        "fechayhora":[
            {
                "dia" : "Lunes",
                "hora_inicio" : "08:00",
                "hora_fin" : "10:00",
            },
            {
                "dia" : "Martes",
                "hora_inicio" : "08:00",
                "hora_fin" : "10:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "08:00",
                "hora_fin" : "10:00",
            },
            {
                "dia" : "Jueves",
                "hora_inicio" : "08:00",
                "hora_fin" : "10:00",
            },
            {
                "dia" : "Viernes",
                "hora_inicio" : "08:00",
                "hora_fin" : "10:00",
            }
        ]
    },
    {
        "id" : "3",
        "id_medico": "4",
        "fechayhora":[
            {
                "dia" : "Lunes",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Martes",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Jueves",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Viernes",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            }
        ]
    },
    {
        "id": "4",
        "id_medico": "5",
        "fechayhora":[
            {
                "dia" : "Martes",
                "hora_inicio" : "08:00",
                "hora_fin" : "18:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "08:00",
                "hora_fin" : "18:00",
            },
            {
                "dia" : "Viernes",
                "hora_inicio" : "08:00",
                "hora_fin" : "18:00",
            }
        ]
    },
    {
        "id": "5",
        "id_medico": "6",
        "fechayhora":[
            {
                "dia" : "Miercoles",
                "hora_inicio" : "10:00",
                "hora_fin" : "12:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Jueves",
                "hora_inicio" : "10:00",
                "hora_fin" : "12:00",
            },
            {
                "dia" : "Jueves",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            },
            {
                "dia" : "Viernes",
                "hora_inicio" : "10:00",
                "hora_fin" : "12:00",
            },
            {
                "dia" : "Miercoles",
                "hora_inicio" : "16:00",
                "hora_fin" : "20:00",
            }
        ]
    },
    {
        "id": "6",
        "id_medico": "7",
        "fechayhora":[
            {
                "dia" : "Lunes",
                "hora_inicio" : "10:00",
                "hora_fin" : "13:00",
            },
            {
                "dia" : "Lunes",
                "hora_inicio" : "16:00",
                "hora_fin" : "18:00",
            }
        ]
    }
];




//guardar el objeto en localstorage
localStorage.setItem("medicos", JSON.stringify(listaProfesionales));
localStorage.setItem("especialidades", JSON.stringify(especialidades));
localStorage.setItem("listaObraSociales", JSON.stringify(obrassociales));
localStorage.setItem("turnos", JSON.stringify(turnos));