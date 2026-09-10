import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { species, regions, speciesRegions } from "./schema";
import { resolveDbCredentials } from "./config";

/** Los 13 municipios del estado de Campeche (orden y claves INEGI, entidad 04). */
const MUNICIPIOS = [
  { slug: "calkini", name: "Calkiní", seat: "Calkiní", inegiKey: "001" },
  { slug: "campeche", name: "Campeche", seat: "San Francisco de Campeche", inegiKey: "002" },
  { slug: "carmen", name: "Carmen", seat: "Ciudad del Carmen", inegiKey: "003" },
  { slug: "champoton", name: "Champotón", seat: "Champotón", inegiKey: "004" },
  { slug: "hecelchakan", name: "Hecelchakán", seat: "Hecelchakán", inegiKey: "005" },
  { slug: "hopelchen", name: "Hopelchén", seat: "Hopelchén", inegiKey: "006" },
  { slug: "palizada", name: "Palizada", seat: "Palizada", inegiKey: "007" },
  { slug: "tenabo", name: "Tenabo", seat: "Tenabo", inegiKey: "008" },
  { slug: "escarcega", name: "Escárcega", seat: "Escárcega", inegiKey: "009" },
  { slug: "calakmul", name: "Calakmul", seat: "Xpujil", inegiKey: "010" },
  { slug: "candelaria", name: "Candelaria", seat: "Candelaria", inegiKey: "011" },
  { slug: "seybaplaya", name: "Seybaplaya", seat: "Seybaplaya", inegiKey: "012" },
  { slug: "dzitbalche", name: "Dzitbalché", seat: "Dzitbalché", inegiKey: "013" },
] as const;

type SpeciesSeed = typeof species.$inferInsert & { regionSlugs: string[] };

const SPECIES: SpeciesSeed[] = [
  {
    slug: "jaguar",
    commonNameEs: "Jaguar",
    genus: "Panthera",
    speciesEpithet: "onca",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    conservationStatus: "NT",
    category: "mamiferos",
    presenceType: "native",
    mayaName: "Balam",
    description:
      "El felino más grande del continente americano y el tercero del mundo. En la península de Yucatán encuentra en la Selva Maya de Calakmul su último gran refugio: un corredor biológico transfronterizo que conecta Campeche con Guatemala y Belice. Depredador tope, regula las poblaciones de pecarí, venado y tepezcuintle; su presencia es indicador de un ecosistema íntegro. En México está catalogado como En Peligro (En) por la NOM-059-SEMARNAT-2010 y su cacería está prohibida desde 1987. La fragmentación del hábitat por la frontera agrícola, los atropellamientos en la carretera Escárcega–Xpujil y el conflicto con la ganadería son sus principales amenazas.",
    kidDescription:
      "El jaguar es el gato más grande de toda América y vive escondido en la selva de Campeche. Camina sin hacer ni un ruidito, nada muy bien y le encanta trepar a las ramas para mirarlo todo desde arriba. Su pelaje dorado con manchas parece un cielo lleno de estrellas. Hoy quedan pocos jaguares porque su selva se está haciendo pequeña, así que cuidar los árboles grandes es también cuidar al jaguar.",
    funFact:
      "Cada jaguar tiene un dibujo de manchas único: no hay dos iguales, como pasa con nuestras huellas digitales.",
    habitat:
      "Selva mediana y alta subperennifolia, selva baja inundable y acahuales maduros, entre el nivel del mar y los 900 m. Requiere cuerpos de agua permanentes y territorios extensos —de 25 a más de 100 km² por individuo—, por lo que depende de macizos forestales continuos como el que forman la Reserva de la Biosfera Calakmul y la región de Balam-Kú.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Standing_jaguar.jpg/1280px-Standing_jaguar.jpg",
    regionSlugs: ["calakmul", "candelaria", "champoton", "hopelchen"],
  },
  {
    slug: "mono-aullador-negro",
    commonNameEs: "Mono aullador negro / saraguato",
    genus: "Alouatta",
    speciesEpithet: "pigra",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Primates",
    family: "Atelidae",
    conservationStatus: "EN",
    category: "mamiferos",
    presenceType: "endemic",
    mayaName: "Batz'",
    description:
      "Primate endémico de la selva del sureste de México, Guatemala y Belice, y una de las especies de mono más grandes del Nuevo Mundo. Su llamado gutural, audible a más de tres kilómetros, delimita el territorio de la tropa al amanecer y al atardecer. Folívoro casi estricto, actúa como dispersor de semillas de higuerones y otras especies clave de la selva. Está catalogado En Peligro por la UICN y por la NOM-059; la tala selectiva, los incendios y el tráfico de crías para mascota han reducido y aislado sus poblaciones en Campeche.",
    kidDescription:
      "Cuando sale el sol, el saraguato saluda al día con un rugido tan fuerte que parece que hay un león escondido entre los árboles. Vive en familia allá arriba, en lo más alto de la selva, y casi nunca baja al suelo: usa su cola larga como si fuera otra mano para colgarse. Come hojas, flores y frutas, y sin darse cuenta va sembrando árboles nuevos por toda la selva. Quedan pocos y necesitan que los árboles sigan conectados para poder viajar de rama en rama.",
    funFact:
      "Su aullido es uno de los sonidos más fuertes que hace cualquier animal terrestre del planeta.",
    habitat:
      "Dosel de selva alta y mediana perennifolia y subperennifolia, selva de galería y manglar alto en la periferia de la Laguna de Términos. Es arborícola casi exclusivo: rara vez desciende al suelo y necesita continuidad del follaje para desplazarse entre parches.",
    imageUrl: null,
    regionSlugs: ["calakmul", "candelaria", "palizada"],
  },
  {
    slug: "tapir-centroamericano",
    commonNameEs: "Tapir centroamericano / danta",
    genus: "Tapirus",
    speciesEpithet: "bairdii",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Perissodactyla",
    family: "Tapiridae",
    conservationStatus: "EN",
    category: "mamiferos",
    presenceType: "native",
    mayaName: "Tzimín",
    description:
      "El mamífero terrestre nativo más grande de Mesoamérica, con hasta 300 kg de peso. Pariente lejano de caballos y rinocerontes, es un linaje que ha cambiado poco en millones de años. Herbívoro ramoneador y nadador consumado, dispersa semillas grandes que ninguna otra especie mueve, por lo que se le llama \"jardinero de la selva\". Está catalogado En Peligro por la UICN y en Peligro de Extinción por la NOM-059. Su baja tasa reproductiva —una cría cada dos años— lo hace muy vulnerable a la cacería y a la pérdida de selva.",
    kidDescription:
      "El tapir es como un primo lejano y muy antiguo del caballo y del rinoceronte: ¡casi no ha cambiado en millones de años! Tiene una naricita larga y movediza que usa como manita para agarrar hojas. Le encanta el agua: se mete a los charcos para refrescarse y hasta sabe bucear. Cuando come frutas grandes, esparce las semillas por toda la selva; por eso lo llaman el jardinero del bosque. Quedan muy poquitos y tienen una sola cría cada dos años, así que cada tapir cuenta.",
    funFact:
      "En maya el tapir se llama tzimín, y de ahí viene el nombre del municipio yucateco de Tizimín, que significa “lugar de tapires”. Cuando los españoles llegaron con sus caballos —un animal que nadie por aquí había visto—, los mayas los llamaron con esa misma palabra por su tamaño y sus pezuñas; por eso hoy tzimín quiere decir “caballo”. (Y los tapires bebés, además, nacen rayados y con puntitos, como una sandía con patas.)",
    habitat:
      "Selva alta y mediana perennifolia con cuerpos de agua permanentes, bajos inundables (akalché) y pantanos. Depende de aguadas y lagunas para termorregularse y refugiarse; en Campeche se concentra en el bloque forestal de Calakmul y Balam-Kú.",
    imageUrl: null,
    regionSlugs: ["calakmul", "candelaria", "escarcega"],
  },
  {
    slug: "pavo-ocelado",
    commonNameEs: "Pavo ocelado",
    genus: "Meleagris",
    speciesEpithet: "ocellata",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Aves",
    order: "Galliformes",
    family: "Phasianidae",
    conservationStatus: "NT",
    category: "aves",
    presenceType: "endemic",
    mayaName: "Kuts",
    description:
      "Galliforme endémico de la península de Yucatán: sólo habita en Campeche, Yucatán y Quintana Roo, más el norte de Guatemala y Belice. A diferencia del guajolote norteño, carece de barba y luce un plumaje bronce-verde iridiscente y una cabeza azul sin plumas con carúnculas anaranjadas que se hinchan durante el cortejo. Su cola ostenta ocelos —manchas circulares azules con borde bronce— que le dan el nombre. Forrajea en el suelo semillas, frutos e insectos, y se percha en árboles para dormir. Está catalogado como Casi Amenazado por la UICN; la cacería de subsistencia y la pérdida de selva por la frontera agrícola presionan sus poblaciones.",
    kidDescription:
      "El pavo ocelado es un guajolote de lujo que sólo vive en las selvas de la península de Yucatán y en ningún otro lugar del mundo. Su plumaje brilla como el aceite en un charco, con verdes, azules y dorados, y su cola tiene círculos que parecen ojitos. Camina en familia buscando semillas y frutas, y por la noche vuela a dormir a lo alto de un árbol. Al amanecer los machos hacen un canto burbujeante para saludarse.",
    funFact:
      "Los machos tienen bolitas anaranjadas en la cabeza azul que se inflan y brillan más cuando quieren llamar la atención en época de cortejo.",
    habitat:
      "Selva mediana y alta subperennifolia, acahuales, sabanas y bordes de selva con claros. Necesita árboles altos para dormir a salvo y zonas abiertas con semillas y brotes para alimentarse; es especialmente abundante en la región de Calakmul.",
    imageUrl: null,
    regionSlugs: ["calakmul", "candelaria", "hopelchen", "champoton"],
  },
  {
    slug: "cocodrilo-de-pantano",
    commonNameEs: "Cocodrilo de pantano",
    genus: "Crocodylus",
    speciesEpithet: "moreletii",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Reptilia",
    order: "Crocodilia",
    family: "Crocodylidae",
    conservationStatus: "LC",
    category: "reptiles",
    presenceType: "native",
    mayaName: "Áayin",
    description:
      "Cocodrilo de agua dulce de tamaño moderado (rara vez supera los 3 m) y hocico ancho, propio de la vertiente atlántica de México, Belice y Guatemala. Estuvo al borde de la desaparición a mediados del siglo XX por la cacería para peletería; tras décadas de protección se recuperó y hoy la UICN lo considera de Preocupación Menor, aunque en México sigue sujeto a protección especial (Pr) por la NOM-059. Es un depredador clave de humedales: controla peces, tortugas y crustáceos, y sus nidos y cuevas crean microhábitats para otras especies.",
    kidDescription:
      "El cocodrilo de pantano vive en las lagunas, ríos lentos y pantanos de Campeche, siempre en agua dulce. Es más pequeño que otros cocodrilos y tiene el hocico ancho, como una sonrisa. Es una mamá muy dedicada: cuida el nido, ayuda a los bebés a salir del cascarón y los lleva al agua en su boca con muchísimo cuidado. Casi desapareció porque lo cazaban por su piel, pero se cuidó a tiempo y hoy le va bien.",
    funFact:
      "La temperatura del nido decide si los huevos serán machos o hembras: ni muy frío ni muy caliente, el punto justo cambia todo.",
    habitat:
      "Pantanos, aguadas, lagunas costeras de agua dulce y salobre, y tramos remansados de ríos como el Palizada, el Candelaria y el Champotón. Anida en montículos de vegetación cerca del agua y se refugia en cuevas que excava en las orillas.",
    imageUrl: null,
    regionSlugs: ["carmen", "palizada", "champoton", "candelaria", "calakmul"],
  },
  {
    slug: "ceiba",
    commonNameEs: "Ceiba / Yáax che’",
    genus: "Ceiba",
    speciesEpithet: "pentandra",
    kingdom: "Plantae",
    phylum: "Tracheophyta",
    class: "Magnoliopsida",
    order: "Malvales",
    family: "Malvaceae",
    conservationStatus: "LC",
    category: "flora",
    presenceType: "native",
    mayaName: "Yáax Che'",
    description:
      "Árbol emergente de la selva tropical que puede superar los 60 m de altura y desarrollar contrafuertes —raíces en forma de pared— de varios metros. Su tronco joven es verde y está cubierto de aguijones cónicos. Produce cápsulas con una fibra algodonosa, el kapok, que dispersa el viento. Es de amplia distribución en América tropical y África occidental, y de Preocupación Menor según la UICN. Para la cultura maya es el Yáax che’, el árbol sagrado que conecta el inframundo, la tierra y el cielo; por eso muchos ejemplares se dejan en pie en milpas y potreros.",
    kidDescription:
      "La ceiba es el árbol más alto de la selva de Campeche: puede medir como un edificio de veinte pisos. Sus raíces salen del suelo como paredes enormes donde cabe una persona. Para los mayas es un árbol sagrado, el Yáax che’, que une el cielo, la tierra y el mundo de abajo; por eso, aunque se tumbe todo alrededor, a la ceiba se le deja en pie. Sus flores se abren de noche y las visitan los murciélagos y las polillas.",
    funFact:
      "El algodón de sus frutos, el kapok, flota y no se moja fácil: se usó durante mucho tiempo para rellenar chalecos salvavidas y almohadas.",
    habitat:
      "Selva alta perennifolia y subperennifolia, vegetación secundaria madura y orillas de sabana; también sobrevive aislada en milpas y potreros por respeto cultural. Crece del nivel del mar hasta los 1 200 m, en suelos profundos y bien drenados.",
    imageUrl: null,
    regionSlugs: ["campeche", "calakmul", "candelaria", "escarcega", "hopelchen", "palizada"],
  },
  {
    slug: "manati-antillano",
    commonNameEs: "Manatí antillano",
    genus: "Trichechus",
    speciesEpithet: "manatus",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Sirenia",
    family: "Trichechidae",
    conservationStatus: "VU",
    category: "marino",
    presenceType: "native",
    mayaName: "Aj Tíl",
    mayaLanguage: "chontal",
    description:
      "Mamífero acuático herbívoro de hasta 3.5 m y 500 kg, pariente cercano de los elefantes. Habita aguas costeras cálidas, estuarios y ríos desde el sureste de Estados Unidos hasta Brasil. La UICN lo cataloga como Vulnerable y la NOM-059 lo considera En Peligro de Extinción en México. En Campeche, la Laguna de Términos y las desembocaduras de los ríos Palizada, Candelaria y Champotón concentran una de las poblaciones más importantes del Golfo. Los golpes de embarcación, el enmalle en redes y la pérdida de pastos marinos son sus mayores amenazas.",
    kidDescription:
      "El manatí es un gigante bueno que pasa el día comiendo plantas bajo el agua, despacito, como una vaca marina. No tiene patas traseras: se impulsa con una cola plana en forma de remo. Vive en la Laguna de Términos y en las bocas de los ríos de Campeche, donde el agua del río se junta con la del mar. En esa parte del estado se habla maya chontal, una lengua distinta del maya yucateco del resto de Campeche, y ahí al manatí se le dice “Aj Tíl”. Las lanchas rápidas y las redes olvidadas son su mayor peligro, por eso hay zonas donde los barcos deben ir muy despacio.",
    funFact:
      "Come cada día casi la décima parte de su propio peso en pasto marino; los marineros antiguos que creían ver sirenas seguramente estaban viendo manatíes.",
    habitat:
      "Aguas someras y cálidas: la Laguna de Términos, esteros, manglares y los tramos bajos de ríos de agua dulce y salobre, siempre donde crecen pastos marinos y plantas acuáticas. Busca ojos de agua dulce para beber y zonas resguardadas para descansar.",
    imageUrl: null,
    regionSlugs: ["carmen", "palizada", "champoton"],
  },
  {
    slug: "chara-yucateca",
    commonNameEs: "Chara yucateca",
    genus: "Cyanocorax",
    speciesEpithet: "yucatanicus",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Aves",
    order: "Passeriformes",
    family: "Corvidae",
    conservationStatus: "LC",
    category: "aves",
    presenceType: "endemic",
    mayaName: "Ch'eel",
    description:
      "Ave de la familia de los cuervos y las urracas, endémica de la península de Yucatán: se distribuye por Campeche, Yucatán, Quintana Roo, el norte de Belice y el Petén guatemalteco. El adulto mide unos 30 cm, con la cabeza, el pecho y el vientre de un negro aterciopelado y la espalda, las alas y la cola de azul cobalto intenso; el pico es negro. Los juveniles son muy distintos: nacen con el plumaje claro, el pico y el anillo ocular amarillos, y van perdiendo ese amarillo con la edad. Es gregaria, ruidosa y omnívora —insectos, frutos, huevos y pequeños vertebrados— y forma grupos familiares que colaboran en la crianza. Frecuenta selva baja caducifolia, selva mediana, bordes de bosque y acahuales, y es habitual en zonas arqueológicas. La UICN la considera de Preocupación Menor.",
    kidDescription:
      "La chara yucateca es prima de los cuervos y sólo vive en la península de Yucatán. De grande es negra como el terciopelo, con la espalda, las alas y la cola de un azul intenso, como el cielo justo antes de la noche. Pero de pequeña se ve totalmente distinta: nace clarita, con el pico y un anillo alrededor del ojo amarillos, y poco a poco se va cambiando de disfraz hasta quedar azul y negra. Anda en pandilla, hace mucho escándalo y toda la familia ayuda a cuidar a los pollitos. Es una de las aves preferidas de quienes vienen a Campeche a mirar pájaros.",
    funFact:
      "De cría es clarita con el pico amarillo y de adulta es negra con azul cobalto: es como si el mismo pájaro se cambiara de disfraz al crecer.",
    habitat:
      "Selva baja caducifolia, selva mediana subcaducifolia, bordes de bosque y acahuales; muy frecuente entre las ruinas de las zonas arqueológicas. Se mueve en grupos familiares por el sotobosque y los árboles medianos.",
    imageUrl: null,
    regionSlugs: [
      "calakmul",
      "hopelchen",
      "champoton",
      "hecelchakan",
      "campeche",
      "candelaria",
    ],
  },
  {
    slug: "carpintero-yucateco",
    commonNameEs: "Carpintero yucateco",
    genus: "Melanerpes",
    speciesEpithet: "pygmaeus",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Aves",
    order: "Piciformes",
    family: "Picidae",
    conservationStatus: "LC",
    category: "aves",
    presenceType: "endemic",
    mayaName: "Ch'ojom",
    description:
      "El más pequeño de los carpinteros de México (unos 16 cm) y el más común de la península de Yucatán, con una población menor en el norte de Honduras. Dorso barrado en blanco y negro, cara y vientre de tono ante y una banda roja en la cabeza: en el macho cubre corona y nuca, y en la hembra sólo la nuca. Excava sus nidos en troncos y ramas muertas de muchas especies de árboles, y esos huecos, al quedar libres, son ocupados por lechuzas, golondrinas, trepatroncos y otras aves que no pueden excavar los suyos; por eso se le llama “ingeniero de ecosistemas”. Come insectos, arañas, frutos y néctar. Habita selvas, acahuales, manglares y jardines arbolados. UICN: Preocupación Menor. En maya también se le dice Ch'elom.",
    kidDescription:
      "El carpintero yucateco es un pajarito chiquito que vive sólo en la península de Yucatán. Tiene la espalda a rayas blancas y negras y un gorrito rojo: completo en los papás y más pequeño en las mamás. Con el pico hace agujeros en los troncos secos para armar su casa, y cuando se muda, esos agujeros los aprovechan búhos, golondrinas y otros animales que no saben excavar. Por eso decimos que construye casas para todo el vecindario. Además no canta con la voz: “canta” tamborileando muy rápido con el pico sobre la madera.",
    funFact:
      "No canta con la voz: “canta” tamborileando el pico contra la madera a toda velocidad, y sus agujeros viejos se vuelven casa de búhos, golondrinas y otros animales.",
    habitat:
      "Selvas altas y medianas, acahuales, manglares y jardines con árboles maduros; es el carpintero que se ve con más facilidad en cualquier rincón arbolado de Campeche. Necesita troncos y ramas muertas en pie para excavar.",
    imageUrl: null,
    regionSlugs: [
      "campeche",
      "champoton",
      "calakmul",
      "hopelchen",
      "carmen",
      "hecelchakan",
      "calkini",
    ],
  },
  {
    slug: "pizote",
    commonNameEs: "Pizote / Tejón",
    genus: "Nasua",
    speciesEpithet: "narica",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Procyonidae",
    conservationStatus: "LC",
    category: "mamiferos",
    presenceType: "native",
    mayaName: "Chi'ik",
    description:
      "Carnívoro emparentado con el mapache, de cuerpo esbelto, hocico largo y móvil y cola larga con anillos claros y oscuros que suele llevar erguida como una antena. Tiene una “máscara” pálida alrededor de los ojos y el hocico. Se distribuye desde el suroeste de Estados Unidos hasta Colombia, así que no es exclusivo de Campeche. Es omnívoro y forrajea sobre todo en el suelo, hurgando la hojarasca con la nariz en busca de invertebrados, frutos, huevos y pequeños vertebrados. Las hembras y las crías viven en bandas de hasta 25–30 individuos, mientras que los machos adultos son solitarios. Ocupa todos los ambientes boscosos del estado, del manglar a la selva húmeda y seca, y es frecuente en Calakmul. UICN: Preocupación Menor.",
    kidDescription:
      "El pizote es primo del mapache y se pasea por casi toda Campeche con la cola levantada, llena de anillos, como si llevara una banderita. Tiene una nariz larga y movediza que mete entre las hojas del suelo para encontrar bichos, frutas y huevitos: es su herramienta favorita. Las mamás y las crías andan en pandillas grandes, de hasta treinta, jugando y buscando comida juntas; los papás grandes, en cambio, prefieren andar solitos. No vive sólo aquí: también habita desde Estados Unidos hasta Colombia.",
    funFact:
      "Su nariz larga y flexible es su navaja suiza: huele, escarba la hojarasca y saca comida de los huecos. Las hembras y crías andan en grupos de hasta 30; los machos grandes, solos.",
    habitat:
      "Todos los ambientes con árboles de Campeche: manglar, selva húmeda y selva seca, acahuales y bordes de milpa. Muy común en la Reserva de la Biosfera Calakmul. Duerme y cría en los árboles y busca comida en el suelo.",
    imageUrl: null,
    regionSlugs: [
      "calakmul",
      "candelaria",
      "escarcega",
      "champoton",
      "hopelchen",
      "carmen",
    ],
  },
  {
    slug: "puma",
    commonNameEs: "Puma",
    genus: "Puma",
    speciesEpithet: "concolor",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    conservationStatus: "LC",
    category: "mamiferos",
    presenceType: "native",
    mayaName: "Kab-kòh",
    description:
      "Segundo felino más grande de América después del jaguar y el de mayor distribución del continente: desde Canadá hasta la Patagonia. El adulto no tiene manchas —el pelaje es de un pardo grisáceo a pardo rojizo uniforme, con el vientre claro y la cola larga rematada en negro—; sólo los cachorros nacen moteados. Es un cazador solitario y sigiloso que se alimenta sobre todo de venado, pecarí y presas medianas. En Campeche comparte la selva con el jaguar y suele ocupar zonas algo más abiertas o de menor cobertura. La UICN lo considera de Preocupación Menor a escala global, aunque a nivel local depende de que haya selva y presas suficientes.",
    kidDescription:
      "El puma es el segundo gato más grande de América, después del jaguar, y el que vive en más países: lo hay desde Canadá hasta el sur de Argentina. De adulto no tiene manchas: es de un solo color, café grisáceo o café rojizo, con la punta de la cola oscura. Es callado y solitario, y camina por la selva de Campeche buscando venados. Aunque en el mundo le va bien, aquí necesita que la selva siga grande y con animales para comer.",
    funFact:
      "Salta más de 5 metros hacia arriba y hasta 12 de largo: es uno de los mejores saltadores de todo el reino animal.",
    habitat:
      "Selva alta, mediana y baja, acahuales y zonas semiabiertas de todo el estado, muchas veces cerca de donde también hay jaguar. Necesita territorios grandes y suficientes presas —venado, pecarí, tepezcuintle— para mantenerse.",
    imageUrl: null,
    regionSlugs: [
      "calakmul",
      "candelaria",
      "escarcega",
      "champoton",
      "hopelchen",
      "carmen",
    ],
  },
  {
    slug: "ocelote",
    commonNameEs: "Ocelote",
    genus: "Leopardus",
    speciesEpithet: "pardalis",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    family: "Felidae",
    conservationStatus: "LC",
    category: "mamiferos",
    presenceType: "native",
    mayaName: "Chak-mool",
    description:
      "Felino manchado de tamaño mediano (mucho menor que el jaguar), con el fondo del pelaje amarillento a gris y un patrón de rosetas abiertas y cadenas de manchas alargadas, único en cada individuo; el vientre es blanco con manchas negras. Es principalmente nocturno y buen trepador y nadador. La UICN lo cataloga como de Preocupación Menor a escala global, pero en México la NOM-059-SEMARNAT lo considera En Peligro de Extinción y está en el Apéndice I de la CITES, que prohíbe su comercio internacional. La pérdida de selva, los atropellamientos y el tráfico de pieles y de crías son sus principales amenazas en Campeche.",
    kidDescription:
      "El ocelote es como un jaguar en pequeño: un gato manchado del tamaño de un perro mediano, con el vientre blanco y un dibujo de rosetas distinto en cada uno, como una huella digital. Sale de noche, trepa y nada muy bien. En el mundo todavía hay bastantes, pero en México le va mal: la ley mexicana lo considera En Peligro de Extinción porque aquí quedan pocos y perder selva le hace mucho daño. Ver uno es un regalo poco común.",
    funFact:
      "Aunque la lista mundial dice que al ocelote le va bien, en México la norma oficial NOM-059 lo tiene como En Peligro de Extinción: aquí sí necesita ayuda urgente.",
    habitat:
      "Selva alta y mediana con sotobosque denso, acahuales maduros y galerías de río; evita las zonas muy abiertas. En Campeche se le asocia sobre todo con la región de Calakmul y las selvas del sur. Es más nocturno donde hay gente cerca.",
    imageUrl: null,
    regionSlugs: [
      "calakmul",
      "candelaria",
      "escarcega",
      "hopelchen",
      "champoton",
      "carmen",
    ],
  },
  {
    slug: "iguana-verde",
    commonNameEs: "Iguana verde",
    genus: "Iguana",
    speciesEpithet: "iguana",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Reptilia",
    order: "Squamata",
    family: "Iguanidae",
    conservationStatus: "LC",
    category: "reptiles",
    presenceType: "native",
    mayaName: "T'oh",
    description:
      "Lagarto grande y herbívoro, con una cresta de espinas a lo largo del dorso, una papada (gular) que despliega para comunicarse y termorregular, y una cola larga y anillada que usa como látigo y como timón al nadar. Las crías son de un verde intenso que se vuelve más grisáceo o pardo con la edad. La UICN la considera de Preocupación Menor, pero en México la NOM-059-SEMARNAT la incluye como Sujeta a Protección Especial y está en el Apéndice II de la CITES, por la presión del comercio de mascotas y el consumo de carne y huevos. En Campeche es común en la costa, los manglares y los bordes de selva.",
    kidDescription:
      "La iguana verde es un lagarto grande que come plantas y toma el sol en las ramas junto al agua. Tiene una fila de espinas en la espalda y una bolsa debajo de la barbilla que infla para saludar o para asustar. De bebé es verde brillante y de grande se pone más grisácea. En México está en una lista de especies que hay que proteger (NOM-059, Sujeta a Protección Especial), porque mucha gente la atrapa para venderla o comerla.",
    funFact:
      "Si algo la asusta arriba de un árbol, se deja caer al agua desde varios metros y escapa nadando, moviendo la cola aplanada como un remo.",
    habitat:
      "Manglares, vegetación de la costa, bordes de selva y orillas de ríos y lagunas; siempre cerca del agua y con árboles altos para asolearse y dormir. Muy frecuente en el litoral y en la Laguna de Términos.",
    imageUrl: null,
    regionSlugs: [
      "campeche",
      "champoton",
      "carmen",
      "calkini",
      "tenabo",
      "hecelchakan",
      "palizada",
    ],
  },
  {
    slug: "sapo-gigante",
    commonNameEs: "Sapo gigante",
    genus: "Rhinella",
    speciesEpithet: "marina",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Amphibia",
    order: "Anura",
    family: "Bufonidae",
    conservationStatus: "LC",
    category: "anfibios",
    presenceType: "native",
    mayaName: "Uo",
    description:
      "Anfibio de gran tamaño (puede pasar los 15 cm), de cuerpo robusto y piel seca y verrugosa de tono café a oliváceo. Detrás de la cabeza tiene dos glándulas parotoides grandes y triangulares que segregan un veneno lechoso (bufotoxinas) como defensa. Es de hábitos nocturnos y muy oportunista: come insectos, otros invertebrados y hasta pequeños vertebrados. En Campeche es abundante cerca de cuerpos de agua y asentamientos humanos. La UICN lo considera de Preocupación Menor; en su rango nativo cumple un papel de control de plagas.",
    kidDescription:
      "El sapo gigante es un sapo muy grande, del tamaño de un plato pequeño, con la piel llena de bultitos y dos bolsas grandes detrás de los ojos. En la cultura maya se le relaciona con la lluvia y con que la tierra dé frutos. Ojo: esas bolsas guardan un veneno tan fuerte que puede enfermar a un perro que lo muerda, así que a este amigo se le mira, no se le toca.",
    funFact:
      "En la cosmología maya se asocia con la lluvia y la fertilidad; su piel segrega una toxina tan potente que puede enfermar hasta a un perro: mejor sólo mirarlo.",
    habitat:
      "Orillas de charcas, aguadas, canales y jardines, casi siempre cerca del agua y de donde vive la gente. De día se esconde bajo troncos, piedras u hojarasca húmeda y de noche sale a cazar bajo las luces.",
    imageUrl: null,
    regionSlugs: [
      "campeche",
      "champoton",
      "carmen",
      "escarcega",
      "candelaria",
      "palizada",
      "calkini",
    ],
  },
  {
    slug: "cangrejo-violinista",
    commonNameEs: "Cangrejo violinista",
    genus: "Uca",
    speciesEpithet: "sp.",
    kingdom: "Animalia",
    phylum: "Arthropoda",
    class: "Malacostraca",
    order: "Decapoda",
    family: "Ocypodidae",
    conservationStatus: "NE",
    category: "crustaceos",
    presenceType: "native",
    mayaName: "Chichim",
    description:
      "Cangrejo pequeño de las planicies lodosas y los manglares del litoral. Presenta un marcado dimorfismo: el macho tiene una pinza enormemente agrandada y de color llamativo —que agita para cortejar a las hembras y para intimidar a otros machos— y otra diminuta para alimentarse; las hembras tienen las dos pinzas pequeñas e iguales. Vive en galerías que excava en el lodo y sale con la marea baja a filtrar materia orgánica del sedimento, un trabajo que oxigena y limpia el suelo del manglar. No ha sido evaluado por la UICN ni por la NOM-059.",
    kidDescription:
      "El cangrejo violinista es chiquito y vive en el lodo de los manglares. Los machos tienen una pinza gigante y de color, casi tan grande como su cuerpo, que mueven en el aire como si tocaran un violín para llamar la atención; la otra pinza es diminuta. Las hembras tienen las dos pequeñas e iguales. Cavan casitas en el lodo y, al remover el suelo buscando comida, lo mantienen limpio y aireado para todo el manglar.",
    funFact:
      "Cuando baja la marea salen por miles al mismo tiempo y cubren la playa de lodo como una alfombra que se mueve.",
    habitat:
      "Planicies de lodo, esteros y bordes de manglar de la costa, sobre todo alrededor de la Laguna de Términos y en las desembocaduras de los ríos. Necesita suelo blando para excavar y el vaivén de la marea para comer.",
    imageUrl: null,
    regionSlugs: ["carmen", "champoton", "campeche", "palizada", "calkini"],
  },
  {
    slug: "rubia",
    commonNameEs: "Rubia (pargo)",
    genus: "Ocyurus",
    speciesEpithet: "chrysurus",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Actinopterygii",
    order: "Perciformes",
    family: "Lutjanidae",
    conservationStatus: "LC",
    category: "marino",
    presenceType: "native",
    marineZone: "la Sonda de Campeche y los arrecifes de Cayo Arcas",
    description:
      "Pez de arrecife de cuerpo fusiforme y plateado, con una franja amarilla brillante que recorre el cuerpo del hocico a la cola y aletas de color amarillo intenso; la cola es profundamente ahorquillada. Forma cardúmenes numerosos que se desplazan a gran velocidad sobre el arrecife y los pastos marinos, donde se alimenta de peces pequeños, crustáceos y plancton. Es una especie de importancia pesquera en el Golfo de México. La UICN la considera de Preocupación Menor. En Campeche habita mar adentro, en los arrecifes de Cayo Arcas y el resto de la Sonda de Campeche, no en aguas de tierra firme.",
    kidDescription:
      "La rubia es un pez plateado con una raya amarilla que va de la nariz a la cola y aletas amarillas muy vivas. No vive en los ríos ni en la laguna, sino mar adentro, sobre los arrecifes de Cayo Arcas, lejos de la costa. Nada en cardúmenes enormes y rapidísimos que giran todos juntos, como una sola nube de plata y oro moviéndose sobre el coral.",
    funFact:
      "Nadan en cardúmenes de cientos que se mueven como un solo cuerpo: de lejos parecen una nube de plata y oro flotando sobre el arrecife.",
    habitat:
      "Arrecifes de coral, fondos rocosos y pastos marinos de mar abierto, entre 10 y 70 m de profundidad. En Campeche, los arrecifes de Cayo Arcas y la Sonda de Campeche; de día ronda el arrecife en cardumen y de noche se dispersa a cazar.",
    imageUrl: null,
    regionSlugs: ["carmen", "champoton", "campeche"],
  },
  {
    slug: "coral-cerebro-de-roca",
    commonNameEs: "Coral cerebro de roca",
    genus: "Colpophyllia",
    speciesEpithet: "natans",
    kingdom: "Animalia",
    phylum: "Cnidaria",
    class: "Anthozoa",
    order: "Scleractinia",
    family: "Mussidae",
    conservationStatus: "VU",
    category: "marino",
    presenceType: "native",
    marineZone: "los arrecifes de Cayo Arcas, en la Sonda de Campeche",
    description:
      "Coral pétreo colonial que forma domos redondeados de hasta 2 m de diámetro, recorridos por valles y crestas sinuosas que le dan aspecto de cerebro. Cada colonia está formada por miles de pólipos diminutos emparentados con las anémonas y las medusas; en sus tejidos viven algas microscópicas (zooxantelas) que, mediante fotosíntesis, le aportan hasta el 90 % de su alimento. Construye arrecife, el hábitat de miles de otras especies. La UICN lo cataloga como Vulnerable y en México está Sujeto a Protección Especial (NOM-059) y en el Apéndice II de la CITES; el calentamiento del mar, que provoca su blanqueamiento, es su mayor amenaza.",
    kidDescription:
      "El coral cerebro de roca no es una piedra: es un animal, o mejor dicho, una ciudad de miles de animalitos diminutos, primos de las medusas, viviendo juntos. Su forma de domo con surcos parece un cerebro gigante. Dentro de él viven algas muy pequeñas que le hacen casi toda la comida usando la luz del sol, como plantas. Vive sólo en los arrecifes de Cayo Arcas, mar adentro. El mar cada vez más caliente lo pone blanco y lo enferma; por eso en México es una especie protegida.",
    funFact:
      "Es un animal solar: obtiene hasta el 90 % de su comida de unas algas diminutas que viven dentro de él y hacen fotosíntesis con la luz del sol.",
    habitat:
      "Arrecifes de coral de aguas cálidas, claras y poco profundas. En Campeche sólo existe en los arrecifes de Cayo Arcas, en la Sonda de Campeche, a más de 100 km de la costa. Crece muy despacio, apenas unos milímetros al año.",
    imageUrl: null,
    regionSlugs: ["carmen", "champoton", "campeche"],
  },
  {
    slug: "mariposa-pavo-real-blanca",
    commonNameEs: "Mariposa pavo real blanca",
    genus: "Anartia",
    speciesEpithet: "jatrophae",
    kingdom: "Animalia",
    phylum: "Arthropoda",
    class: "Insecta",
    order: "Lepidoptera",
    family: "Nymphalidae",
    conservationStatus: "NE",
    category: "insectos",
    presenceType: "native",
    mayaName: "Péepen",
    description:
      "Mariposa diurna de tamaño mediano, de alas blanco perlado con líneas y manchas café claro y bordes ondulados; en las alas traseras luce dos ocelos grandes de aspecto de ojo, con anillo naranja y centro oscuro. Vuela bajo y lento en terrenos abiertos, jardines, orillas de camino y potreros, y liba néctar de flores pequeñas. Sus orugas se alimentan de plantas de las familias Acanthaceae y Verbenaceae. No ha sido evaluada por la UICN ni por la NOM-059: es muy común y sus poblaciones son estables.",
    kidDescription:
      "La mariposa pavo real blanca tiene las alas de color blanco perla con dibujos café, y en las alas de atrás dos manchas redondas que parecen ojos. Vuela bajito y despacio por jardines, caminos y potreros de toda Campeche. Es tan común que casi siempre hay una cerca cuando hace sol.",
    funFact:
      "Esos dos ojos de las alas de atrás son falsos: hacen que un pájaro pique ahí, lejos del cuerpo, y la mariposa escape con sólo un mordisco en el ala.",
    habitat:
      "Terrenos abiertos y soleados: jardines, orillas de camino, potreros, milpas y bordes de selva. Necesita flores para el néctar y plantas específicas (como las del género Ruellia) para que coman sus orugas.",
    imageUrl: null,
    regionSlugs: [
      "campeche",
      "champoton",
      "carmen",
      "calkini",
      "hecelchakan",
      "tenabo",
      "hopelchen",
      "escarcega",
    ],
  },
];

async function main() {
  const creds = resolveDbCredentials();
  console.log(
    `→ Sembrando en ${creds.url}${
      creds.url.startsWith("file:") ? "  (fallback local; sin Turso)" : "  (Turso)"
    }`,
  );

  // Limpieza en orden de dependencias.
  await db.delete(speciesRegions);
  await db.delete(species);
  await db.delete(regions);

  const insertedRegions = await db
    .insert(regions)
    .values(MUNICIPIOS.map((m) => ({ ...m })))
    .returning();
  const regionIdBySlug = new Map(insertedRegions.map((r) => [r.slug, r.id]));
  console.log(`✓ ${insertedRegions.length} municipios`);

  for (const { regionSlugs, ...row } of SPECIES) {
    const [inserted] = await db.insert(species).values(row).returning();
    const links = regionSlugs
      .map((slug) => regionIdBySlug.get(slug))
      .filter((id): id is number => typeof id === "number")
      .map((regionId) => ({ speciesId: inserted.id, regionId }));
    if (links.length) await db.insert(speciesRegions).values(links);
    console.log(`✓ ${inserted.commonNameEs}  ·  ${links.length} municipios`);
  }

  console.log("Seed completado.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
