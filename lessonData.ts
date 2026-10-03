export interface InteractiveWord {
  id: string;
  es: string;
  hy: string;
  pronounce?: string;
  noteEs?: string;
  noteHy?: string;
  type?: 'word' | 'pair' | 'sentence' | 'family';
}

export interface SectionItem {
  id: string;
  number: number;
  titleEs: string;
  titleHy: string;
  descriptionEs: string;
  descriptionHy: string;
  badge: string;
  category: string;
  examples: InteractiveWord[];
  extraContent?: {
    type: 'comparison' | 'sentences' | 'family' | 'list';
    titleEs?: string;
    titleHy?: string;
    items: {
      es: string;
      hy: string;
      sub?: string;
    }[];
  };
}

export interface RememberItem {
  id: string;
  termEs: string;
  termHy: string;
  defEs: string;
  defHy: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  questionEs: string;
  questionHy: string;
  options: {
    textEs: string;
    textHy: string;
    correct: boolean;
  }[];
  explanationEs: string;
  explanationHy: string;
}

export const PREVIOUS_TOPIC = {
  titleEs: "Tema anterior: La lengua como sistema",
  titleHy: "Նախորդ թեման. Լեզուն որպես համակարգ",
  introEs: "La lengua es un conjunto de elementos interrelacionados que forman una estructura organizada.",
  introHy: "Լեզուն փոխկապակցված տարրերի ամբողջություն է, որոնք կազմում են կազմակերպված կառուցվածք։",
  levels: [
    {
      nameEs: "Nivel fónico (Fonética y fonología)",
      nameHy: "Հնչյունական մակարդակ (հնչյունաբանություն)",
      descEs: "Estudia los sonidos y fonemas de la lengua.",
      descHy: "Ուսումնասիրում է լեզվի հնչյուններն ու հնչույթները։"
    },
    {
      nameEs: "Nivel morfológico (Morfología)",
      nameHy: "Ձևաբանական մակարդակ (ձևաբանություն)",
      descEs: "Estudia la estructura interna de las palabras y sus partes (raíz, prefijos, sufijos).",
      descHy: "Ուսումնասիրում է բառերի ներքին կառուցվածքն ու մասերը (արմատ, նախածանց, վերջածանց)։"
    },
    {
      nameEs: "Nivel sintáctico (Sintaxis)",
      nameHy: "Շարահյուսական մակարդակ (շարահյուսություն)",
      descEs: "Estudia cómo se combinan las palabras para formar oraciones coherentes.",
      descHy: "Ուսումնասիրում է, թե ինչպես են բառերը միավորվում՝ կազմելով նախադասություններ։"
    },
    {
      nameEs: "Nivel léxico-semántico (Semántica y léxico) ⭐",
      nameHy: "Բառային-իմաստային մակարդակ (բառագիտություն և իմաստաբանություն) ⭐",
      descEs: "Estudia el vocabulario y el significado de las palabras. ¡Es el tema actual: Palabras y significados!",
      descHy: "Ուսումնասիրում է բառապաշարն ու բառերի իմաստը։ Սա հենց մեր նոր թեման է՝ «Բառեր և իմաստներ»։"
    }
  ]
};

export const LESSON_SECTIONS: SectionItem[] = [
  {
    id: "tema-1",
    number: 1,
    titleEs: "¿Qué estudia esta parte de la lengua?",
    titleHy: "Ի՞նչ է ուսումնասիրում այս թեման",
    badge: "Introducción · Ներածություն",
    category: "Fundamento",
    descriptionEs: "Las palabras tienen un significado, y ese significado puede cambiar según el contexto. También existen palabras con significados parecidos, contrarios o diferentes.",
    descriptionHy: "Բառերն ունեն իմաստ, և այդ իմաստը կարող է փոխվել՝ կախված համատեքստից։ Կան նաև նման, հակադիր կամ տարբեր իմաստ ունեցող բառեր։",
    examples: [
      {
        id: "ex-1-1",
        es: "Las palabras tienen un significado.",
        hy: "Բառերն ունեն իմաստ։",
        type: "sentence"
      },
      {
        id: "ex-1-2",
        es: "El significado puede cambiar según el contexto.",
        hy: "Իմաստը կարող է փոխվել՝ կախված համատեքստից։",
        type: "sentence"
      },
      {
        id: "ex-1-3",
        es: "Palabras con significados parecidos, contrarios o diferentes.",
        hy: "Նման, հակադիր կամ տարբեր իմաստներ ունեցող բառեր։",
        type: "sentence"
      }
    ]
  },
  {
    id: "tema-2",
    number: 2,
    titleEs: "Significado léxico",
    titleHy: "Բառային իմաստ",
    badge: "Significado · Իմաստ",
    category: "Léxico",
    descriptionEs: "El significado léxico es la idea principal que expresa una palabra.",
    descriptionHy: "Բառային իմաստը այն հիմնական գաղափարն է, որը արտահայտում է բառը։",
    examples: [
      {
        id: "ex-2-1",
        es: "mesa",
        hy: "սեղան",
        noteEs: "mueble con una superficie horizontal",
        noteHy: "կահույք՝ հորիզոնական մակերեսով",
        type: "word"
      },
      {
        id: "ex-2-2",
        es: "perro",
        hy: "շուն",
        noteEs: "animal doméstico",
        noteHy: "ընտանի կենդանի",
        type: "word"
      },
      {
        id: "ex-2-3",
        es: "alegría",
        hy: "ուրախություն",
        noteEs: "sentimiento positivo",
        noteHy: "դրական զգացմունք",
        type: "word"
      }
    ]
  },
  {
    id: "tema-3",
    number: 3,
    titleEs: "Monosemia",
    titleHy: "Մենիմաստություն",
    badge: "Mono = 1 իմաստ",
    category: "Semántica",
    descriptionEs: "Una palabra es monosémica cuando tiene un solo significado, especialmente en contextos técnicos o científicos.",
    descriptionHy: "Բառը մենիմաստ է, երբ ունի միայն մեկ հիմնական նշանակություն (հատկապես գիտական կամ տեխնիկական բնագավառներում)։",
    examples: [
      {
        id: "ex-3-1",
        es: "termómetro",
        hy: "ջերմաչափ",
        noteEs: "instrumento para medir la temperatura",
        noteHy: "ջերմաստիճանը չափելու գործիք",
        type: "word"
      },
      {
        id: "ex-3-2",
        es: "oxígeno",
        hy: "թթվածին",
        noteEs: "elemento químico vital",
        noteHy: "կենսական քիմիական տարր",
        type: "word"
      },
      {
        id: "ex-3-3",
        es: "triángulo",
        hy: "եռանկյուն",
        noteEs: "figura geométrica de tres lados",
        noteHy: "երեք կողմ ունեցող երկրաչափական պատկեր",
        type: "word"
      },
      {
        id: "ex-3-4",
        es: "El termómetro mide la temperatura.",
        hy: "Ջերմաչափը չափում է ջերմաստիճանը։",
        type: "sentence"
      }
    ]
  },
  {
    id: "tema-4",
    number: 4,
    titleEs: "Polisemia",
    titleHy: "Բազմիմաստություն",
    badge: "Poli = Շատ իմաստներ",
    category: "Semántica",
    descriptionEs: "Una palabra es polisémica cuando tiene varios significados relacionados entre sí.",
    descriptionHy: "Բառը բազմիմաստ է, երբ ունի մի քանի իրար հետ կապված իմաստներ։",
    examples: [
      {
        id: "ex-4-1",
        es: "Me duele la cabeza.",
        hy: "Գլուխս ցավում է։",
        noteEs: "cabeza → parte del cuerpo humano",
        noteHy: "գլուխ՝ որպես մարդու մարմնի մաս",
        type: "sentence"
      },
      {
        id: "ex-4-2",
        es: "Ella es la cabeza del equipo.",
        hy: "Նա թիմի գլխավորն է (ղեկավարն է)։",
        noteEs: "cabeza → persona que dirige",
        noteHy: "գլուխ / ղեկավար՝ որպես խմբի գլխավոր անձ",
        type: "sentence"
      },
      {
        id: "ex-4-3",
        es: "cabeza",
        hy: "գլուխ",
        noteEs: "1. parte del cuerpo  2. persona que dirige",
        noteHy: "1. մարմնի մաս  2. խմբի ղեկավար",
        type: "word"
      }
    ]
  },
  {
    id: "tema-5",
    number: 5,
    titleEs: "Sinonimia",
    titleHy: "Հոմանիշություն",
    badge: "Նույն / Մոտ իմաստ",
    category: "Relaciones",
    descriptionEs: "Los sinónimos son palabras que tienen un significado igual o parecido.",
    descriptionHy: "Հոմանիշները նույն կամ մոտ իմաստ ունեցող բառեր են։",
    examples: [
      {
        id: "ex-5-1",
        es: "feliz — contento",
        hy: "ուրախ — գոհ / ուրախ",
        type: "pair"
      },
      {
        id: "ex-5-2",
        es: "bonito — hermoso",
        hy: "սիրուն — գեղեցիկ",
        type: "pair"
      },
      {
        id: "ex-5-3",
        es: "rápido — veloz",
        hy: "արագ — սրընթաց / արագ",
        type: "pair"
      },
      {
        id: "ex-5-4",
        es: "empezar — comenzar",
        hy: "սկսել — մեկնարկել / սկսել",
        type: "pair"
      },
      {
        id: "ex-5-5",
        es: "María está feliz.",
        hy: "Մարիան ուրախ է։",
        type: "sentence"
      },
      {
        id: "ex-5-6",
        es: "María está contenta.",
        hy: "Մարիան գոհ է / ուրախ է։",
        type: "sentence"
      }
    ],
    extraContent: {
      type: "sentences",
      titleEs: "Las dos oraciones tienen un significado parecido",
      titleHy: "Երկու նախադասությունն էլ ունեն նման իմաստ",
      items: [
        {
          es: "María está feliz. = María está contenta.",
          hy: "Մարիան ուրախ է։ Երկուսն էլ արտահայտում են ուրախ վիճակ։"
        }
      ]
    }
  },
  {
    id: "tema-6",
    number: 6,
    titleEs: "Antonimia",
    titleHy: "Հականիշություն",
    badge: "Հակադիր իմաստ",
    category: "Relaciones",
    descriptionEs: "Los antónimos son palabras que tienen significados contrarios.",
    descriptionHy: "Հականիշները հակադիր իմաստ ունեցող բառեր են։",
    examples: [
      {
        id: "ex-6-1",
        es: "grande ↔ pequeño",
        hy: "մեծ ↔ փոքր",
        type: "pair"
      },
      {
        id: "ex-6-2",
        es: "alto ↔ bajo",
        hy: "բարձր ↔ ցածր",
        type: "pair"
      },
      {
        id: "ex-6-3",
        es: "rápido ↔ lento",
        hy: "արագ ↔ դանդաղ",
        type: "pair"
      },
      {
        id: "ex-6-4",
        es: "entrar ↔ salir",
        hy: "մտնել ↔ դուրս գալ",
        type: "pair"
      },
      {
        id: "ex-6-5",
        es: "feliz ↔ triste",
        hy: "ուրախ ↔ տխուր",
        type: "pair"
      }
    ]
  },
  {
    id: "tema-7",
    number: 7,
    titleEs: "Homonimia",
    titleHy: "Համանունություն",
    badge: "Նույն ձև · Տարբեր իմաստ",
    category: "Semántica",
    descriptionEs: "Las palabras homónimas tienen la misma forma o una forma muy parecida, pero significados diferentes.",
    descriptionHy: "Համանուն բառերը նույն ձևն ունեն, բայց բոլորովին տարբեր իմաստներ։",
    examples: [
      {
        id: "ex-7-1",
        es: "Voy al banco para sacar dinero.",
        hy: "Գնում եմ բանկ՝ գումար հանելու։",
        noteEs: "banco → entidad financiera",
        noteHy: "բանկ → ֆինանսական հաստատություն",
        type: "sentence"
      },
      {
        id: "ex-7-2",
        es: "Me siento en un banco del parque.",
        hy: "Նստում եմ պուրակի նստարանին։",
        noteEs: "banco → asiento",
        noteHy: "բանկ / նստարան → նստելու տեղ",
        type: "sentence"
      },
      {
        id: "ex-7-3",
        es: "banco",
        hy: "բանկ (ֆինանսներ) կամ նստարան",
        noteEs: "1. entidad financiera  2. asiento",
        noteHy: "1. ֆինանսական հաստատություն  2. նստարան",
        type: "word"
      }
    ]
  },
  {
    id: "tema-8",
    number: 8,
    titleEs: "Homófonas",
    titleHy: "Նույնահունչ բառեր",
    badge: "Նույն հնչյուն · Տարբեր գրություն",
    category: "Fonética y Ortografía",
    descriptionEs: "Las palabras homófonas suenan igual o casi igual, pero se escriben de manera diferente y tienen distinto significado.",
    descriptionHy: "Նույնահունչ բառերը նույն կամ շատ նման են հնչում, բայց տարբեր կերպ են գրվում և տարբեր իմաստ ունեն։",
    examples: [
      {
        id: "ex-8-1",
        es: "vaca — baca",
        hy: "կով (vaca) — մեքենայի տանիքի բեռնակիր (baca)",
        noteEs: "vaca (animal) vs baca (portaequipajes del coche)",
        noteHy: "vaca (կենդանի) vs baca (տանիքի բեռնատեղ)",
        type: "pair"
      },
      {
        id: "ex-8-2",
        es: "hola — ola",
        hy: "ողջույն / բարև (hola) — ծովի ալիք (ola)",
        noteEs: "hola (saludo) vs ola (movimiento del mar)",
        noteHy: "hola (բարև) vs ola (ծովի ալիք)",
        type: "pair"
      },
      {
        id: "ex-8-3",
        es: "vaca",
        hy: "կով",
        noteEs: "animal",
        noteHy: "ընտանի կաթնատու կենդանի",
        type: "word"
      },
      {
        id: "ex-8-4",
        es: "baca",
        hy: "մեքենայի տանիքի բեռնակիր",
        noteEs: "parte superior de un coche para transportar objetos",
        noteHy: "մեքենայի վերնամասում իրեր տեղափոխելու հարմարանք",
        type: "word"
      },
      {
        id: "ex-8-5",
        es: "hola",
        hy: "բարև / ողջույն",
        noteEs: "saludo",
        noteHy: "ողջույնի խոսք",
        type: "word"
      },
      {
        id: "ex-8-6",
        es: "ola",
        hy: "ալիք",
        noteEs: "movimiento del mar",
        noteHy: "ծովի ջրերի շարժում",
        type: "word"
      }
    ]
  },
  {
    id: "tema-9",
    number: 9,
    titleEs: "Campo semántico",
    titleHy: "Իմաստային դաշտ",
    badge: "Նույն թեմայի բառեր",
    category: "Léxico",
    descriptionEs: "Un campo semántico es un grupo de palabras que pertenecen a la misma área de significado.",
    descriptionHy: "Իմաստային դաշտը նույն ընդհանուր թեմային կամ ոլորտին պատկանող բառերի խումբ է։",
    examples: [
      {
        id: "ex-9-1",
        es: "familia: padre, madre, hermano, hermana, abuelo, abuela",
        hy: "ընտանիք՝ հայր, մայր, եղբայր, քույր, պապիկ, տատիկ",
        type: "pair"
      },
      {
        id: "ex-9-2",
        es: "colores: rojo, azul, verde, amarillo",
        hy: "գույներ՝ կարմիր, կապույտ, կանաչ, դեղին",
        type: "pair"
      },
      {
        id: "ex-9-3",
        es: "padre, madre, hermano, hermana, abuelo, abuela",
        hy: "հայր, մայր, եղբայր, քույր, պապիկ, տատիկ",
        noteEs: "Campo semántico: Familia",
        noteHy: "Իմաստային դաշտ՝ Ընտանիք",
        type: "word"
      },
      {
        id: "ex-9-4",
        es: "rojo, azul, verde, amarillo",
        hy: "կարմիր, կապույտ, կանաչ, դեղին",
        noteEs: "Campo semántico: Colores",
        noteHy: "Իմաստային դաշտ՝ Գույներ",
        type: "word"
      }
    ]
  },
  {
    id: "tema-10",
    number: 10,
    titleEs: "Familia léxica",
    titleHy: "Բառակազմական ընտանիք",
    badge: "Նույն արմատ",
    category: "Morfología y Léxico",
    descriptionEs: "Una familia léxica está formada por palabras que comparten la misma raíz.",
    descriptionHy: "Բառակազմական ընտանիքը նույն արմատն ունեցող բառերի խումբ է։",
    examples: [
      {
        id: "ex-10-1",
        es: "pan → panadero, panadería",
        hy: "հաց → հացթուխ, հացատուն (հացի խանութ)",
        noteEs: "Raíz: pan-",
        noteHy: "Արմատ՝ pan-",
        type: "family"
      },
      {
        id: "ex-10-2",
        es: "pan",
        hy: "հաց",
        type: "word"
      },
      {
        id: "ex-10-3",
        es: "panadero",
        hy: "հացթուխ",
        type: "word"
      },
      {
        id: "ex-10-4",
        es: "panadería",
        hy: "հացատուն / հացի խանութ",
        type: "word"
      },
      {
        id: "ex-10-5",
        es: "flor → florero, florista, florecer",
        hy: "ծաղիկ → ծաղկաման, ծաղկավաճառ, ծաղկել",
        noteEs: "Raíz: flor-",
        noteHy: "Արմատ՝ flor-",
        type: "family"
      },
      {
        id: "ex-10-6",
        es: "florero",
        hy: "ծաղկաման",
        type: "word"
      },
      {
        id: "ex-10-7",
        es: "florista",
        hy: "ծաղկավաճառ",
        type: "word"
      },
      {
        id: "ex-10-8",
        es: "florecer",
        hy: "ծաղկել",
        type: "word"
      }
    ]
  },
  {
    id: "tema-11",
    number: 11,
    titleEs: "Sentido literal",
    titleHy: "Ուղղակի իմաստ",
    badge: "Իրական / Ուղիղ",
    category: "Uso y Sentido",
    descriptionEs: "El sentido literal es el significado real y directo de una palabra o expresión.",
    descriptionHy: "Ուղղակի իմաստը բառի կամ արտահայտության իրական, հիմնական և ուղիղ իմաստն է։",
    examples: [
      {
        id: "ex-11-1",
        es: "Pedro tiene los ojos grandes.",
        hy: "Պեդրոն մեծ աչքեր ունի։",
        noteEs: "Aquí 'ojos grandes' significa literalmente que sus ojos son grandes.",
        noteHy: "Այստեղ խոսքը իրական մեծ աչքերի մասին է։",
        type: "sentence"
      },
      {
        id: "ex-11-2",
        es: "ojos grandes",
        hy: "մեծ աչքեր (ֆիզիկական իրական աչքեր)",
        type: "word"
      }
    ]
  },
  {
    id: "tema-12",
    number: 12,
    titleEs: "Sentido figurado",
    titleHy: "Փոխաբերական իմաստ",
    badge: "Պատկերավոր / Փոխաբերական",
    category: "Uso y Sentido",
    descriptionEs: "El sentido figurado aparece cuando una palabra no se utiliza con su significado literal, sino con un significado especial y expresivo.",
    descriptionHy: "Փոխաբերական իմաստը այն է, երբ բառը օգտագործվում է ոչ թե իր ուղղակի, այլ հատուկ կամ պատկերավոր իմաստով։",
    examples: [
      {
        id: "ex-12-1",
        es: "Tiene un corazón de oro.",
        hy: "Նա ոսկե սիրտ ունի։",
        noteEs: "No significa que su corazón sea realmente de oro. Significa que es una persona muy buena.",
        noteHy: "Սա չի նշանակում, որ նրա սիրտը իսկապես ոսկուց է։ Նշանակում է, որ նա շատ բարի մարդ է։",
        type: "sentence"
      },
      {
        id: "ex-12-2",
        es: "corazón de oro",
        hy: "ոսկե սիրտ (չափազանց բարի անձնավորություն)",
        type: "word"
      }
    ]
  },
  {
    id: "tema-13",
    number: 13,
    titleEs: "Denotación y connotación",
    titleHy: "Ուղղակի և լրացուցիչ իմաստ",
    badge: "Օբյեկտիվ vs Հուզական",
    category: "Semántica",
    descriptionEs: "Denotación: significado objetivo y literal. Connotación: ideas o sentimientos adicionales que una palabra transmite según el contexto.",
    descriptionHy: "Դենոտացիան բառարանային, օբյեկտիվ իմաստն է։ Կոնոտացիան լրացուցիչ զգացմունքն է կամ հուզական գաղափարը։",
    examples: [
      {
        id: "ex-13-1",
        es: "Denotación: perro → animal",
        hy: "Դենոտացիա՝ perro (շուն) → կենդանի",
        noteEs: "Significado objetivo y literal de la palabra",
        noteHy: "Բառի բառարանային, օբյեկտիվ իմաստն է",
        type: "pair"
      },
      {
        id: "ex-13-2",
        es: "Connotación: hogar",
        hy: "Կոնոտացիա՝ hogar (օջախ / տուն)",
        noteEs: "No solo significa una casa; transmite la idea de familia, seguridad o cariño.",
        noteHy: "Ոչ միայն տուն է նշանակում, այլ նաև ընտանիք, ջերմություն և ապահովություն։",
        type: "pair"
      },
      {
        id: "ex-13-3",
        es: "perro",
        hy: "շուն (օբյեկտիվ կենդանի)",
        type: "word"
      },
      {
        id: "ex-13-4",
        es: "hogar",
        hy: "տուն / օջախ (ընտանիք, սեր, ջերմություն)",
        type: "word"
      }
    ]
  }
];

export const REMEMBER_ITEMS: RememberItem[] = [
  {
    id: "rem-1",
    termEs: "Monosemia",
    termHy: "Մենիմաստություն",
    defEs: "Un significado.",
    defHy: "Մեկ իմաստ։",
    icon: "1️⃣"
  },
  {
    id: "rem-2",
    termEs: "Polisemia",
    termHy: "Բազմիմաստություն",
    defEs: "Varios significados.",
    defHy: "Մի քանի իմաստ։",
    icon: "🔀"
  },
  {
    id: "rem-3",
    termEs: "Sinonimia",
    termHy: "Հոմանիշություն",
    defEs: "Significados parecidos.",
    defHy: "Նման իմաստներ։",
    icon: "🤝"
  },
  {
    id: "rem-4",
    termEs: "Antonimia",
    termHy: "Հականիշություն",
    defEs: "Significados contrarios.",
    defHy: "Հակադիր իմաստներ։",
    icon: "↔️"
  },
  {
    id: "rem-5",
    termEs: "Homonimia",
    termHy: "Համանունություն",
    defEs: "Misma forma, significados diferentes.",
    defHy: "Նույն ձև, տարբեր իմաստներ։",
    icon: "🎭"
  },
  {
    id: "rem-6",
    termEs: "Homófonas",
    termHy: "Նույնահունչ բառեր",
    defEs: "Suenan igual, diferente escritura y significado.",
    defHy: "Նույն հնչողություն, տարբեր գրություն և իմաստ։",
    icon: "🔊"
  },
  {
    id: "rem-7",
    termEs: "Campo semántico",
    termHy: "Իմաստային դաշտ",
    defEs: "Palabras de un mismo tema.",
    defHy: "Նույն թեմայի բառեր։",
    icon: "📂"
  },
  {
    id: "rem-8",
    termEs: "Familia léxica",
    termHy: "Բառակազմական ընտանիք",
    defEs: "Palabras con la misma raíz.",
    defHy: "Նույն արմատով բառեր։",
    icon: "🌱"
  },
  {
    id: "rem-9",
    termEs: "Sentido literal",
    termHy: "Ուղղակի իմաստ",
    defEs: "Significado directo.",
    defHy: "Ուղղակի իմաստ։",
    icon: "🎯"
  },
  {
    id: "rem-10",
    termEs: "Sentido figurado",
    termHy: "Փոխաբերական իմաստ",
    defEs: "Significado no literal.",
    defHy: "Փոխաբերական իմաստ։",
    icon: "✨"
  },
  {
    id: "rem-11",
    termEs: "Denotación y Connotación",
    termHy: "Ուղղակի և լրացուցիչ իմաստ",
    defEs: "Denotación = objetivo literal; Connotación = ideas/sentimientos adicionales.",
    defHy: "Դենոտացիա = բառարանային ուղիղ իմաստ; Կոնոտացիա = լրացուցիչ հուզականություն։",
    icon: "💡"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    questionEs: "¿Qué es una palabra polisémica?",
    questionHy: "Ի՞նչ է բազմիմաստ (polisémica) բառը։",
    options: [
      { textEs: "Una palabra con un solo significado", textHy: "Միայն մեկ իմաստ ունեցող բառ", correct: false },
      { textEs: "Una palabra con varios significados relacionados", textHy: "Մի քանի իրար հետ կապված իմաստներ ունեցող բառ", correct: true },
      { textEs: "Una palabra que suena igual a otra", textHy: "Մեկ այլ բառի նման հնչող բառ", correct: false },
      { textEs: "Una palabra con significado contrario", textHy: "Հակադիր իմաստ ունեցող բառ", correct: false }
    ],
    explanationEs: "Una palabra es polisémica cuando tiene varios significados relacionados entre sí, como 'cabeza'.",
    explanationHy: "Բառը բազմիմաստ է (polisémica), երբ ունի մի քանի իրար հետ կապված իմաստներ (օրինակ՝ cabeza - գլուխ կամ ղեկավար)։"
  },
  {
    id: "q-2",
    questionEs: "'Feliz' y 'contento' son un ejemplo de:",
    questionHy: "«Feliz» և «contento» բառերը ո՞ր երևույթի օրինակ են։",
    options: [
      { textEs: "Antonimia (հականիշություն)", textHy: "Հականիշներ են", correct: false },
      { textEs: "Homonimia (համանունություն)", textHy: "Համանուններ են", correct: false },
      { textEs: "Sinonimia (հոմանիշություն)", textHy: "Հոմանիշներ են (նույն/մոտ իմաստ)", correct: true },
      { textEs: "Monosemia (մենիմաստություն)", textHy: "Մենիմաստություն", correct: false }
    ],
    explanationEs: "Los sinónimos son palabras con significado igual o parecido: feliz = contento.",
    explanationHy: "Հոմանիշները (sinónimos) նույն կամ մոտ իմաստ ունեցող բառերն են՝ feliz (ուրախ) = contento (ուրախ/գոհ)։"
  },
  {
    id: "q-3",
    questionEs: "¿Cuál es el antónimo de 'grande'?",
    questionHy: "Ո՞րն է «grande» (մեծ) բառի հականիշը (antónimo)։",
    options: [
      { textEs: "alto", textHy: "բարձր", correct: false },
      { textEs: "pequeño", textHy: "փոքր", correct: true },
      { textEs: "veloz", textHy: "արագ", correct: false },
      { textEs: "hermoso", textHy: "գեղեցիկ", correct: false }
    ],
    explanationEs: "El antónimo de 'grande' es 'pequeño' (grande ↔ pequeño).",
    explanationHy: "Grande (մեծ) բառի հականիշն է pequeño (փոքր)։"
  },
  {
    id: "q-4",
    questionEs: "'Vaca' (animal) y 'baca' (portaequipajes) son palabras:",
    questionHy: "«Vaca» (կով) և «baca» (բեռնակիր) բառերը հանդիսանում են՝",
    options: [
      { textEs: "Homófonas (նույնահունչ բառեր)", textHy: "Նույնահունչ (հնչում են նույն կերպ, գրվում տարբեր)", correct: true },
      { textEs: "Sinónimas (հոմանիշներ)", textHy: "Հոմանիշներ", correct: false },
      { textEs: "Antónimas (հականիշներ)", textHy: "Հականիշներ", correct: false },
      { textEs: "Monosémicas (մենիմաստ)", textHy: "Մենիմաստ բառեր", correct: false }
    ],
    explanationEs: "Las homófonas suenan igual pero se escriben diferente y tienen distinto significado.",
    explanationHy: "Homófonas-ը հնչում են նույն կամ շատ նման, բայց գրվում են տարբեր կերպ և ունեն տարբեր իմաստ (vaca vs baca, hola vs ola)։"
  },
  {
    id: "q-5",
    questionEs: "En 'Tiene un corazón de oro', ¿qué tipo de sentido se utiliza?",
    questionHy: "«Tiene un corazón de oro» արտահայտության մեջ ո՞ր իմաստն է գործածված։",
    options: [
      { textEs: "Sentido literal (ուղղակի իմաստ)", textHy: "Ուղղակի իմաստ (իսկապես ոսկուց սիրտ)", correct: false },
      { textEs: "Sentido figurado (փոխաբերական իմաստ)", textHy: "Փոխաբերական իմաստ (նշանակում է շատ բարի անձնավորություն)", correct: true },
      { textEs: "Monosemia", textHy: "Մենիմաստություն", correct: false },
      { textEs: "Familia léxica", textHy: "Բառակազմական ընտանիք", correct: false }
    ],
    explanationEs: "Es sentido figurado: no significa que su corazón sea de metal, sino que es una persona muy buena.",
    explanationHy: "Սա փոխաբերական իմաստ է (sentido figurado)՝ ցույց է տալիս անսահման բարի բնավորություն։"
  },
  {
    id: "q-6",
    questionEs: "¿Qué comparten las palabras de una familia léxica?",
    questionHy: "Ի՞նչն է ընդհանուր բառակազմական ընտանիքի (familia léxica) բառերի համար։",
    options: [
      { textEs: "Comparten la misma raíz (նույն արմատը)", textHy: "Նրանք ունեն նույն արմատը (օր.՝ pan, panadero, panadería)", correct: true },
      { textEs: "Tienen significados contrarios", textHy: "Ունեն հակադիր իմաստ", correct: false },
      { textEs: "Se escriben exactamente igual pero significan cosas distintas", textHy: "Գրվում են նույնությամբ", correct: false },
      { textEs: "Pertenecen sólo a la ciencia", textHy: "Միայն գիտական տերմիններ են", correct: false }
    ],
    explanationEs: "Una familia léxica está formada por palabras que comparten la misma raíz: pan, panadero, panadería.",
    explanationHy: "Բառակազմական ընտանիքի (familia léxica) բառերը կազմված են նույն արմատից (pan, panadero, panadería, panificadora)։"
  }
];
