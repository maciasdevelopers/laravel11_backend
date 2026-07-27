import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoActividadesRiesgoIMSS {
  private catalogo_de_actividades = [
    {key:'0',division:'0',label:'DIVISIÓN 0 AGRICULTURA, GANADERÍA, SILVICULTURA, PESCA Y CAZA',
      children: [
        {key:'0-0',grupo:"01", label:'GRUPO 01 AGRICULTURA',
          children: [
            {
              key:'0-0-0',
              fraccion:'011',
              actividad:'Agricultura.',
              clave:'III',
              descripcion:'Comprende a las empresas que realizan trabajos agrícolas, floricultura, fruticultura, horticultura, jardinería ornamental, ya sea que se realicen intramuros o bajo techo en invernáculos o viveros, así como aquellas empresas que prestan servicios tales como: preparación de la tierra, desmonte, cultivo, cosecha, empaque, fertilización (sin empleo de aeronaves), despepite de algodón, operación de sistemas de riego y otros. Excepto la fumigación clasificada en las fracciones 899 y 8910 y la fertilización con aeronaves clasificadas en la 8910.'
            }
          ]
        },
        {key:'0-1',grupo:"02", label:'GRUPO 02 GANADERÍA',
          children: [
            {
              key:'0-1-0',
              fraccion:'021',
              actividad:'Cría y explotación de ganado y otras clases de animales.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la cría y explotación de ganado vacuno, porcino, ovino, caprino, equino, así como a la avicultura, cunicultura y apicultura y a las que prestan servicios como desinfección y erradicación de plagas propias del ganado, inseminación artificial, esquila, ordeña, recolección de abono y otros servicios de ganadería.'
            },
          ]
        },
        {key:'0-2',grupo:"03", label:'GRUPO 03 SILVICULTURA',
          children: [
            {
              key:'0-2-0',
              fraccion:'031',
              actividad:'Explotación de bosques madereros; extracción de productos forestales no maderables y servicios de explotación forestal.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la plantación, repoblación y conservación de bosques, corte de árboles (excepto aserraderos), extracción de leña y cortezas, producción de carbón vegetal, extracción de chicle crudo y otras savias, recolección de frutas, flores, hongos, hierbas, carrizos y otras materias forestales silvestres. Incluye a las empresas que se dedican a prestar servicios de explotación forestal, tales como: estimación de volúmenes de madera, protección de bosques y otros.'
            }
          ]
        },
        {key:'0-3',grupo:"04", label:'GRUPO 04 PESCA',
          children: [
            {
              key:'0-3-0',
              fraccion:'041',
              actividad:'Pesca de altura y costera.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la pesca comercial y/o deportiva, de altura y costera. Incluye la pesca en esteros o estuarios.'
            },
            {
              key:'0-3-1',
              fraccion:'042',
              actividad:'Pesca en aguas interiores.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la pesca comercial y/o deportiva en aguas interiores, tales como: ríos, lagos, lagunas y otros. Incluye la recolección de plantas acuáticas; excepto la que se realice por medio de buceo o proveniente de la acuicultura, clasificadas por separado.'
            },
            {
              key:'0-3-2',
              fraccion:'043',
              actividad:'Acuicultura.',
              clave:'I',
              descripcion:'Comprende a las empresas acuícolas que se dedican a la conservación, mejoramiento, investigación, reproducción y comercialización de la fauna y flora acuática. No se consideran dentro de esta fracción los trabajos acuícolas por medio del buceo.'
            },
            {
              key:'0-3-3',
              fraccion:'044',
              actividad:'Trabajos de buceo.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican al buceo para fines de pesca comercial o deportiva, la recolección de algas, conchas, caracoles, corales y otros. Incluye a las empresas que se dedican a la acuicultura por medio del buceo; supervisión de instalaciones, estructuras y equipos bajo el agua; investigación, rescate y otros trabajos realizados por medio de buceo. Excepto los realizados en plataformas marinas, clasificados en la fracción 722.'
            },
          ]
        },
        {key:'0-4',grupo:"05", label:'GRUPO 05 CAZA',
          children: [
            {
              key:'0-4-0',
              fraccion:'050',
              actividad:'Caza.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la caza, captura y preservación de animales salvajes.'
            },
          ]
        },
      ]
    },
    {key:'1',division:'1',label:'DIVISIÓN 1 INDUSTRIAS EXTRACTIVAS',
      children:[
        {key:'1-0',grupo:"11",label:'GRUPO 11 EXTRACCIÓN Y BENEFICIO DE CARBÓN MINERAL, GRAFITO Y MINERALES NO METÁLICOS; EXCEPTO SAL',
          children:[
            {
              key:'1-0-0',
              fraccion:'111',
              actividad:'Extracción y beneficio de carbón mineral, grafito y minerales no metálicos en minas de profundidad.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la extracción a profundidad, con o sin beneficio de carbón mineral, grafito y otros minerales no metálicos; no se incluye la sal. Se considera también en esta fracción la extracción de azufre, excepto cuando este mineral se obtenga mediante la inyección de agua caliente, clasificada en la fracción 113.'
            },
            {
              key:'1-0-1',
              fraccion:'112',
              actividad:'Beneficio de minerales no metálicos.',
              clave:'V',
              descripcion:'Comprende a las empresas dedicadas al beneficio sin procesos de extracción de piedra caliza, yeso, arena, grava, mármol, piedras para construcción, arcillas, caolín, barro, barita, fluorita, sílice, roca fosfórica y otros minerales no metálicos; no se incluye la sal. Debe entenderse por "Beneficio" a las operaciones y tratamientos como trituración, molienda, pulverización, cribado, concentración, refinación y otros sistemas de beneficio de minerales no metálicos. Incluye la preparación o tratamiento de minerales de jales o desechos. Se consideran en esta fracción a las empresas que se dedican al beneficio de azufre, carbón mineral y/o grafito y a la fabricación de coque y productos derivados del carbón mineral.'
            },
            {
              key:'1-0-2',
              fraccion:'113',
              actividad:'Extracción y beneficio de azufre.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la extracción de azufre, con o sin beneficio, cuando el mineral se extraiga en forma líquida, mediante su previa disolución por la inyección de agua caliente.'
            },
            {
              key:'1-0-3',
              fraccion:'114',
              actividad:'Extracción y beneficio de minerales no metálicos, en minas a cielo abierto.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la extracción a cielo abierto, con o sin beneficio de piedra caliza, yeso, arena, grava, mármol, piedras para construcción, arcilla, caolín, barro, barita, fluorita, sílice, roca fosfórica y otros minerales no metálicos, excepto sal.'
            },
          ]
        },
        {key:'1-1',grupo:"12",label:'GRUPO 12 EXPLORACIÓN Y EXTRACCIÓN DE PETRÓLEO CRUDO Y GAS NATURAL',
          children:[
            {
              key:'1-1-0',
              fraccion:'121',
              actividad:'Exploración y extracción de petróleo crudo y gas natural.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la exploración y/o extracción de petróleo crudo y gas natural.'
            },
          ]
        },
        {key:'1-2',grupo:"13",label:'GRUPO 13 EXTRACCIÓN Y BENEFICIO DE MINERALES METÁLICOS',
          children:[
            {
              key:'1-2-0',
              fraccion:'131',
              actividad:'Extracción y beneficio de minerales metálicos, en minas de profundidad.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la extracción a profundidad, con o sin beneficio de hierro, oro, plata, mercurio, antimonio, cobre, plomo, zinc y otros minerales metálicos.'
            },
            {
              key:'1-2-1',
              fraccion:'132',
              actividad:'Beneficio de minerales metálicos.',
              clave:'V',
              descripcion:'Comprende a las empresas dedicadas al beneficio sin procesos de extracción de hierro, oro, plata, mercurio, antimonio, cobre, plomo, zinc y otros minerales metálicos.Debe entenderse por "Beneficio" a las operaciones y tratamientos como trituración, molienda, pulverización, cribado, concentración, calcinación, flotación, clasificación, lixiviación, aglomeración de concentrados (nódulos, pelets, briquetas y similares) y otros sistemas de beneficio de minerales metálicos. Excepto a las empresas dedicadas a la fundición, aleación, refinación, afinación de minerales metálicos para obtener productos primarios de hierro, acero y de metales no ferrosos (hierro de primera fusión, ferroaleaciones, lingotes, planchas o barras) y/o productos elaborados por laminación o vaciado, clasificadas en las fracciones 341 o 342.'
            },
            {
              key:'1-2-2',
              fraccion:'133',
              actividad:'Extracción y beneficio de minerales metálicos, en minas a cielo abierto.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la extracción a cielo abierto, con o sin beneficio de minerales de hierro, oro, plata, mercurio, antimonio, cobre, plomo, zinc y otros minerales metálicos.'
            },
          ]
        },
        {key:'1-3',grupo:"14",label:'GRUPO 14 EXPLOTACIÓN DE SAL',
          children:[
            {
              key:'1-3-0',
              fraccion:'141',
              actividad:'Explotación y/o beneficio de yacimientos de sal.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la explotación de salinas y yacimientos de sal, con o sin beneficio. Incluye la extracción de tequezquite y similares.'
            },
          ]
        }
      ]
    },
    {key:'2',division:'2',label:'DIVISIÓN 2 INDUSTRIAS DE TRANSFORMACIÓN',
      children:[
        {key:'2-0',grupo:"20",label:'GRUPO 20 ELABORACIÓN DE ALIMENTOS',
          children:[
            {
              key:'2-0-0',
              fraccion:'201',
              actividad:'Elaboración y preparación de productos alimenticios a base de frutas y legumbres, su conservación, envasado y/o empacado.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, envasado y/o empacado de encurtidos, jugos, mermeladas, ates, jaleas, frutas cubiertas o cristalizadas, salsas, sopas, alimentos colados y otros productos alimenticios a base de frutas y legumbres. Incluye la conservación de frutas y legumbres por deshidratación, congelación, cocción y otros procedimientos similares.'
            },
            {
              key:'2-0-1',
              fraccion:'202',
              actividad:'Beneficio de otros granos, fabricación y envasado.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al beneficio de café, cacao; tostado y molienda de café; fabricación y envasado de café soluble y té; desgrane, descascarado, limpieza, secado y pulido de arroz y otros granos, incluye la limpieza y envasado de lenteja, frijol, haba, garbanzo y otros productos agrícolas; así como el beneficio de especias. Excepto la fabricación de harinas clasificadas por separado en la fracción 2016.'
            },
            {
              key:'2-0-2',
              fraccion:'203',
              actividad:'Producción de azúcar.',
              clave:'V',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la producción de azúcar y productos residuales de caña o de remolacha. Incluye la refinación, cristalización o granulación y la elaboración de piloncillo, así como la destilación de alcohol etílico cuando se dé en forma simultánea con la producción de azúcar.'
            },
            {
              key:'2-0-3',
              fraccion:'204',
              actividad:'Matanza de ganado y aves.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la matanza de aves, ganado bovino, ovino, caprino, porcino, equino y otras especies. Incluye a las empresas que en forma simultánea con la matanza, realizan la preparación, conservación, envasado y/o empacado de carnes y sus derivados.'
            },
            {
              key:'2-0-4',
              fraccion:'205',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de carnes y sus derivados. ',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, envasado y/o empacado de carnes frías, embutidos, manteca de cerdo, sopas y otros productos derivados de carne. Incluye la deshidratación, congelación, salado, ahumado, envinagrado y otros procedimientos para conservar o preservar carnes y sus derivados, así como la elaboración de grenetinas como materia prima para otras industrias.'
            },
            {
              key:'2-0-5',
              fraccion:'206',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de productos lácteos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, conservación, envasado y/o empacado de cremas, mantequillas, quesos, leche condensada, evaporada, flanes, cajetas, yogures y otros productos a base de leche. Incluye la pasteurización, deshidratación, rehidratación, homogeneización, vitaminización y otros tratamientos similares.'
            },
            {
              key:'2-0-6',
              fraccion:'207',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de pescados, mariscos y otros productos marinos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, conservación, envasado y/o empacado de pescados, mariscos y otros productos de especies marinas. Incluye la deshidratación, congelación, salado, ahumado y otros tratamientos similares, así como la elaboración de harinas y aceites a base de especies marinas.'
            },
            {
              key:'2-0-7',
              fraccion:'208',
              actividad:'Elaboración de productos a base de cereales.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de pan, pasteles, galletas, pastas alimenticias, tortillas, obleas, conos para helados, tortillas doradas, botanas y similares. Incluye la producción de hojuelas de maíz, arroz tostado, palomitas de maíz y otros productos similares. Excepto la elaboración de harinas a base de cereales, clasificada por separado.'
            },
            {
              key:'2-0-8',
              fraccion:'209',
              actividad:'Elaboración de chocolates, dulces, confituras, jarabes, concentrados y colorantes para alimentos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de chocolates, malvaviscos, gelatinas, dulces rellenos, chicles, caramelos y similares. Incluye el tratamiento y envase de miel de abeja y la elaboración de concentrados, esencias, jarabes y colorantes para alimentos.'
            },
            {
              key:'2-0-9',
              fraccion:'2010',
              actividad:'Elaboración de alimentos para animales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de alimentos preparados para animales. Incluye la preparación de forrajes y productos especializados.'
            },
            {
              key:'2-0-10',
              fraccion:'2011',
              actividad:'Fabricación de aceites y grasas vegetales alimenticias.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de aceites vegetales comestibles, o aquéllas que realicen parte del proceso productivo como la extracción, refinación, blanqueo, purificación y otros, así como la elaboración de margarinas y grasas compuestas. Incluye a las empresas que en forma simultánea con la fabricación de aceites y/o grasas vegetales comestibles, aprovechan los productos residuales para elaborar otros productos alimenticios.'
            },
            {
              key:'2-0-11',
              fraccion:'2012',
              actividad:'Fabricación de almidones, féculas, levaduras, malta y productos similares.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación con empleo de maquinaria y/o equipo motorizado, de almidones, féculas, levaduras, malta, extractos de malta y productos similares. Cuando estos productos se fabriquen de manera simultánea en la industria cervecera, se clasificarán en la fracción 212.'
            },
            {
              key:'2-0-12',
              fraccion:'2013',
              actividad:'Elaboración, preparación, envasado y/o empacado de otros productos alimenticios.',
              clave:'III',
              descripcion:'Comprende a las empresas que preparan, elaboran, envasan y/o empacan con empleo de maquinaria y/o equipo motorizado, otros productos alimenticios no incluidos en las fracciones anteriores. Incluye hielo, helados, paletas, nieves, sal comestible, mostaza, vinagre y otros condimentos.'
            },
            {
              key:'2-0-13',
              fraccion:'2014',
              actividad:'Elaboración, preparación, envasado y/o empacado de productos alimenticios, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, elaboran, preparan, envasan y/o empacan productos alimenticios. Incluye los descritos o no en las fracciones del Grupo 20.'
            },
            {
              key:'2-0-14',
              fraccion:'2015',
              actividad:'Fabricación de productos a base de cereales, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de procesos continuos automatizados, a la fabricación de pan, pasteles, galletas, pastas alimenticias, tortillas, obleas, conos para helados, tortillas doradas, botanas y similares. Incluye la producción de hojuelas de maíz, arroz tostado, palomitas de maíz y otros productos similares.'
            },
            {
              key:'2-0-15',
              fraccion:'2016',
              actividad:'Fabricación de harinas y productos de molino a base de cereales y leguminosas.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de harinas de trigo, maíz, centeno, soya, avena, cebada, mijo, alubia, garbanzo, haba, lenteja y otros cereales y leguminosas. Incluye la fabricación de harina de arroz; molienda de nixtamal y empresas tortilladoras que cuenten con molinos. Excepto empresas dedicadas a otros beneficios de granos, clasificadas por separado en la fracción 202.'
            },
          ]
        },
        {key:'2-1',grupo:"21",label:'GRUPO 21 ELABORACIÓN DE BEBIDAS',
          children:[
            {
              key:'2-1-0',
              fraccion:'211',
              actividad:'Elaboración y/o envase de bebidas alcohólicas.',
              clave:'III',
              descripcion:'Comprende a las empresas que elaboran y/o envasan vinos, sidras, aguardientes, licores, rones, pulque y otras bebidas alcohólicas. Excepto cerveza y otras bebidas a base de malta, clasificadas en la fracción 212.'
            },
            {
              key:'2-1-1',
              fraccion:'212',
              actividad:'Elaboración de cerveza y malta.',
              clave:'IV',
              descripcion:'Comprende a las empresas que elaboran y/o envasan cerveza y otras bebidas a base de malta. Incluye la elaboración de malta, extractos de malta y productos similares cuando se fabriquen de manera simultánea en la industria cervecera.'
            },
            {
              key:'2-1-2',
              fraccion:'213',
              actividad:'Elaboración y/o envase de refrescos, aguas gaseosas y purificadas.',
              clave:'IV',
              descripcion:'Comprende a las empresas dedicadas a la elaboración y/o envase de refrescos, aguas purificadas y aguas minerales. Incluye la elaboración y envase de concentrados de pulpa de frutas, así como el almacenamiento y/o distribución, cuando se desarrollen en forma simultánea a la industria refresquera o de purificación de agua.'
            },
          ]
        },
        {key:'2-2',grupo:"22",label:'GRUPO 22 BENEFICIO Y/O FABRICACIÓN DE PRODUCTOS DE TABACO',
          children:[
            {
              key:'2-2-0',
              fraccion:'220',
              actividad:'Beneficio y/o fabricación de productos de tabaco.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican al beneficio del tabaco, fabricación de cigarrillos, puros, picadura y otros.'
            }
          ]
        },
        {key:'2-3',grupo:"23",label:'GRUPO 23 INDUSTRIA TEXTIL',
          children:[
            {
              key:'2-3-0',
              fraccion:'231',
              actividad:'Fabricación, preparación, hilado, tejido y acabado de textiles de fibras blandas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación y preparación de hilados, hilo para coser, bordar y tejer; casimires, paños, cobijas, telas afelpadas, colchas, toallas, encajes, cintas, telas elásticas, etiquetas, galonería, cordones, agujetas y similares. Incluye la preparación de algodón para usos higiénicos; la fabricación de alfombras y tapetes; guatas, borras y similares. Así como a las empresas que en forma simultánea realizan el blanqueo, teñido, estampado, impermeabilizado y otros procedimientos de acabado de hilados y tejidos de fibras blandas. Excepto los tejidos de punto y los de fibras de asbesto, clasificados en las fracciones 233 y 337, respectivamente.'
            },
            {
              key:'2-3-1',
              fraccion:'232',
              actividad:'Trabajos de blanqueo, teñido, estampado, impermeabilizado y acabado de hilados y tejidos de fibras blandas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a realizar trabajos de blanqueo, teñido, estampado, impermeabilizado, texturizado y otros procedimientos de acabado de hilados y tejidos de fibras blandas y de punto.'
            },
            {
              key:'2-3-2',
              fraccion:'233',
              actividad:'Fabricación de tejidos y artículos de punto.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación de tejidos o géneros de punto y sus confecciones con filamentos o fibras naturales, artificiales o sintéticas y sus mezclas.'
            },
            {
              key:'2-3-3',
              fraccion:'234',
              actividad:'Fabricación, preparación, hilado, tejido y acabado de textiles de fibras duras.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación, preparación, hilado, tejido y acabado de productos de henequén, palma, cáñamo, yute, ixtle, fibra de coco, lechuguilla y otras fibras duras similares. Incluye la fabricación de cables, cuerdas, cordelería, tapetes, alfombras y otros productos textiles de fibras duras.'
            },
            {
              key:'2-3-4',
              fraccion:'235',
              actividad:'Trabajos de hilados y/o tejidos sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que en forma manual o sin empleo de maquinaria ni equipo motorizado, manufacturan hilados o tejidos de cualquier tipo. Incluye empresas que en forma simultánea a la manufactura, realizan confecciones.'
            },
            {
              key:'2-3-5',
              fraccion:'236',
              actividad:'Fabricación de tejidos de fibras blandas con telares automáticos sin lanzadera.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de tejidos de fibras blandas con pie o urdimbre y trama, sin lanzadera ni canilla interior, es decir, con inserción de trama a base de proyectil, pinzas, lanzas, succión de aire, transporte por líquidos o similares. Se incluye en esta fracción a las empresas que además de las actividades anteriores, también en forma simultánea realicen procesos previos de preparación de hilado, hilado y preparación de tejido, así como los posteriores de acabado de hilados y tejidos de fibras blandas.'
            },
            {
              key:'2-3-6',
              fraccion:'237',
              actividad:'Fabricación de hilados con máquinas de turbina.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de hilados de fibras blandas, que emplean exclusivamente máquinas de turbina (open end) sin procesos posteriores de tejido.'
            },
          ]
        },
        {key:'2-4',grupo:"24",label:'GRUPO 24 CONFECCIÓN DE PRENDAS DE VESTIR Y OTROS ARTÍCULOS A BASE DE TEXTILES Y MATERIALES DIVERSOS; EXCEPTO CALZADO',
          children:[
            {
              key:'2-4-0',
              fraccion:'241',
              actividad:'Confección de prendas de vestir a la medida.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la confección y/o reparación de prendas de vestir a la medida, con telas, pieles, cuero y materiales sucedáneos ya elaborados. Incluye sastrerías y talleres de alta costura sin procesos de producción en serie.'
            },
            {
              key:'2-4-1',
              fraccion:'242',
              actividad:'Confección de prendas de vestir.',
              clave:'II',
              descripcion:'Comprende a las empresas que con procesos de producción en serie, se dedican a la confección de prendas de vestir con telas, pieles, cuero y materiales sucedáneos ya elaborados. Incluye la fabricación de ropa interior o exterior, guantes, pañuelos, corbatas, sombreros, gorros y similares.'
            },
            {
              key:'2-4-2',
              fraccion:'243',
              actividad:'Otros artículos confeccionados con textiles y materiales diversos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la confección de artículos diversos con telas, cuero, piel y sucedáneos ya elaborados. Se considera la confección de almohadas, cojines, bolsas, costales, sábanas, manteles, servilletas, cubreasientos, vestiduras, forros, fundas, banderines, cortinas, artículos de lona, toldos de protección, elaboración de bordados, forrado de botones, deshilados, plizados, trou-trou y otros artículos similares. Excepto prendas de vestir; fabricación, armado o ensamble de muebles tapizados, clasificados por separado.'
            },
          ]
        },
        {key:'2-5',grupo:"25",label:'GRUPO 25 FABRICACIÓN DE CALZADO E INDUSTRIA DEL CUERO',
          children:[
            {
              key:'2-5-0',
              fraccion:'251',
              actividad:'Fabricación de calzado, con maquinaria y/o equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación de calzado incluyendo el deportivo, y los moldeados de plástico. Excepto los moldeados de hule, clasificados en la fracción 321.'
            },
            {
              key:'2-5-1',
              fraccion:'252',
              actividad:'Fabricación de calzado, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación de calzado.'
            },
            {
              key:'2-5-2',
              fraccion:'253',
              actividad:'Curtido y acabado de cuero y piel.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al curtido y acabado de cuero y piel de animales, así como trabajos de taxidermia.'
            },
            {
              key:'2-5-3',
              fraccion:'254',
              actividad:'Manufactura de artículos de cuero, piel y sucedáneos, en forma artesanal.',
              clave:'II',
              descripcion:'Comprende a las empresas que en forma artesanal, sin empleo de maquinaria ni equipo motorizado ni procesos de producción en serie, se dedican a la manufactura de artículos de cuero, piel y telas plásticas sintéticas o artificiales. Excepto calzado y prendas de vestir.'
            },
            {
              key:'2-5-4',
              fraccion:'255',
              actividad:'Fabricación de artículos de cuero, piel y sucedáneos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación con procesos mecanizados o de producción en serie de artículos de cuero, piel y sucedáneos como maletas, baúles, portafolios, bolsas de mano, carteras, cigarreras, cinturones, monederos, sillas de montar, arneses, látigos, artículos de talabartería. Excepto calzado y prendas de vestir.'
            },
            {
              key:'2-5-5',
              fraccion:'256',
              actividad:'Curtido y acabado de cuero y piel, con uso exclusivo de maquinaria y/o equipo motorizado.',
              clave:'V',
              descripcion:'Comprende a las empresas que con la utilización exclusiva de maquinaria y/o equipo motorizado, realizan la totalidad del proceso productivo para el curtido y acabado de cuero y piel de animales.'
            },
          ]
        },
        {key:'2-6',grupo:"26",label:'GRUPO 26 INDUSTRIA Y PRODUCTOS DE MADERA Y CORCHO; EXCEPTO MUEBLES',
          children:[
            {
              key:'2-6-0',
              fraccion:'261',
              actividad:'Fabricación de productos de aserradero.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al derribo de árboles y aserrado de maderas para obtener postes, polines, vigas, tableros macizos, tableros aglomerados, contrachapados (triplay) y otros similares. Incluye la impregnación, desflemado, estufado y otras operaciones de preparación y conservación de madera.'
            },
            {
              key:'2-6-1',
              fraccion:'262',
              actividad:'Fabricación de artículos y accesorios de madera.',
              clave:'V',
              descripcion:'Comprende a las empresas que con maderas ya tratadas o trabajadas, provistas por aserraderos o madererías, se dedican a fabricar partes o estructuras completas de cancelería, marcos, molduras, lambrines, duelas, parquets, puertas, ventanas, escaleras, cimbras, closets, monturas para cuadros y espejos, cajas, envases, empaques, toneles, barricas, ataúdes; artículos como palillos, hormas, tacones, abatelenguas, mangos para herramientas y enseres de limpieza, carretes, poleas, lanzaderas, modelos o matrices, patrones de madera, perillas, reglas, rodillos, tapones y similares. Incluye las artesanías y juguetes a base de madera. Excepto muebles.'
            },
            {
              key:'2-6-2',
              fraccion:'263',
              actividad:'Manufactura de artículos de corcho, palma, vara, carrizo y mimbre.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la manufactura en forma artesanal de artículos de corcho, cestería ornamental y decoración, sombreros de palma, escobas, escobillas, escobetas, cepillos, plumeros, brochas, pinceles y similares, a base de palma, vara, carrizo y mimbre. Excepto muebles.'
            },
            {
              key:'2-6-3',
              fraccion:'264',
              actividad:'Fabricación de artículos de corcho, palma, vara, carrizo y mimbre',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a fabricar artículos de corcho, cestería ornamental y decoración; sombreros de palma, escobas, escobillas, escobetas, cepillos, plumeros, brochas, pinceles y similares, a base de palma, vara, carrizo y mimbre. Excepto muebles.'
            },
          ]
        },
        {key:'2-7',grupo:"27",label:'GRUPO 27 FABRICACIÓN Y/O REPARACIÓN DE MUEBLES DE MADERA Y SUS PARTES; EXCEPTO LOS DE METAL Y DE PLÁSTICO MOLDEADO',
          children:[
            {
              key:'2-7-0',
              fraccion:'271',
              actividad:'Fabricación y/o reparación de muebles de madera y sus partes.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de muebles de madera y sus partes para uso doméstico, comercial, industrial o de oficinas. Incluye la fabricación, ensamble y/o reparación de armazones, bastidores, colchones, sofás, sofás cama, mamparas, persianas y otros; así como el tapizado de muebles en general. Excepto la fabricación de muebles de plástico moldeado o metal, clasificados en las fracciones 322 y 353, respectivamente.'
            },
          ]
        },
        {key:'2-8',grupo:"28",label:'GRUPO 28 INDUSTRIA DEL PAPEL',
          children:[
            {
              key:'2-8-0',
              fraccion:'281',
              actividad:'Fabricación de papel y/o cartón y sus derivados.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de papel y/o cartón y sus derivados. Incluye la producción de celulosa, pasta y pulpas de madera y otras plantas, así como aquéllas que en forma simultánea a la fabricación, elaboran artículos diversos a base de dichos materiales.'
            },
            {
              key:'2-8-1',
              fraccion:'282',
              actividad:'Fabricación de artículos a base de papel y/o cartón.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con papel y/o cartón se dedican a fabricar cajas, envases, bolsas, papel para copiar o reportar, papel engomado, sobres, tarjetas, papel de escribir, cuadernos, bloques, láminas de cartón impermeabilizadas, papel y toallas higiénicas, pañales desechables y otros, cuando no se fabriquen en forma simultánea a la producción del papel o pasta de celulosa.'
            },
          ]
        },
        {key:'2-9',grupo:"29",label:'GRUPO 29 INDUSTRIAS EDITORIAL, DE IMPRESIÓN Y CONEXAS',
          children:[
            {
              key:'2-9-0',
              fraccion:'291',
              actividad:'Industrias editorial, de impresión, encuadernación y actividades conexas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a realizar trabajos de edición, impresión y/o encuadernación de periódicos, revistas, libros y similares, así como la fabricación de calcomanías, trabajos de serigrafía, litografía, process, fotograbado y rotograbado, grabado en placas metálicas, fabricación de clisés, tipos para imprentas y otros trabajos relacionados con la impresión y edición. Incluye trabajos de fotolito.'
            },
          ]
        },
        {key:'2-10',grupo:"30",label:'GRUPO 30 INDUSTRIA QUÍMICA',
          children:[
            {
              key:'2-10-0',
              fraccion:'301',
              actividad:'Fabricación de sustancias químicas e industriales; excepto abonos.',
              clave:'III',
              descripcion:'Comprende a las empresas que con productos petroquímicos básicos y/o materias primas elementales o compuestas derivadas de la carboquímica básica y de las industrias extractivas, se dedican por cualquier método a la fabricación de productos químicos orgánicos e inorgánicos básicos; incluye la fabricación de pigmentos y materias colorantes, carbón activado, gases industriales, ácidos, óxidos, bases, sales y otras sustancias químicas industriales; excepto abonos y productos clasificados en las fracciones subsecuentes del Grupo 30.'
            },
            {
              key:'2-10-1',
              fraccion:'302',
              actividad:'Fabricación de abonos, fertilizantes y plaguicidas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de abonos o fertilizantes nitrogenados, fosfatados y potásicos, así como aquéllas que se dedican a la formulación y preparación de plaguicidas, tales como: insecticidas, raticidas, fungicidas, herbicidas, así como otros productos químicos para uso agropecuario. Se incluye la producción de ácido sulfúrico, fosfórico y nítrico que se obtiene en forma simultánea en fábricas de fertilizantes.'
            },
            {
              key:'2-10-2',
              fraccion:'303',
              actividad:'Fabricación de resinas sintéticas y plastificantes.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con procesos de polimerización y policondensación a la fabricación de resinas líquidas y sólidas, tales como: polietileno, poliestireno, poliuretano, policloruro de vinilo, poliacetato de vinilo, silicones, alquidálicas, fenólicas, polimetacrilato de metilo, epóxicas, poliamidas y otras similares. Incluye la fabricación de hule o caucho sintético.'
            },
            {
              key:'2-10-3',
              fraccion:'304',
              actividad:'Industria de las pinturas.',
              clave:'III',
              descripcion:'Comprende a las empresas que con materiales colorantes o pigmentos orgánicos e inorgánicos, disolventes y otros provenientes de la industria química básica, se dedican a la fabricación de pinturas, barnices, lacas, esmaltes, tintas. Incluye la fabricación de aguarrás, brea, colofonia, derivados de resinas de la madera como: disolventes, lejías, gomas, alquitranes, pegamentos, adhesivos, aprestos, compuestos impermeabilizantes y otros productos similares.'
            },
            {
              key:'2-10-4',
              fraccion:'305',
              actividad:'Industrias químico-farmacéuticas y de medicamentos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la industrialización de materias primas químico-farmacéuticas, a través de extracción, desarrollo, síntesis y otros similares, así como a la fabricación de medicamentos, acondicionamiento y/o envase de los mismos.'
            },
            {
              key:'2-10-5',
              fraccion:'307',
              actividad:'Fabricación de productos químicos para limpieza y aromatizantes ambientales.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de jabones, detergentes, desinfectantes, lustradores, aromatizantes ambientales y otros productos para lavado y aseo.'
            },
            {
              key:'2-10-6',
              fraccion:'308',
              actividad:'Fabricación de perfumes y cosméticos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la formulación, elaboración y/o envase de esencias, perfumes, cosméticos, lociones, desodorantes, fijadores para el cabello y otros productos de tocador.'
            },
            {
              key:'2-10-7',
              fraccion:'309',
              actividad:'Fabricación de aceites y grasas vegetales y animales no comestibles, para usos industriales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que fabrican aceites y grasas vegetales y animales no comestibles, para usos industriales. Incluye aquéllas que realicen parte del proceso productivo como la extracción, refinación, hidrogenación, blanqueo, epoxidación, polimerización, esterificación, purificación y otros similares para los aceites y grasas de uso industrial.'
            },
            {
              key:'2-10-8',
              fraccion:'3010',
              actividad:'Fabricación de velas, veladoras y similares.',
              clave:'III',
              descripcion:'Comprende a las empresas que a partir de parafinas, sebo y cera se dedican a la fabricación de velas, veladoras, cirios y similares.'
            },
            {
              key:'2-10-9',
              fraccion:'3012',
              actividad:'Fabricación de cerillos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de cerillos de seguridad, de sesquisulfuro y otros similares.'
            },
            {
              key:'2-10-10',
              fraccion:'3013',
              actividad:'Fabricación de explosivos y fuegos artificiales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de explosivos, productos de pirotecnia y similares.'
            }, 
            {
              key:'2-10-11',
              fraccion:'3014',
              actividad:'Otros productos de las industrias químicas conexas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a fabricar compuestos y productos químicos, no especificados en las fracciones anteriores, con compuestos químicos adquiridos de la industria química básica o secundaria.'
            },
            {
              key:'2-10-12',
              fraccion:'3016',
              actividad:'Fabricación de fibras artificiales y sintéticas.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de fibras celulósicas y no celulósicas tales como rayón, nylon, poliéster, acrilán, elastoméricas y polipropileno, con o sin la realización de los procesos de estirado y texturizado de las fibras. Incluye la fabricación de película celulósica transparente (celofán), así como la fabricación de película transparente de polipropileno y cuerdas para llantas.'
            },
          ]
        },
        {key:'2-11',grupo:"31",label:'GRUPO 31 REFINACIÓN DEL PETRÓLEO Y DERIVADOS DEL CARBÓN MINERAL',
          children:[
            {
              key:'2-11-0',
              fraccion:'311',
              actividad:'Refinación del petróleo crudo y petroquímica básica.',
              clave:'IV',
              descripcion:'Se considera la refinación del petróleo crudo y a la industria petroquímica básica, aunque su manejo esté reservado en forma exclusiva al Estado. Incluye la fabricación de gasolinas, aceites pesados, asfaltos, parafinas y otros productos derivados de la refinación del petróleo crudo.'
            },
            {
              key:'2-11-1',
              fraccion:'312',
              actividad:'Fabricación de lubricantes y aditivos.',
              clave:'III',
              descripcion:'Comprende a las empresas que con compuestos derivados del petróleo o de origen mineral, se dedican a la fabricación de aceites y grasas lubricantes y aditivos. Incluye a las empresas que se dedican por medios químicos o físicos a la regeneración de los mismos.'
            },
            {
              key:'2-11-2',
              fraccion:'313',
              actividad:'Fabricación de productos a base de asfalto y sus mezclas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de materiales para pavimentación, mastiques, losetas, láminas de cartón asfaltadas y otros productos similares a base de asfalto y sus mezclas.'
            },
          ]
        },
        {key:'2-12',grupo:"32",label:'GRUPO 32 FABRICACIÓN DE PRODUCTOS DE HULE Y PLÁSTICO',
          children:[
            {
              key:'2-12-0',
              fraccion:'321',
              actividad:'Fabricación de productos de hule.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de llantas, cámaras, empaques, retenes, rodillos, tapetes, bandas, poleas, topes, accesorios para automóviles, tubos, mangueras, planchas, hojas, hilos, juguetes, tacones, suelas, calzado moldeado, productos de uso higiénico y farmacéutico y otros similares de hule. Incluye la regeneración y vulcanización de llantas y otros productos de hule. Excepto el parchado de llantas y cámaras clasificadas en la fracción 891.'
            },
            {
              key:'2-12-1',
              fraccion:'322',
              actividad:'Fabricación de productos de plástico.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con compuestos provenientes de la industria química básica, fabrican muebles, láminas, perfiles, tubos, envases, envolturas, rollos y otros artículos y materiales de plástico, obtenidos por medio de moldeo, inyección, laminación, extrusión, prensado y otros procesos similares. Incluye los artículos y materiales a base de baquelita. Excepto la fabricación de resinas y materias plásticas sintéticas o artificiales clasificadas en la fracción 303.'
            },
            {
              key:'2-12-2',
              fraccion:'323',
              actividad:'Fabricación de productos de látex.',
              clave:'V',
              descripcion:'Comprende a las empresas que a base de látex natural, se dedican mediante el proceso industrial de inmersión, a la fabricación de productos para usos quirúrgicos, higiénico y farmacéutico, domésticos e industriales, tales como sondas, catéteres, protectores para prótesis, calzones, preservativos, tetillas para biberón, guantes, globos y otros productos diversos.'
            },
          ]
        },
        {key:'2-13',grupo:"33",label:'GRUPO 33 FABRICACIÓN DE PRODUCTOS DE MINERALES NO METÁLICOS; EXCEPTO DEL PETRÓLEO Y DEL CARBÓN MINERAL',
          children:[
            {
              key:'2-13-0',
              fraccion:'331',
              actividad:'Manufactura de artículos de alfarería y cerámica.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la manufactura de artículos de alfarería y cerámica. Incluye a los fabricantes de moldes, modelos y artículos de yeso. Excepto la fabricación de artículos de loza y porcelana; muebles sanitarios y sus accesorios; productos de arcilla para la construcción y ladrillos, clasificados por separado.'
            },
            {
              key:'2-13-1',
              fraccion:'332',
              actividad:'Fabricación de muebles sanitarios, loza, porcelana y artículos refractarios',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de muebles sanitarios y sus accesorios, loza, porcelana, artículos refractarios y similares. Excepto la fabricación de azulejos, clasificados en las fracciones 339 o 3312.'
            },
            {
              key:'2-13-2',
              fraccion:'333',
              actividad:'Fabricación de vidrio y/o productos de vidrio.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y regeneración de vidrio para obtener materiales y productos como vidrio en masa, en bolas, barras, varillas o tubos, templado, refractario, colado, laminado, estirado o soplado, chapado, desbastado o pulido de superficie no lisa, vidrio multicelular en bloques, baldosas, placas, paneles y formas análogas, recipientes para transporte o envase, tapones y otros dispositivos de cierre, ampollas, objetos para laboratorio, higiene, farmacia, artísticos, decorativos, ornamentales, espejos, cristalería tallada y otros. Incluye la fabricación de emplomados (vitrales); fibras y lana de vidrio, así como la manufactura de estos materiales.'
            },
            {
              key:'2-13-3',
              fraccion:'335',
              actividad:'Fabricación de productos de arcilla para la construcción.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de ladrillos, bloques, baldosas, tejas, tubos y otros artículos de arcilla para la construcción. Excepto la fabricación de azulejos, muebles sanitarios y sus accesorios, clasificados por separado.'
            },
            {
              key:'2-13-4',
              fraccion:'336',
              actividad:'Fabricación de cal y yeso.',
              clave:'V',
              descripcion:'Comprende a las empresas que fabrican cal y/o yeso. Incluye a aquéllas que en forma simultánea a la fabricación del yeso, obtengan productos como: tablarroca, bloques, láminas, tableros, plafones y otros similares.'
            },
            {
              key:'2-13-5',
              fraccion:'337',
              actividad:'Fabricación de productos a base de asbesto.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de hilos, tejidos, prendas de vestir, empalmes de asbesto, empaques, envolturas, productos para usos calorífugos, guarniciones de fricción (segmentos, discos, arandelas, cintas, planchas, placas, rollos y artículos análogos para frenos, embragues o aplicaciones similares) y otros productos de asbesto.'
            },
            {
              key:'2-13-6',
              fraccion:'338',
              actividad:'Fabricación de productos abrasivos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de piedras, muelas, cabezas, discos, puntas, diamantes industriales y otras formas para pulir, amolar, afilar, esmerilar, rectificar o cortar, a base de carburo de silicio, óxido de aluminio, carburo de tungsteno y otros abrasivos. Incluso abrasivos en polvo o en grano aplicados sobre tejidos, papel, cartón y otros materiales similares.'
            },
            {
              key:'2-13-7',
              fraccion:'339',
              actividad:'Fabricación de granito artificial, productos de mármol y otras piedras.',
              clave:'V',
              descripcion:'Comprende a las empresas que con materiales provenientes de la industria extractiva, se dedican a la fabricación de granito artificial, al corte, pulido y laminado de mármol y otras piedras, para obtener mosaicos, losetas, baldosas, adoquines, losas para pavimentos, azulejos, piedras para acabados y ornamentación en la construcción, lápidas y productos a base de granito artificial, mármol y otras piedras.'
            },
            {
              key:'2-13-8',
              fraccion:'3310',
              actividad:'Fabricación de productos y partes preconstruidas de concreto.',
              clave:'V',
              descripcion:'Comprende a las empresas que a base de concreto, se dedican a la fabricación de tubos, bloques, vigas, postes, tabiques, módulos para casas, lavaderos y otras partes preconstruidas de concreto. Excepto los productos y partes de asbesto-cemento, de granito y el montaje de los productos mencionados, clasificados por separado.'
            },
            {
              key:'2-13-9',
              fraccion:'3312',
              actividad:'Fabricación de azulejos, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que, con procesos continuos automatizados, se dedican a la fabricación de productos tales como azulejos, losetas y similares.'
            },
            {
              key:'2-13-10',
              fraccion:'3313',
              actividad:'Fabricación de vidrio y/o productos de vidrio, con procesos continuos automatizados.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican por medio de procesos continuos automatizados, a la fabricación y regeneración de vidrio para obtener materiales y productos como vidrio en masa, en bolas, barras, varillas o tubos, templado, refractario, colado, laminado, estirado o soplado, chapado, desbastado o pulido de superficie no lisa, vidrio multicelular en bloques, baldosas, placas, paneles y formas análogas, recipientes para transporte o envase, tapones y otros dispositivos de cierre, ampollas, objetos para laboratorio, higiene, farmacia, artísticos, decorativos, ornamentales, espejos, cristalería tallada y otros. Incluye la fabricación de fibras y lana de vidrio, así como la manufactura de estos materiales.'
            },
            {
              key:'2-13-11',
              fraccion:'3315',
              actividad:'Fabricación de productos de asbesto-cemento.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de tubos, recipientes, láminas acanaladas y lisas y otros productos a base de asbesto-cemento.'
            },
            {
              key:'2-13-12',
              fraccion:'3316',
              actividad:'Fabricación de cemento.',
              clave:'V',
              descripcion:'Comprende a las empresas que fabrican cemento hidráulico, puzolánico, blanco y otros tipos. Incluye el mortero.'
            },
            {
              key:'2-13-13',
              fraccion:'3317',
              actividad:'Fabricación de concreto premezclado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que a base de mezclas de cemento, arena, grava, aditivos y agua, se dedican a la fabricación de concreto premezclado.'
            },
          ]
        },
        {key:'2-14',grupo:"34",label:'GRUPO 34 INDUSTRIAS METÁLICAS BÁSICAS',
          children:[
            {
              key:'2-14-0',
              fraccion:'341',
              actividad:'Industrias básicas del hierro, acero y metales no ferrosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de productos primarios de hierro, acero y metales no ferrosos, tales como: ferroaleaciones, arrabio, fierro esponja, aceros especiales, planchón, tocho, palanquilla, varilla corrugada, alambrón, barras, rieles, plancha, tubos y otros productos primarios de hierro o acero y de metales no ferrosos. Incluye a empresas que realicen todo el proceso de transformación o parte de él, desde la fundición, afinación y refinación, hasta la fase de productos semiacabados por laminación, vaciado, moldeado, extrusión, trefilado, forjado y otros procesos para obtener alambre, perfiles estructurales, láminas, hojas, cintas, hojalata, cañerías, piezas fundidas y otros; así como a las dedicadas al aprovechamiento de chatarra para obtener piezas fundidas y coladas.'
            },
            {
              key:'2-14-1',
              fraccion:'342',
              actividad:'Industrias básicas del hierro, acero y metales no ferrosos, con procesos automatizados.',
              clave:'V',
              descripcion:'Comprende a las empresas que, con la utilización exclusiva de procesos automatizados, se dedican a la fabricación de productos primarios de hierro, acero y metales no ferrosos, tales como: ferroaleaciones, arrabio, fierro esponja, aceros especiales, planchón, tocho, palanquilla, varilla corrugada, alambrón, barras, rieles, plancha, tubos y otros productos primarios de hierro o acero y de metales no ferrosos. Incluye a empresas que realicen todo el proceso de transformación o parte de él, desde la fundición, afinación y refinación, hasta la fase de productos semiacabados por laminación, vaciado, moldeado, extrusión, trefilado, forjado y otros procesos para obtener alambre, perfiles estructurales, láminas, hojas, cintas, hojalata, cañerías, piezas fundidas y otros; así como a las dedicadas al aprovechamiento de chatarra para obtener piezas fundidas y coladas.'
            },
          ]
        },
        {key:'2-15',grupo:"35",label:'GRUPO 35 FABRICACIÓN DE PRODUCTOS METÁLICOS; EXCEPTO MAQUINARIA Y EQUIPO',
          children:[
            {
              key:'2-15-0',
              fraccion:'351',
              actividad:'Fabricación de utensilios agrícolas, herramientas y artículos de ferretería y cerrajería.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de palas, picos, azadones, horquillas, rastrillos, hachas, hocinas, guadañas, hoces, machetes y otras herramientas agrícolas; serruchos, seguetas, útiles intercambiables para máquinas herramientas o de mano, buriles, brocas, pijas, pernos, tuercas, pasadores, tornillos, tensores, grilletes, chavetas, ganchos, armellas, remaches, clavos, tachuelas, clavijas, arandelas, guarniciones y herrajes, cierrapuertas automáticos, perchas, ménsulas, chapas, candados, llaves, cerraduras, accesorios metálicos para baños y otros artículos y utensilios. Incluye espuelas, herraduras y frenos para animales.'
            },
            {
              key:'2-15-1',
              fraccion:'352',
              actividad:'Fabricación y/o reparación de puertas, ventanas, cortinas metálicas y otros trabajos de herrería.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de puertas, ventanas, rejas, cortinas, escaleras, barandales y otros artículos de metal. Incluye la fabricación de juegos metálicos infantiles no motorizados. Excepto las empresas que en forma simultánea con la fabricación de los productos mencionados instalen los mismos, así como aquéllas que realicen exclusivamente la instalación de los productos mencionados, las que se clasifican en la fracción 423.'
            },
            {
              key:'2-15-2',
              fraccion:'353',
              actividad:'Fabricación, ensamble y/o reparación de muebles metálicos y sus partes.',
              clave:'IV',
              descripcion:'Comprende a las empresas dedicadas a fabricar, ensamblar y/o reparar unidades terminadas o partes de muebles y equipos metálicos y sus partes para uso doméstico, comercial, de oficina, profesional y científico como gabinetes, camas, ataúdes, mesas, sillería, escritorios, archiveros, estanterías, cajas fuertes, cajas de seguridad, libreros, muebles y equipo para restaurantes, peluquerías, salas de belleza, centros comerciales y hospitales.'
            },
            {
              key:'2-15-3',
              fraccion:'354',
              actividad:'Fabricación y/o reparación de estructuras metálicas, tanques, calderas y similares.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de estructuras metálicas, tanques, calderas, recipientes de placa metálica estacionarios o para montarse sobre vehículos de transporte. Incluye estructuras para puentes, juegos electromecánicos, depósitos elevados, hangares, torres, castilletes, columnas y otros sistemas de soporte estructurales.'
            },
            {
              key:'2-15-4',
              fraccion:'355',
              actividad:'Fabricación de envases metálicos, corcholatas y tapas.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a fabricar envases metálicos a base de: hojalata, aluminio, acero inoxidable, lámina galvanizada y otras aleaciones; así como la fabricación de corcholatas y tapas de los envases. Excepto tanques y recipientes de placa metálica considerados en la fracción 354.'
            },
            {
              key:'2-15-5',
              fraccion:'356',
              actividad:'Fabricación de alambres y otros productos de alambre.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de alambres y productos de alambre, tales como: alambrados, telas metálicas, cables, cordajes, cordones, trenzas, eslingas, resortes, fibra metálica, ganchos para ropa, jaulas, rejillas, alambres recubiertos, soldadura de alambre y electrodos, así como otros artículos similares a base de alambre. Excepto los alambres para conducción de energía eléctrica, clasificados en la fracción 378.'
            },
            {
              key:'2-15-6',
              fraccion:'357',
              actividad:'Trabajos de tratamientos térmicos y galvanoplastia.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican exclusivamente a trabajos de tratamientos térmicos y galvanoplastia, tales como: normalizado, relevado, revenido, patentado, templado, cromado, niquelado, cobrizado, anodizado, estañado, plateado, tropicalizado y otros. Incluye a empresas que realicen procesos de pulido, limpieza con chorro de arena o granalla de acero, decapado, pintado, esmaltado y otros procesos de preparación o acabado. Excepto empresas que realicen estos trabajos como parte de su proceso productivo en la fabricación de un producto, clasificadas por separado.'
            },
            {
              key:'2-15-7',
              fraccion:'358',
              actividad:'Fabricación de agujas, alfileres, cierres, botones y navajas para rasurar.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de agujas, alfileres, cierres, botones, pasacintas, ganchillos, cuentas, lentejuelas, chaquiras, horquillas, rizadores, grapas, clips y navajas para rasurar.'
            },
            {
              key:'2-15-8',
              fraccion:'359',
              actividad:'Fabricación de baterías de cocina, cucharas, cuchillos y tenedores.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de ollas, sartenes, charolas, ollas express, cafeteras, moldes para hornear, cazuelas, cucharas, tenedores, cuchillos, abrelatas, destapadores, peladores, rebanadores y otros artefactos de uso doméstico similares.'
            },
            {
              key:'2-15-9',
              fraccion:'3510',
              actividad:'Fabricación de otros productos metálicos maquinados.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de artículos o partes metálicas diversas, obtenidos por procesos de maquinado como: torneado, fresado, mandrilado, rectificado, prensado, troquelado, forjado, sinterizado, doblado, rechazado y otros maquinados. Incluye corte con oxígeno, sierra mecánica, cizalla y otros.'
            },
            {
              key:'2-15-10',
              fraccion:'3511',
              actividad:'Tratamientos térmicos y galvanoplastia, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que con procesos continuos automatizados, se dedican exclusivamente a trabajos de tratamientos térmicos y galvanoplastia, tales como: normalizado, relevado, revenido, patentado, templado, cromado, niquelado, cobrizado, anodizado, estañado, plateado, tropicalizado y otros. Excepto empresas que realicen estos trabajos como parte de su proceso productivo en la fabricación de un producto, clasificadas por separado.'
            },
          ]
        },
        {key:'2-16',grupo:"36",label:'GRUPO 36 FABRICACIÓN, ENSAMBLE Y/O REPARACIÓN DE MAQUINARIA, EQUIPO Y SUS PARTES; EXCEPTO LOS ELÉCTRICOS',
          children:[
            {
              key:'2-16-0',
              fraccion:'361',
              actividad:'Fabricación y/o ensamble de maquinaria, equipos e implementos para labores agropecuarias.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de sembradoras, cosechadoras, segadoras, trilladoras, fertilizadoras, cortadoras, arados, rastras, ordeñadoras y otros equipos, implementos y máquinas para labores agropecuarias. Excepto tractores clasificados en la fracción 363.'
            },
            {
              key:'2-16-1',
              fraccion:'362',
              actividad:'Fabricación y/o ensamble de maquinaria, equipo e implementos para las industrias de alimentos, bebidas, tabacalera, textil, calzado, madera, cuero, impresión, hule, plástico, productos de minerales no metálicos (excepto cemento), metal mecánica y maquinaria y equipo de uso común a varias industrias.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de implementos, equipos y máquinas especiales para las industrias señaladas. Incluye la fabricación de bombas, motores (excepto los eléctricos y automotrices), compresores, centrifugadores, aparatos de filtración, calefacción y refrigeración, equipos de elevación, carga, descarga y manipulación (carretillas, polipastos, grúas, montacargas, escaleras electromecánicas, bandas transportadoras, elevadores para personas y mercancías y otros), básculas, herramientas neumáticas (pistolas aerográficas, extintores, aparatos de chorro de arena) y otros equipos y máquinas de uso común a varias industrias.No se considera en esta fracción la fabricación y/o ensamble de implementos, equipos y máquinas clasificados por separado.'
            },
            {
              key:'2-16-2',
              fraccion:'363',
              actividad:'Fabricación y/o ensamble de maquinaria, equipo e implementos para las industrias de la construcción, extractivas, papel, cemento, petroquímica básica, química; metálicas básicas del hierro, del acero y de metales no ferrosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de implementos, equipos y máquinas especiales para las industrias señaladas. Incluye la fabricación de tractores para labores agropecuarias e industriales. No se considera en esta fracción la fabricación y/o ensamble de implementos, equipos y máquinas clasificados por separado.'
            },
            {
              key:'2-16-3',
              fraccion:'364',
              actividad:'Fabricación y/o ensamble de máquinas de coser, oficina, cómputo y sus partes.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de máquinas de coser, de escribir, protectoras de cheques, calculadoras, registradoras, franqueadoras de correspondencia, sus partes y otras máquinas de oficina. Incluye la fabricación de equipo de cómputo o de procesamiento electrónico de datos y sus periféricos. Excepto los equipos de comunicación, clasificados en la fracción 372.'
            },
            {
              key:'2-16-4',
              fraccion:'365',
              actividad:'Reparación y ensamble de máquinas de coser y de oficina.',
              clave:'I',
              descripcion:'Comprende a las empresas que con partes y accesorios provenientes de otras empresas, se dedican a la reparación y ensamble de máquinas de coser y de oficina. Excepto el ensamble y/o reparación de equipos de cómputo, clasificados en las fracciones 364 y 6711, respectivamente.'
            },
            {
              key:'2-16-5',
              fraccion:'366',
              actividad:'Fabricación de partes y piezas sueltas, para maquinaria y equipo en general.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de partes y piezas sueltas para maquinaria y equipo en general.'
            },
            {
              key:'2-16-6',
              fraccion:'367',
              actividad:'Reparación y/o mantenimiento de maquinaria y equipo en general.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la reparación y/o mantenimiento de maquinaria y equipo en general. Excepto empresas que se dediquen a la instalación de maquinaria y equipo en general, clasificadas en la fracción 843.'
            },
          ]
        },
        {key:'2-17',grupo:"37",label:'GRUPO 37 FABRICACIÓN Y/O ENSAMBLE DE MAQUINARIA, EQUIPOS, APARATOS, ACCESORIOS Y ARTÍCULOS ELÉCTRICOS, ELECTRÓNICOS Y SUS PARTES',
          children:[
            {
              key:'2-17-0',
              fraccion:'371',
              actividad:'Fabricación y/o ensamble de maquinaria y equipo para generación y transformación de energía eléctrica.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de generadores, motogeneradores, motorreductores, transformadores, reguladores, alternadores, rectificadores, motores eléctricos, punteadoras, soldadoras eléctricas y otros equipos y máquinas para generación y transformación de energía eléctrica. Excepto la fabricación y/o ensamble de partes para el sistema eléctrico de vehículos automóviles, clasificadas en la fracción 384.'
            },
            {
              key:'2-17-1',
              fraccion:'372',
              actividad:'Fabricación y/o ensamble de equipo y aparatos de radio, televisión y comunicaciones.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de aparatos de radio y televisión, grabadores o reproductores de la imagen o del sonido, equipos de telefonía, télex, radar, telegrafía, micrófonos, audífonos, altavoces, amplificadores y otros aparatos y equipos de radio, televisión y comunicaciones. Incluye a las empresas que en forma simultánea a la fabricación de los equipos y aparatos antes mencionados, fabriquen y/o ensamblen sus partes.'
            },
            {
              key:'2-17-2',
              fraccion:'373',
              actividad:'Fabricación y/o grabado de discos y cintas magnéticas para sonidos, imágenes y datos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o grabado de discos y cintas magnéticas para sonidos, imágenes y datos. Incluye el ensamble de los artículos mencionados en cartuchos.'
            },
            {
              key:'2-17-3',
              fraccion:'374',
              actividad:'Fabricación y/o ensamble de aparatos eléctricos y sus partes para uso doméstico.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de unidades terminadas o partes de batidoras, tostadores, freidoras, sartenetas, cafeteras, hornos de microondas, planchas, licuadoras, extractores de jugo, aspiradoras, enceradoras, máquinas para afeitar, cortar y secar el pelo, ventiladores y otros aparatos eléctricos similares para uso doméstico o comercial. Incluye a las empresas que además de fabricar alguno(s) de los aparatos anteriormente señalados, fabrican y/o ensamblan refrigeradores, lavadoras, estufas y otros equipos similares para uso doméstico. Las empresas que se dedican en forma exclusiva a fabricar y/o ensamblar refrigeradores, lavadoras, estufas y otros equipos similares, se clasifican por separado en la fracción 3712.'
            },
            {
              key:'2-17-4',
              fraccion:'375',
              actividad:'Fabricación, reconstrucción y/o ensamble de acumuladores eléctricos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, reconstrucción y/o ensamble de acumuladores eléctricos (húmedos) para usos diversos.'
            },
            {
              key:'2-17-5',
              fraccion:'376',
              actividad:'Fabricación y/o ensamble de pilas (secas), componentes eléctricos y electrónicos diversos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de pilas secas, partes e implementos eléctricos o electrónicos como escobillas de carbón, carbones para lámparas, electrodos de carbón, cristales piezoeléctricos, diodos, transistores, microcircuitos electrónicos, condensadores eléctricos y similares.'
            },
            {
              key:'2-17-6',
              fraccion:'377',
              actividad:'Fabricación y/o ensamble de lámparas (focos) y tubos al vacío para alumbrado eléctrico.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de lámparas (focos) y tubos al vacío para alumbrado eléctrico. Incluye válvulas electrónicas de vacío, de vapor, de gas y de rayos catódicos. Excepto empresas que fabriquen aparatos denominados luminarias que provistos de lámparas (focos) sirven para alumbrar, clasificadas en la fracción 3710.'
            },
            {
              key:'2-17-7',
              fraccion:'378',
              actividad:'Fabricación de conductores eléctricos.',
              clave:'III',
              descripcion:'Comprende a las empresas dedicadas a la fabricación de alambres y cables desnudos y aislados empleados para la conducción de energía eléctrica.'
            },
            {
              key:'2-17-8',
              fraccion:'379',
              actividad:'Fabricación y/o ensamble de aparatos, accesorios eléctricos o electrónicos, para empalme, corte, protección y conexión.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de interruptores, arrancadores, relevadores, tableros, conmutadores, cortacircuitos, pararrayos, amortiguadores de onda, alarmas, tomas de corriente, pletinas y similares.'
            },
            {
              key:'2-17-9',
              fraccion:'3710',
              actividad:'Fabricación de luminarias y anuncios luminosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de luminarias que provistas de focos, se utilizan para iluminación teatral, doméstica, industrial, arquitectónica y otras similares. Incluye la fabricación de semáforos, anuncios luminosos y/o luminiscentes.'
            },
            {
              key:'2-17-10',
              fraccion:'3711',
              actividad:'Fabricación en serie o con procesos continuos de acumuladores eléctricos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican, mediante procesos continuos o líneas de producción en serie, a la fabricación y/o ensamble de acumuladores eléctricos (húmedos) para usos diversos.'
            },
            {
              key:'2-17-11',
              fraccion:'3712',
              actividad:'Fabricación y/o ensamble de refrigeradores, estufas, lavadoras, secadoras y otros aparatos de línea blanca.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican en forma exclusiva a la fabricación y/o ensamble de aparatos eléctricos para uso comercial y doméstico, tales como: refrigeradores, congeladores, estufas, hornos, lavadoras, secadoras, lava-vajillas y otros similares de línea blanca. Incluye calentadores.'
            },
          ]
        },
        {key:'2-18',grupo:"38",label:'GRUPO 38 CONSTRUCCIÓN, RECONSTRUCCIÓN Y ENSAMBLE DE EQUIPO DE TRANSPORTE Y SUS PARTES',
          children:[
            {
              key:'2-18-0',
              fraccion:'381',
              actividad:'Fabricación y/o ensamble de aeronaves.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de aeronaves.'
            },
            {
              key:'2-18-1',
              fraccion:'382',
              actividad:'Fabricación y/o ensamble de carrocerías para vehículos de transporte.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble, adaptación o conversión de carrocerías y remolques para vehículos de transporte. Excepto la fabricación y/o ensamble de tanques para vehículos de transporte clasificados en la fracción 354.'
            },
            {
              key:'2-18-2',
              fraccion:'383',
              actividad:'Fabricación y/o ensamble de partes y accesorios para automóviles, autobuses, camiones, motocicletas y bicicletas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble, para automóviles, autobuses, camiones, motocicletas y bicicletas, de muelles, amortiguadores, asientos, escapes y otras partes similares. Incluye accesorios tales como: espejos retrovisores, antenas, volantes, cinturones de seguridad y otros. Excepto las partes y/o componentes para motores, clasificadas por separado.'
            },
            {
              key:'2-18-3',
              fraccion:'384',
              actividad:'Fabricación y/o ensamble de partes para el sistema eléctrico de vehículos automóviles.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de bobinas, generadores, distribuidores, reguladores, alternadores, transformadores, bujías, platinos, sistemas de encendido y otras partes y accesorios para el sistema eléctrico de vehículos automóviles. Excepto la fabricación de acumuladores, clasificados en las fracciones 375 y 3711.'
            },
            {
              key:'2-18-4',
              fraccion:'385',
              actividad:'Fabricación y/o ensamble de bicicletas y otros vehículos de pedal.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de bicicletas, triciclos y otros vehículos de pedal similares para transporte de personas o mercancías. Excepto motocicletas clasificadas en la fracción 388.'
            },
            {
              key:'2-18-5',
              fraccion:'386',
              actividad:'Fabricación, ensamble y/o reparación de carros de ferrocarril, equipo ferroviario y sus partes.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, montaje, reconstrucción y/o reparación de equipo ferroviario, armazones, estructuras para locomotoras, carros comedor, carros dormitorio, autovía, locomotoras, tranvías, vagones de carga, de pasajeros, de plataforma, frigoríficos, carros para trenes urbanos (metro), suburbanos y sus partes.'
            },
            {
              key:'2-18-6',
              fraccion:'387',
              actividad:'Fabricación, ensamble y/o reparación de embarcaciones.',
              clave:'V',
              descripcion:'Comprende a las empresas dedicadas a trabajos de construcción, reconstrucción y/o reparación de barcos, lanchones, barcazas, yates y similares. Incluye a las empresas que se dedican a la conversión, modificación y desguace de embarcaciones. Excepto la reparación de lanchas, clasificada en la fracción 891.'
            },
            {
              key:'2-18-7',
              fraccion:'388',
              actividad:'Fabricación y/o ensamble de automóviles, autobuses, camiones y motocicletas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de automóviles, autobuses, camiones y motocicletas.'
            },
            {
              key:'2-18-8',
              fraccion:'389',
              actividad:'Fabricación y/o ensamble de motores para automóviles, autobuses y camiones.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de motores como producto final para su uso inmediato en la función para la que fue creado en automóviles, autobuses y camiones. Excepto empresas que se dedican a fabricar partes y/o componentes para estos motores, clasificadas por separado.'
            },
            {
              key:'2-18-9',
              fraccion:'3810',
              actividad:'Fabricación de conjuntos mecánicos y sus partes para automóviles, autobuses, camiones y motocicletas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación en serie de conjuntos mecánicos tales como: sistemas de transmisión, de dirección, de suspensión, de embrague, de frenos y otros, así como sus partes. Incluye a las empresas que se dedican exclusivamente a la fabricación de partes metálicas para motores de combustión interna (gasolina o diesel), tales como: monoblocks, pistones, bielas, anillos, engranes, cigüeñales, árboles de levas, cabezas de cilindros, balancines, bujes, inyectores, bombas (de enfriamiento, lubricación y combustible), múltiples (de admisión y escape), poleas, tapas cojinete (de cigüeñal y de árbol de levas), válvulas (para admisión y escape), carcazas, retenes de sello de aceite, flechas, camisas para cilindro, filtros (para aceite, combustibles y aire) y carburadores. Excepto empresas que fabriquen partes para motor, como tornillos, tuercas, arandelas, bandas, mangueras, cables, partes metálicas para soporte y otras, clasificadas por separado.'
            },
          ]
        },
        {key:'2-19',grupo:"39",label:'GRUPO 39 OTRAS INDUSTRIAS MANUFACTURERAS',
          children:[
            {
              key:'2-19-0',
              fraccion:'390',
              actividad:'Fabricación, ensamble y/o reparación de equipos, aparatos científicos y profesionales e instrumentos de medida y control.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble y/o reparación de equipos, aparatos e instrumentos científicos, profesionales, médicos, quirúrgicos, de laboratorio, prótesis, ortopedia, auditivos, de medida, control y otros similares; excepto muebles metálicos, básculas industriales y prótesis dentales, que se clasifican por separado.'
            },
            {
              key:'2-19-1',
              fraccion:'391',
              actividad:'Fabricación, ensamble y/o reparación de aparatos, instrumentos y accesorios de óptica y fotografía.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble y/o reparación de anteojos, lentes, aparatos e instrumentos ópticos, fotográficos y de fotocopiado. Incluye la fabricación de películas, placas, papel sensible y otros accesorios de óptica y fotografía.'
            },
            {
              key:'2-19-2',
              fraccion:'392',
              actividad:'Fabricación, montaje y/o ensamble de relojes, joyas, artículos de orfebrería y fantasía.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, montaje y/o ensamble de relojes, joyas, artículos de orfebrería, de fantasía, mecanismos, conjuntos mecánicos, partes o componentes para relojes. Incluye el corte, grabado, tallado y pulido de piedras preciosas y metales utilizados en joyería.'
            },
            {
              key:'2-19-3',
              fraccion:'394',
              actividad:'Fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes y artículos deportivos, con maquinaria y/o equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes (excepto los de plástico moldeado y de madera, clasificados por separado). Incluye a las empresas que fabrican artículos deportivos que por los materiales, maquinaria o equipo utilizados y procesos de trabajo desarrollados no puedan clasificarse en las fracciones correspondientes de la División de las Industrias de Transformación.'
            },
            {
              key:'2-19-4',
              fraccion:'395',
              actividad:'Fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes y artículos deportivos, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes (excepto los de madera), artículos deportivos y otros similares.'
            },
            {
              key:'2-19-5',
              fraccion:'396',
              actividad:'Fabricación de lápices, gomas, plumas y bolígrafos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de plumas fuente, estilográficas, lapiceros, bolígrafos, puntillas, minas, portaminas, lápices, crayones, tizas, gomas, sellos de goma, cintas, correctores y cartuchos para máquinas de escribir, de registro e impresoras y otros artículos similares.'
            },
            {
              key:'2-19-6',
              fraccion:'397',
              actividad:'Talleres de mecánica dental.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de prótesis dentales, tales como: placas, puentes, dentaduras, dientes artificiales y similares.'
            },
            {
              key:'2-19-7',
              fraccion:'398',
              actividad:'Fabricación y/o ensamble de armas de fuego portátiles, cartuchos, municiones y accesorios.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de armas de fuego portátiles, cartuchos, municiones y accesorios.'
            },
            {
              key:'2-19-8',
              fraccion:'399',
              actividad:'Fabricación, ensamble y/o reparación de otros artículos manufacturados no clasificados anteriormente, sin maquinaria ni equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación, ensamble y/o reparación de artículos diversos no clasificados anteriormente.'
            },
            {
              key:'2-19-9',
              fraccion:'3910',
              actividad:'Fabricación, ensamble y/o reparación de otros artículos manufacturados no clasificados anteriormente, con maquinaria y/o equipo motorizado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación, ensamble y/o reparación de artículos diversos no clasificados anteriormente.'
            },
          ]
        }
      ]
    },
    {key:'3',division:'3',label:'DIVISIÓN 3 INDUSTRIAS DE TRANSFORMACIÓN',
      children:[
        {key:'3-0',grupo:"20",label:'GRUPO 20 ELABORACIÓN DE ALIMENTOS',
          children:[
            {
              key:'3-0-0',
              fraccion:'201',
              actividad:'Elaboración y preparación de productos alimenticios a base de frutas y legumbres, su conservación, envasado y/o empacado.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, envasado y/o empacado de encurtidos, jugos, mermeladas, ates, jaleas, frutas cubiertas o cristalizadas, salsas, sopas, alimentos colados y otros productos alimenticios a base de frutas y legumbres. Incluye la conservación de frutas y legumbres por deshidratación, congelación, cocción y otros procedimientos similares.'
            },
            {
              key:'3-0-1',
              fraccion:'202',
              actividad:'Beneficio de otros granos, fabricación y envasado.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al beneficio de café, cacao; tostado y molienda de café; fabricación y envasado de café soluble y té; desgrane, descascarado, limpieza, secado y pulido de arroz y otros granos, incluye la limpieza y envasado de lenteja, frijol, haba, garbanzo y otros productos agrícolas; así como el beneficio de especias. Excepto la fabricación de harinas clasificadas por separado en la fracción 2016.'
            },
            {
              key:'3-0-2',
              fraccion:'203',
              actividad:'Producción de azúcar.',
              clave:'V',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la producción de azúcar y productos residuales de caña o de remolacha. Incluye la refinación, cristalización o granulación y la elaboración de piloncillo, así como la destilación de alcohol etílico cuando se dé en forma simultánea con la producción de azúcar.'
            },
            {
              key:'3-0-3',
              fraccion:'204',
              actividad:'Matanza de ganado y aves.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la matanza de aves, ganado bovino, ovino, caprino, porcino, equino y otras especies. Incluye a las empresas que en forma simultánea con la matanza, realizan la preparación, conservación, envasado y/o empacado de carnes y sus derivados.'
            },
            {
              key:'3-0-4',
              fraccion:'205',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de carnes y sus derivados. ',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, envasado y/o empacado de carnes frías, embutidos, manteca de cerdo, sopas y otros productos derivados de carne. Incluye la deshidratación, congelación, salado, ahumado, envinagrado y otros procedimientos para conservar o preservar carnes y sus derivados, así como la elaboración de grenetinas como materia prima para otras industrias.'
            },
            {
              key:'3-0-5',
              fraccion:'206',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de productos lácteos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, conservación, envasado y/o empacado de cremas, mantequillas, quesos, leche condensada, evaporada, flanes, cajetas, yogures y otros productos a base de leche. Incluye la pasteurización, deshidratación, rehidratación, homogeneización, vitaminización y otros tratamientos similares.'
            },
            {
              key:'3-0-6',
              fraccion:'207',
              actividad:'Elaboración, preparación, conservación, envasado y/o empacado de pescados, mariscos y otros productos marinos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración, preparación, conservación, envasado y/o empacado de pescados, mariscos y otros productos de especies marinas. Incluye la deshidratación, congelación, salado, ahumado y otros tratamientos similares, así como la elaboración de harinas y aceites a base de especies marinas.'
            },
            {
              key:'3-0-7',
              fraccion:'208',
              actividad:'Elaboración de productos a base de cereales.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de pan, pasteles, galletas, pastas alimenticias, tortillas, obleas, conos para helados, tortillas doradas, botanas y similares. Incluye la producción de hojuelas de maíz, arroz tostado, palomitas de maíz y otros productos similares. Excepto la elaboración de harinas a base de cereales, clasificada por separado.'
            },
            {
              key:'3-0-8',
              fraccion:'209',
              actividad:'Elaboración de chocolates, dulces, confituras, jarabes, concentrados y colorantes para alimentos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de chocolates, malvaviscos, gelatinas, dulces rellenos, chicles, caramelos y similares. Incluye el tratamiento y envase de miel de abeja y la elaboración de concentrados, esencias, jarabes y colorantes para alimentos.'
            },
            {
              key:'3-0-9',
              fraccion:'2010',
              actividad:'Elaboración de alimentos para animales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la elaboración de alimentos preparados para animales. Incluye la preparación de forrajes y productos especializados.'
            },
            {
              key:'3-0-10',
              fraccion:'2011',
              actividad:'Fabricación de aceites y grasas vegetales alimenticias.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de aceites vegetales comestibles, o aquéllas que realicen parte del proceso productivo como la extracción, refinación, blanqueo, purificación y otros, así como la elaboración de margarinas y grasas compuestas. Incluye a las empresas que en forma simultánea con la fabricación de aceites y/o grasas vegetales comestibles, aprovechan los productos residuales para elaborar otros productos alimenticios.'
            },
            {
              key:'3-0-11',
              fraccion:'2012',
              actividad:'Fabricación de almidones, féculas, levaduras, malta y productos similares.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación con empleo de maquinaria y/o equipo motorizado, de almidones, féculas, levaduras, malta, extractos de malta y productos similares. Cuando estos productos se fabriquen de manera simultánea en la industria cervecera, se clasificarán en la fracción 212.'
            },
            {
              key:'3-0-12',
              fraccion:'2013',
              actividad:'Elaboración, preparación, envasado y/o empacado de otros productos alimenticios.',
              clave:'III',
              descripcion:'Comprende a las empresas que preparan, elaboran, envasan y/o empacan con empleo de maquinaria y/o equipo motorizado, otros productos alimenticios no incluidos en las fracciones anteriores. Incluye hielo, helados, paletas, nieves, sal comestible, mostaza, vinagre y otros condimentos.'
            },
            {
              key:'3-0-13',
              fraccion:'2014',
              actividad:'Elaboración, preparación, envasado y/o empacado de productos alimenticios, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, elaboran, preparan, envasan y/o empacan productos alimenticios. Incluye los descritos o no en las fracciones del Grupo 20.'
            },
            {
              key:'3-0-14',
              fraccion:'2015',
              actividad:'Fabricación de productos a base de cereales, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de procesos continuos automatizados, a la fabricación de pan, pasteles, galletas, pastas alimenticias, tortillas, obleas, conos para helados, tortillas doradas, botanas y similares. Incluye la producción de hojuelas de maíz, arroz tostado, palomitas de maíz y otros productos similares.'
            },
            {
              key:'3-0-15',
              fraccion:'2016',
              actividad:'Fabricación de harinas y productos de molino a base de cereales y leguminosas.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de harinas de trigo, maíz, centeno, soya, avena, cebada, mijo, alubia, garbanzo, haba, lenteja y otros cereales y leguminosas. Incluye la fabricación de harina de arroz; molienda de nixtamal y empresas tortilladoras que cuenten con molinos. Excepto empresas dedicadas a otros beneficios de granos, clasificadas por separado en la fracción 202.'
            },
          ]
        },
        {key:'3-1',grupo:"21",label:'GRUPO 21 ELABORACIÓN DE BEBIDAS',
          children:[
            {
              key:'3-1-0',
              fraccion:'211',
              actividad:'Elaboración y/o envase de bebidas alcohólicas.',
              clave:'III',
              descripcion:'Comprende a las empresas que elaboran y/o envasan vinos, sidras, aguardientes, licores, rones, pulque y otras bebidas alcohólicas. Excepto cerveza y otras bebidas a base de malta, clasificadas en la fracción 212.'
            },
            {
              key:'3-1-1',
              fraccion:'212',
              actividad:'Elaboración de cerveza y malta.',
              clave:'IV',
              descripcion:'Comprende a las empresas que elaboran y/o envasan cerveza y otras bebidas a base de malta. Incluye la elaboración de malta, extractos de malta y productos similares cuando se fabriquen de manera simultánea en la industria cervecera.'
            },
            {
              key:'3-1-2',
              fraccion:'213',
              actividad:'Elaboración y/o envase de refrescos, aguas gaseosas y purificadas.',
              clave:'IV',
              descripcion:'Comprende a las empresas dedicadas a la elaboración y/o envase de refrescos, aguas purificadas y aguas minerales. Incluye la elaboración y envase de concentrados de pulpa de frutas, así como el almacenamiento y/o distribución, cuando se desarrollen en forma simultánea a la industria refresquera o de purificación de agua.'
            },
          ]
        },
        {key:'3-2',grupo:"22",label:'GRUPO 22 BENEFICIO Y/O FABRICACIÓN DE PRODUCTOS DE TABACO',
          children:[
            {
              key:'3-2-0',
              fraccion:'220',
              actividad:'Beneficio y/o fabricación de productos de tabaco.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican al beneficio del tabaco, fabricación de cigarrillos, puros, picadura y otros.'
            }
          ]
        },
        {key:'3-3',grupo:"23",label:'GRUPO 23 INDUSTRIA TEXTIL',
          children:[
            {
              key:'3-3-0',
              fraccion:'231',
              actividad:'Fabricación, preparación, hilado, tejido y acabado de textiles de fibras blandas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación y preparación de hilados, hilo para coser, bordar y tejer; casimires, paños, cobijas, telas afelpadas, colchas, toallas, encajes, cintas, telas elásticas, etiquetas, galonería, cordones, agujetas y similares. Incluye la preparación de algodón para usos higiénicos; la fabricación de alfombras y tapetes; guatas, borras y similares. Así como a las empresas que en forma simultánea realizan el blanqueo, teñido, estampado, impermeabilizado y otros procedimientos de acabado de hilados y tejidos de fibras blandas. Excepto los tejidos de punto y los de fibras de asbesto, clasificados en las fracciones 233 y 337, respectivamente.'
            },
            {
              key:'3-3-1',
              fraccion:'232',
              actividad:'Trabajos de blanqueo, teñido, estampado, impermeabilizado y acabado de hilados y tejidos de fibras blandas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a realizar trabajos de blanqueo, teñido, estampado, impermeabilizado, texturizado y otros procedimientos de acabado de hilados y tejidos de fibras blandas y de punto.'
            },
            {
              key:'3-3-2',
              fraccion:'233',
              actividad:'Fabricación de tejidos y artículos de punto.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación de tejidos o géneros de punto y sus confecciones con filamentos o fibras naturales, artificiales o sintéticas y sus mezclas.'
            },
            {
              key:'3-3-3',
              fraccion:'234',
              actividad:'Fabricación, preparación, hilado, tejido y acabado de textiles de fibras duras.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican con empleo de maquinaria y/o equipo motorizado, a la fabricación, preparación, hilado, tejido y acabado de productos de henequén, palma, cáñamo, yute, ixtle, fibra de coco, lechuguilla y otras fibras duras similares. Incluye la fabricación de cables, cuerdas, cordelería, tapetes, alfombras y otros productos textiles de fibras duras.'
            },
            {
              key:'3-3-4',
              fraccion:'235',
              actividad:'Trabajos de hilados y/o tejidos sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que en forma manual o sin empleo de maquinaria ni equipo motorizado, manufacturan hilados o tejidos de cualquier tipo. Incluye empresas que en forma simultánea a la manufactura, realizan confecciones.'
            },
            {
              key:'3-3-5',
              fraccion:'236',
              actividad:'Fabricación de tejidos de fibras blandas con telares automáticos sin lanzadera.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de tejidos de fibras blandas con pie o urdimbre y trama, sin lanzadera ni canilla interior, es decir, con inserción de trama a base de proyectil, pinzas, lanzas, succión de aire, transporte por líquidos o similares. Se incluye en esta fracción a las empresas que además de las actividades anteriores, también en forma simultánea realicen procesos previos de preparación de hilado, hilado y preparación de tejido, así como los posteriores de acabado de hilados y tejidos de fibras blandas.'
            },
            {
              key:'3-3-6',
              fraccion:'237',
              actividad:'Fabricación de hilados con máquinas de turbina.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de hilados de fibras blandas, que emplean exclusivamente máquinas de turbina (open end) sin procesos posteriores de tejido.'
            },
          ]
        },
        {key:'3-4',grupo:"24",label:'GRUPO 24 CONFECCIÓN DE PRENDAS DE VESTIR Y OTROS ARTÍCULOS A BASE DE TEXTILES Y MATERIALES DIVERSOS; EXCEPTO CALZADO',
          children:[
            {
              key:'3-4-0',
              fraccion:'241',
              actividad:'Confección de prendas de vestir a la medida.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la confección y/o reparación de prendas de vestir a la medida, con telas, pieles, cuero y materiales sucedáneos ya elaborados. Incluye sastrerías y talleres de alta costura sin procesos de producción en serie.'
            },
            {
              key:'3-4-1',
              fraccion:'242',
              actividad:'Confección de prendas de vestir.',
              clave:'II',
              descripcion:'Comprende a las empresas que con procesos de producción en serie, se dedican a la confección de prendas de vestir con telas, pieles, cuero y materiales sucedáneos ya elaborados. Incluye la fabricación de ropa interior o exterior, guantes, pañuelos, corbatas, sombreros, gorros y similares.'
            },
            {
              key:'3-4-2',
              fraccion:'243',
              actividad:'Otros artículos confeccionados con textiles y materiales diversos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la confección de artículos diversos con telas, cuero, piel y sucedáneos ya elaborados. Se considera la confección de almohadas, cojines, bolsas, costales, sábanas, manteles, servilletas, cubreasientos, vestiduras, forros, fundas, banderines, cortinas, artículos de lona, toldos de protección, elaboración de bordados, forrado de botones, deshilados, plizados, trou-trou y otros artículos similares. Excepto prendas de vestir; fabricación, armado o ensamble de muebles tapizados, clasificados por separado.'
            },
          ]
        },
        {key:'3-5',grupo:"25",label:'GRUPO 25 FABRICACIÓN DE CALZADO E INDUSTRIA DEL CUERO',
          children:[
            {
              key:'3-5-0',
              fraccion:'251',
              actividad:'Fabricación de calzado, con maquinaria y/o equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación de calzado incluyendo el deportivo, y los moldeados de plástico. Excepto los moldeados de hule, clasificados en la fracción 321.'
            },
            {
              key:'3-5-1',
              fraccion:'252',
              actividad:'Fabricación de calzado, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación de calzado.'
            },
            {
              key:'3-5-2',
              fraccion:'253',
              actividad:'Curtido y acabado de cuero y piel.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al curtido y acabado de cuero y piel de animales, así como trabajos de taxidermia.'
            },
            {
              key:'3-5-3',
              fraccion:'254',
              actividad:'Manufactura de artículos de cuero, piel y sucedáneos, en forma artesanal.',
              clave:'II',
              descripcion:'Comprende a las empresas que en forma artesanal, sin empleo de maquinaria ni equipo motorizado ni procesos de producción en serie, se dedican a la manufactura de artículos de cuero, piel y telas plásticas sintéticas o artificiales. Excepto calzado y prendas de vestir.'
            },
            {
              key:'3-5-4',
              fraccion:'255',
              actividad:'Fabricación de artículos de cuero, piel y sucedáneos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación con procesos mecanizados o de producción en serie de artículos de cuero, piel y sucedáneos como maletas, baúles, portafolios, bolsas de mano, carteras, cigarreras, cinturones, monederos, sillas de montar, arneses, látigos, artículos de talabartería. Excepto calzado y prendas de vestir.'
            },
            {
              key:'3-5-5',
              fraccion:'256',
              actividad:'Curtido y acabado de cuero y piel, con uso exclusivo de maquinaria y/o equipo motorizado.',
              clave:'V',
              descripcion:'Comprende a las empresas que con la utilización exclusiva de maquinaria y/o equipo motorizado, realizan la totalidad del proceso productivo para el curtido y acabado de cuero y piel de animales.'
            },
          ]
        },
        {key:'3-6',grupo:"26",label:'GRUPO 26 INDUSTRIA Y PRODUCTOS DE MADERA Y CORCHO; EXCEPTO MUEBLES',
          children:[
            {
              key:'3-6-0',
              fraccion:'261',
              actividad:'Fabricación de productos de aserradero.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al derribo de árboles y aserrado de maderas para obtener postes, polines, vigas, tableros macizos, tableros aglomerados, contrachapados (triplay) y otros similares. Incluye la impregnación, desflemado, estufado y otras operaciones de preparación y conservación de madera.'
            },
            {
              key:'3-6-1',
              fraccion:'262',
              actividad:'Fabricación de artículos y accesorios de madera.',
              clave:'V',
              descripcion:'Comprende a las empresas que con maderas ya tratadas o trabajadas, provistas por aserraderos o madererías, se dedican a fabricar partes o estructuras completas de cancelería, marcos, molduras, lambrines, duelas, parquets, puertas, ventanas, escaleras, cimbras, closets, monturas para cuadros y espejos, cajas, envases, empaques, toneles, barricas, ataúdes; artículos como palillos, hormas, tacones, abatelenguas, mangos para herramientas y enseres de limpieza, carretes, poleas, lanzaderas, modelos o matrices, patrones de madera, perillas, reglas, rodillos, tapones y similares. Incluye las artesanías y juguetes a base de madera. Excepto muebles.'
            },
            {
              key:'3-6-2',
              fraccion:'263',
              actividad:'Manufactura de artículos de corcho, palma, vara, carrizo y mimbre.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la manufactura en forma artesanal de artículos de corcho, cestería ornamental y decoración, sombreros de palma, escobas, escobillas, escobetas, cepillos, plumeros, brochas, pinceles y similares, a base de palma, vara, carrizo y mimbre. Excepto muebles.'
            },
            {
              key:'3-6-3',
              fraccion:'264',
              actividad:'Fabricación de artículos de corcho, palma, vara, carrizo y mimbre',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a fabricar artículos de corcho, cestería ornamental y decoración; sombreros de palma, escobas, escobillas, escobetas, cepillos, plumeros, brochas, pinceles y similares, a base de palma, vara, carrizo y mimbre. Excepto muebles.'
            },
          ]
        },
        {key:'3-7',grupo:"27",label:'GRUPO 27 FABRICACIÓN Y/O REPARACIÓN DE MUEBLES DE MADERA Y SUS PARTES; EXCEPTO LOS DE METAL Y DE PLÁSTICO MOLDEADO',
          children:[
            {
              key:'3-7-0',
              fraccion:'271',
              actividad:'Fabricación y/o reparación de muebles de madera y sus partes.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de muebles de madera y sus partes para uso doméstico, comercial, industrial o de oficinas. Incluye la fabricación, ensamble y/o reparación de armazones, bastidores, colchones, sofás, sofás cama, mamparas, persianas y otros; así como el tapizado de muebles en general. Excepto la fabricación de muebles de plástico moldeado o metal, clasificados en las fracciones 322 y 353, respectivamente.'
            },
          ]
        },
        {key:'3-8',grupo:"28",label:'GRUPO 28 INDUSTRIA DEL PAPEL',
          children:[
            {
              key:'3-8-0',
              fraccion:'281',
              actividad:'Fabricación de papel y/o cartón y sus derivados.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de papel y/o cartón y sus derivados. Incluye la producción de celulosa, pasta y pulpas de madera y otras plantas, así como aquéllas que en forma simultánea a la fabricación, elaboran artículos diversos a base de dichos materiales.'
            },
            {
              key:'3-8-1',
              fraccion:'282',
              actividad:'Fabricación de artículos a base de papel y/o cartón.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con papel y/o cartón se dedican a fabricar cajas, envases, bolsas, papel para copiar o reportar, papel engomado, sobres, tarjetas, papel de escribir, cuadernos, bloques, láminas de cartón impermeabilizadas, papel y toallas higiénicas, pañales desechables y otros, cuando no se fabriquen en forma simultánea a la producción del papel o pasta de celulosa.'
            },
          ]
        },
        {key:'3-9',grupo:"29",label:'GRUPO 29 INDUSTRIAS EDITORIAL, DE IMPRESIÓN Y CONEXAS',
          children:[
            {
              key:'3-9-0',
              fraccion:'291',
              actividad:'Industrias editorial, de impresión, encuadernación y actividades conexas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a realizar trabajos de edición, impresión y/o encuadernación de periódicos, revistas, libros y similares, así como la fabricación de calcomanías, trabajos de serigrafía, litografía, process, fotograbado y rotograbado, grabado en placas metálicas, fabricación de clisés, tipos para imprentas y otros trabajos relacionados con la impresión y edición. Incluye trabajos de fotolito.'
            },
          ]
        },
        {key:'3-10',grupo:"30",label:'GRUPO 30 INDUSTRIA QUÍMICA',
          children:[
            {
              key:'3-10-0',
              fraccion:'301',
              actividad:'Fabricación de sustancias químicas e industriales; excepto abonos.',
              clave:'III',
              descripcion:'Comprende a las empresas que con productos petroquímicos básicos y/o materias primas elementales o compuestas derivadas de la carboquímica básica y de las industrias extractivas, se dedican por cualquier método a la fabricación de productos químicos orgánicos e inorgánicos básicos; incluye la fabricación de pigmentos y materias colorantes, carbón activado, gases industriales, ácidos, óxidos, bases, sales y otras sustancias químicas industriales; excepto abonos y productos clasificados en las fracciones subsecuentes del Grupo 30.'
            },
            {
              key:'3-10-1',
              fraccion:'302',
              actividad:'Fabricación de abonos, fertilizantes y plaguicidas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de abonos o fertilizantes nitrogenados, fosfatados y potásicos, así como aquéllas que se dedican a la formulación y preparación de plaguicidas, tales como: insecticidas, raticidas, fungicidas, herbicidas, así como otros productos químicos para uso agropecuario. Se incluye la producción de ácido sulfúrico, fosfórico y nítrico que se obtiene en forma simultánea en fábricas de fertilizantes.'
            },
            {
              key:'3-10-2',
              fraccion:'303',
              actividad:'Fabricación de resinas sintéticas y plastificantes.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican con procesos de polimerización y policondensación a la fabricación de resinas líquidas y sólidas, tales como: polietileno, poliestireno, poliuretano, policloruro de vinilo, poliacetato de vinilo, silicones, alquidálicas, fenólicas, polimetacrilato de metilo, epóxicas, poliamidas y otras similares. Incluye la fabricación de hule o caucho sintético.'
            },
            {
              key:'3-10-3',
              fraccion:'304',
              actividad:'Industria de las pinturas.',
              clave:'III',
              descripcion:'Comprende a las empresas que con materiales colorantes o pigmentos orgánicos e inorgánicos, disolventes y otros provenientes de la industria química básica, se dedican a la fabricación de pinturas, barnices, lacas, esmaltes, tintas. Incluye la fabricación de aguarrás, brea, colofonia, derivados de resinas de la madera como: disolventes, lejías, gomas, alquitranes, pegamentos, adhesivos, aprestos, compuestos impermeabilizantes y otros productos similares.'
            },
            {
              key:'3-10-4',
              fraccion:'305',
              actividad:'Industrias químico-farmacéuticas y de medicamentos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la industrialización de materias primas químico-farmacéuticas, a través de extracción, desarrollo, síntesis y otros similares, así como a la fabricación de medicamentos, acondicionamiento y/o envase de los mismos.'
            },
            {
              key:'3-10-5',
              fraccion:'307',
              actividad:'Fabricación de productos químicos para limpieza y aromatizantes ambientales.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de jabones, detergentes, desinfectantes, lustradores, aromatizantes ambientales y otros productos para lavado y aseo.'
            },
            {
              key:'3-10-6',
              fraccion:'308',
              actividad:'Fabricación de perfumes y cosméticos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la formulación, elaboración y/o envase de esencias, perfumes, cosméticos, lociones, desodorantes, fijadores para el cabello y otros productos de tocador.'
            },
            {
              key:'3-10-7',
              fraccion:'309',
              actividad:'Fabricación de aceites y grasas vegetales y animales no comestibles, para usos industriales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que fabrican aceites y grasas vegetales y animales no comestibles, para usos industriales. Incluye aquéllas que realicen parte del proceso productivo como la extracción, refinación, hidrogenación, blanqueo, epoxidación, polimerización, esterificación, purificación y otros similares para los aceites y grasas de uso industrial.'
            },
            {
              key:'3-10-8',
              fraccion:'3010',
              actividad:'Fabricación de velas, veladoras y similares.',
              clave:'III',
              descripcion:'Comprende a las empresas que a partir de parafinas, sebo y cera se dedican a la fabricación de velas, veladoras, cirios y similares.'
            },
            {
              key:'3-10-9',
              fraccion:'3012',
              actividad:'Fabricación de cerillos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de cerillos de seguridad, de sesquisulfuro y otros similares.'
            },
            {
              key:'3-10-10',
              fraccion:'3013',
              actividad:'Fabricación de explosivos y fuegos artificiales.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de explosivos, productos de pirotecnia y similares.'
            }, 
            {
              key:'3-10-11',
              fraccion:'3014',
              actividad:'Otros productos de las industrias químicas conexas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a fabricar compuestos y productos químicos, no especificados en las fracciones anteriores, con compuestos químicos adquiridos de la industria química básica o secundaria.'
            },
            {
              key:'3-10-12',
              fraccion:'3016',
              actividad:'Fabricación de fibras artificiales y sintéticas.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de fibras celulósicas y no celulósicas tales como rayón, nylon, poliéster, acrilán, elastoméricas y polipropileno, con o sin la realización de los procesos de estirado y texturizado de las fibras. Incluye la fabricación de película celulósica transparente (celofán), así como la fabricación de película transparente de polipropileno y cuerdas para llantas.'
            },
          ]
        },
        {key:'3-11',grupo:"31",label:'GRUPO 31 REFINACIÓN DEL PETRÓLEO Y DERIVADOS DEL CARBÓN MINERAL',
          children:[
            {
              key:'3-11-0',
              fraccion:'311',
              actividad:'Refinación del petróleo crudo y petroquímica básica.',
              clave:'IV',
              descripcion:'Se considera la refinación del petróleo crudo y a la industria petroquímica básica, aunque su manejo esté reservado en forma exclusiva al Estado. Incluye la fabricación de gasolinas, aceites pesados, asfaltos, parafinas y otros productos derivados de la refinación del petróleo crudo.'
            },
            {
              key:'3-11-1',
              fraccion:'312',
              actividad:'Fabricación de lubricantes y aditivos.',
              clave:'III',
              descripcion:'Comprende a las empresas que con compuestos derivados del petróleo o de origen mineral, se dedican a la fabricación de aceites y grasas lubricantes y aditivos. Incluye a las empresas que se dedican por medios químicos o físicos a la regeneración de los mismos.'
            },
            {
              key:'3-11-2',
              fraccion:'313',
              actividad:'Fabricación de productos a base de asfalto y sus mezclas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de materiales para pavimentación, mastiques, losetas, láminas de cartón asfaltadas y otros productos similares a base de asfalto y sus mezclas.'
            },
          ]
        },
        {key:'3-12',grupo:"32",label:'GRUPO 32 FABRICACIÓN DE PRODUCTOS DE HULE Y PLÁSTICO',
          children:[
            {
              key:'3-12-0',
              fraccion:'321',
              actividad:'Fabricación de productos de hule.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de llantas, cámaras, empaques, retenes, rodillos, tapetes, bandas, poleas, topes, accesorios para automóviles, tubos, mangueras, planchas, hojas, hilos, juguetes, tacones, suelas, calzado moldeado, productos de uso higiénico y farmacéutico y otros similares de hule. Incluye la regeneración y vulcanización de llantas y otros productos de hule. Excepto el parchado de llantas y cámaras clasificadas en la fracción 891.'
            },
            {
              key:'3-12-1',
              fraccion:'322',
              actividad:'Fabricación de productos de plástico.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con compuestos provenientes de la industria química básica, fabrican muebles, láminas, perfiles, tubos, envases, envolturas, rollos y otros artículos y materiales de plástico, obtenidos por medio de moldeo, inyección, laminación, extrusión, prensado y otros procesos similares. Incluye los artículos y materiales a base de baquelita. Excepto la fabricación de resinas y materias plásticas sintéticas o artificiales clasificadas en la fracción 303.'
            },
            {
              key:'3-12-2',
              fraccion:'323',
              actividad:'Fabricación de productos de látex.',
              clave:'V',
              descripcion:'Comprende a las empresas que a base de látex natural, se dedican mediante el proceso industrial de inmersión, a la fabricación de productos para usos quirúrgicos, higiénico y farmacéutico, domésticos e industriales, tales como sondas, catéteres, protectores para prótesis, calzones, preservativos, tetillas para biberón, guantes, globos y otros productos diversos.'
            },
          ]
        },
        {key:'3-13',grupo:"33",label:'GRUPO 33 FABRICACIÓN DE PRODUCTOS DE MINERALES NO METÁLICOS; EXCEPTO DEL PETRÓLEO Y DEL CARBÓN MINERAL',
          children:[
            {
              key:'3-13-0',
              fraccion:'331',
              actividad:'Manufactura de artículos de alfarería y cerámica.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la manufactura de artículos de alfarería y cerámica. Incluye a los fabricantes de moldes, modelos y artículos de yeso. Excepto la fabricación de artículos de loza y porcelana; muebles sanitarios y sus accesorios; productos de arcilla para la construcción y ladrillos, clasificados por separado.'
            },
            {
              key:'3-13-1',
              fraccion:'332',
              actividad:'Fabricación de muebles sanitarios, loza, porcelana y artículos refractarios',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de muebles sanitarios y sus accesorios, loza, porcelana, artículos refractarios y similares. Excepto la fabricación de azulejos, clasificados en las fracciones 339 o 3312.'
            },
            {
              key:'3-13-2',
              fraccion:'333',
              actividad:'Fabricación de vidrio y/o productos de vidrio.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y regeneración de vidrio para obtener materiales y productos como vidrio en masa, en bolas, barras, varillas o tubos, templado, refractario, colado, laminado, estirado o soplado, chapado, desbastado o pulido de superficie no lisa, vidrio multicelular en bloques, baldosas, placas, paneles y formas análogas, recipientes para transporte o envase, tapones y otros dispositivos de cierre, ampollas, objetos para laboratorio, higiene, farmacia, artísticos, decorativos, ornamentales, espejos, cristalería tallada y otros. Incluye la fabricación de emplomados (vitrales); fibras y lana de vidrio, así como la manufactura de estos materiales.'
            },
            {
              key:'3-13-3',
              fraccion:'335',
              actividad:'Fabricación de productos de arcilla para la construcción.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de ladrillos, bloques, baldosas, tejas, tubos y otros artículos de arcilla para la construcción. Excepto la fabricación de azulejos, muebles sanitarios y sus accesorios, clasificados por separado.'
            },
            {
              key:'3-13-4',
              fraccion:'336',
              actividad:'Fabricación de cal y yeso.',
              clave:'V',
              descripcion:'Comprende a las empresas que fabrican cal y/o yeso. Incluye a aquéllas que en forma simultánea a la fabricación del yeso, obtengan productos como: tablarroca, bloques, láminas, tableros, plafones y otros similares.'
            },
            {
              key:'3-13-5',
              fraccion:'337',
              actividad:'Fabricación de productos a base de asbesto.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de hilos, tejidos, prendas de vestir, empalmes de asbesto, empaques, envolturas, productos para usos calorífugos, guarniciones de fricción (segmentos, discos, arandelas, cintas, planchas, placas, rollos y artículos análogos para frenos, embragues o aplicaciones similares) y otros productos de asbesto.'
            },
            {
              key:'3-13-6',
              fraccion:'338',
              actividad:'Fabricación de productos abrasivos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de piedras, muelas, cabezas, discos, puntas, diamantes industriales y otras formas para pulir, amolar, afilar, esmerilar, rectificar o cortar, a base de carburo de silicio, óxido de aluminio, carburo de tungsteno y otros abrasivos. Incluso abrasivos en polvo o en grano aplicados sobre tejidos, papel, cartón y otros materiales similares.'
            },
            {
              key:'3-13-7',
              fraccion:'339',
              actividad:'Fabricación de granito artificial, productos de mármol y otras piedras.',
              clave:'V',
              descripcion:'Comprende a las empresas que con materiales provenientes de la industria extractiva, se dedican a la fabricación de granito artificial, al corte, pulido y laminado de mármol y otras piedras, para obtener mosaicos, losetas, baldosas, adoquines, losas para pavimentos, azulejos, piedras para acabados y ornamentación en la construcción, lápidas y productos a base de granito artificial, mármol y otras piedras.'
            },
            {
              key:'3-13-8',
              fraccion:'3310',
              actividad:'Fabricación de productos y partes preconstruidas de concreto.',
              clave:'V',
              descripcion:'Comprende a las empresas que a base de concreto, se dedican a la fabricación de tubos, bloques, vigas, postes, tabiques, módulos para casas, lavaderos y otras partes preconstruidas de concreto. Excepto los productos y partes de asbesto-cemento, de granito y el montaje de los productos mencionados, clasificados por separado.'
            },
            {
              key:'3-13-9',
              fraccion:'3312',
              actividad:'Fabricación de azulejos, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que, con procesos continuos automatizados, se dedican a la fabricación de productos tales como azulejos, losetas y similares.'
            },
            {
              key:'3-13-10',
              fraccion:'3313',
              actividad:'Fabricación de vidrio y/o productos de vidrio, con procesos continuos automatizados.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican por medio de procesos continuos automatizados, a la fabricación y regeneración de vidrio para obtener materiales y productos como vidrio en masa, en bolas, barras, varillas o tubos, templado, refractario, colado, laminado, estirado o soplado, chapado, desbastado o pulido de superficie no lisa, vidrio multicelular en bloques, baldosas, placas, paneles y formas análogas, recipientes para transporte o envase, tapones y otros dispositivos de cierre, ampollas, objetos para laboratorio, higiene, farmacia, artísticos, decorativos, ornamentales, espejos, cristalería tallada y otros. Incluye la fabricación de fibras y lana de vidrio, así como la manufactura de estos materiales.'
            },
            {
              key:'3-13-11',
              fraccion:'3315',
              actividad:'Fabricación de productos de asbesto-cemento.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de tubos, recipientes, láminas acanaladas y lisas y otros productos a base de asbesto-cemento.'
            },
            {
              key:'3-13-12',
              fraccion:'3316',
              actividad:'Fabricación de cemento.',
              clave:'V',
              descripcion:'Comprende a las empresas que fabrican cemento hidráulico, puzolánico, blanco y otros tipos. Incluye el mortero.'
            },
            {
              key:'3-13-13',
              fraccion:'3317',
              actividad:'Fabricación de concreto premezclado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que a base de mezclas de cemento, arena, grava, aditivos y agua, se dedican a la fabricación de concreto premezclado.'
            },
          ]
        },
        {key:'3-14',grupo:"34",label:'GRUPO 34 INDUSTRIAS METÁLICAS BÁSICAS',
          children:[
            {
              key:'3-14-0',
              fraccion:'341',
              actividad:'Industrias básicas del hierro, acero y metales no ferrosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de productos primarios de hierro, acero y metales no ferrosos, tales como: ferroaleaciones, arrabio, fierro esponja, aceros especiales, planchón, tocho, palanquilla, varilla corrugada, alambrón, barras, rieles, plancha, tubos y otros productos primarios de hierro o acero y de metales no ferrosos. Incluye a empresas que realicen todo el proceso de transformación o parte de él, desde la fundición, afinación y refinación, hasta la fase de productos semiacabados por laminación, vaciado, moldeado, extrusión, trefilado, forjado y otros procesos para obtener alambre, perfiles estructurales, láminas, hojas, cintas, hojalata, cañerías, piezas fundidas y otros; así como a las dedicadas al aprovechamiento de chatarra para obtener piezas fundidas y coladas.'
            },
            {
              key:'3-14-1',
              fraccion:'342',
              actividad:'Industrias básicas del hierro, acero y metales no ferrosos, con procesos automatizados.',
              clave:'V',
              descripcion:'Comprende a las empresas que, con la utilización exclusiva de procesos automatizados, se dedican a la fabricación de productos primarios de hierro, acero y metales no ferrosos, tales como: ferroaleaciones, arrabio, fierro esponja, aceros especiales, planchón, tocho, palanquilla, varilla corrugada, alambrón, barras, rieles, plancha, tubos y otros productos primarios de hierro o acero y de metales no ferrosos. Incluye a empresas que realicen todo el proceso de transformación o parte de él, desde la fundición, afinación y refinación, hasta la fase de productos semiacabados por laminación, vaciado, moldeado, extrusión, trefilado, forjado y otros procesos para obtener alambre, perfiles estructurales, láminas, hojas, cintas, hojalata, cañerías, piezas fundidas y otros; así como a las dedicadas al aprovechamiento de chatarra para obtener piezas fundidas y coladas.'
            },
          ]
        },
        {key:'3-15',grupo:"35",label:'GRUPO 35 FABRICACIÓN DE PRODUCTOS METÁLICOS; EXCEPTO MAQUINARIA Y EQUIPO',
          children:[
            {
              key:'3-15-0',
              fraccion:'351',
              actividad:'Fabricación de utensilios agrícolas, herramientas y artículos de ferretería y cerrajería.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de palas, picos, azadones, horquillas, rastrillos, hachas, hocinas, guadañas, hoces, machetes y otras herramientas agrícolas; serruchos, seguetas, útiles intercambiables para máquinas herramientas o de mano, buriles, brocas, pijas, pernos, tuercas, pasadores, tornillos, tensores, grilletes, chavetas, ganchos, armellas, remaches, clavos, tachuelas, clavijas, arandelas, guarniciones y herrajes, cierrapuertas automáticos, perchas, ménsulas, chapas, candados, llaves, cerraduras, accesorios metálicos para baños y otros artículos y utensilios. Incluye espuelas, herraduras y frenos para animales.'
            },
            {
              key:'3-15-1',
              fraccion:'352',
              actividad:'Fabricación y/o reparación de puertas, ventanas, cortinas metálicas y otros trabajos de herrería.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de puertas, ventanas, rejas, cortinas, escaleras, barandales y otros artículos de metal. Incluye la fabricación de juegos metálicos infantiles no motorizados. Excepto las empresas que en forma simultánea con la fabricación de los productos mencionados instalen los mismos, así como aquéllas que realicen exclusivamente la instalación de los productos mencionados, las que se clasifican en la fracción 423.'
            },
            {
              key:'3-15-2',
              fraccion:'353',
              actividad:'Fabricación, ensamble y/o reparación de muebles metálicos y sus partes.',
              clave:'IV',
              descripcion:'Comprende a las empresas dedicadas a fabricar, ensamblar y/o reparar unidades terminadas o partes de muebles y equipos metálicos y sus partes para uso doméstico, comercial, de oficina, profesional y científico como gabinetes, camas, ataúdes, mesas, sillería, escritorios, archiveros, estanterías, cajas fuertes, cajas de seguridad, libreros, muebles y equipo para restaurantes, peluquerías, salas de belleza, centros comerciales y hospitales.'
            },
            {
              key:'3-15-3',
              fraccion:'354',
              actividad:'Fabricación y/o reparación de estructuras metálicas, tanques, calderas y similares.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o reparación de estructuras metálicas, tanques, calderas, recipientes de placa metálica estacionarios o para montarse sobre vehículos de transporte. Incluye estructuras para puentes, juegos electromecánicos, depósitos elevados, hangares, torres, castilletes, columnas y otros sistemas de soporte estructurales.'
            },
            {
              key:'3-15-4',
              fraccion:'355',
              actividad:'Fabricación de envases metálicos, corcholatas y tapas.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a fabricar envases metálicos a base de: hojalata, aluminio, acero inoxidable, lámina galvanizada y otras aleaciones; así como la fabricación de corcholatas y tapas de los envases. Excepto tanques y recipientes de placa metálica considerados en la fracción 354.'
            },
            {
              key:'3-15-5',
              fraccion:'356',
              actividad:'Fabricación de alambres y otros productos de alambre.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de alambres y productos de alambre, tales como: alambrados, telas metálicas, cables, cordajes, cordones, trenzas, eslingas, resortes, fibra metálica, ganchos para ropa, jaulas, rejillas, alambres recubiertos, soldadura de alambre y electrodos, así como otros artículos similares a base de alambre. Excepto los alambres para conducción de energía eléctrica, clasificados en la fracción 378.'
            },
            {
              key:'3-15-6',
              fraccion:'357',
              actividad:'Trabajos de tratamientos térmicos y galvanoplastia.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican exclusivamente a trabajos de tratamientos térmicos y galvanoplastia, tales como: normalizado, relevado, revenido, patentado, templado, cromado, niquelado, cobrizado, anodizado, estañado, plateado, tropicalizado y otros. Incluye a empresas que realicen procesos de pulido, limpieza con chorro de arena o granalla de acero, decapado, pintado, esmaltado y otros procesos de preparación o acabado. Excepto empresas que realicen estos trabajos como parte de su proceso productivo en la fabricación de un producto, clasificadas por separado.'
            },
            {
              key:'3-15-7',
              fraccion:'358',
              actividad:'Fabricación de agujas, alfileres, cierres, botones y navajas para rasurar.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de agujas, alfileres, cierres, botones, pasacintas, ganchillos, cuentas, lentejuelas, chaquiras, horquillas, rizadores, grapas, clips y navajas para rasurar.'
            },
            {
              key:'3-15-8',
              fraccion:'359',
              actividad:'Fabricación de baterías de cocina, cucharas, cuchillos y tenedores.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de ollas, sartenes, charolas, ollas express, cafeteras, moldes para hornear, cazuelas, cucharas, tenedores, cuchillos, abrelatas, destapadores, peladores, rebanadores y otros artefactos de uso doméstico similares.'
            },
            {
              key:'3-15-9',
              fraccion:'3510',
              actividad:'Fabricación de otros productos metálicos maquinados.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de artículos o partes metálicas diversas, obtenidos por procesos de maquinado como: torneado, fresado, mandrilado, rectificado, prensado, troquelado, forjado, sinterizado, doblado, rechazado y otros maquinados. Incluye corte con oxígeno, sierra mecánica, cizalla y otros.'
            },
            {
              key:'3-15-10',
              fraccion:'3511',
              actividad:'Tratamientos térmicos y galvanoplastia, con procesos continuos automatizados.',
              clave:'III',
              descripcion:'Comprende a las empresas que con procesos continuos automatizados, se dedican exclusivamente a trabajos de tratamientos térmicos y galvanoplastia, tales como: normalizado, relevado, revenido, patentado, templado, cromado, niquelado, cobrizado, anodizado, estañado, plateado, tropicalizado y otros. Excepto empresas que realicen estos trabajos como parte de su proceso productivo en la fabricación de un producto, clasificadas por separado.'
            },
          ]
        },
        {key:'3-16',grupo:"36",label:'GRUPO 36 FABRICACIÓN, ENSAMBLE Y/O REPARACIÓN DE MAQUINARIA, EQUIPO Y SUS PARTES; EXCEPTO LOS ELÉCTRICOS',
          children:[
            {
              key:'3-16-0',
              fraccion:'361',
              actividad:'Fabricación y/o ensamble de maquinaria, equipos e implementos para labores agropecuarias.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de sembradoras, cosechadoras, segadoras, trilladoras, fertilizadoras, cortadoras, arados, rastras, ordeñadoras y otros equipos, implementos y máquinas para labores agropecuarias. Excepto tractores clasificados en la fracción 363.'
            },
            {
              key:'3-16-1',
              fraccion:'362',
              actividad:'Fabricación y/o ensamble de maquinaria, equipo e implementos para las industrias de alimentos, bebidas, tabacalera, textil, calzado, madera, cuero, impresión, hule, plástico, productos de minerales no metálicos (excepto cemento), metal mecánica y maquinaria y equipo de uso común a varias industrias.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de implementos, equipos y máquinas especiales para las industrias señaladas. Incluye la fabricación de bombas, motores (excepto los eléctricos y automotrices), compresores, centrifugadores, aparatos de filtración, calefacción y refrigeración, equipos de elevación, carga, descarga y manipulación (carretillas, polipastos, grúas, montacargas, escaleras electromecánicas, bandas transportadoras, elevadores para personas y mercancías y otros), básculas, herramientas neumáticas (pistolas aerográficas, extintores, aparatos de chorro de arena) y otros equipos y máquinas de uso común a varias industrias.No se considera en esta fracción la fabricación y/o ensamble de implementos, equipos y máquinas clasificados por separado.'
            },
            {
              key:'3-16-2',
              fraccion:'363',
              actividad:'Fabricación y/o ensamble de maquinaria, equipo e implementos para las industrias de la construcción, extractivas, papel, cemento, petroquímica básica, química; metálicas básicas del hierro, del acero y de metales no ferrosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de implementos, equipos y máquinas especiales para las industrias señaladas. Incluye la fabricación de tractores para labores agropecuarias e industriales. No se considera en esta fracción la fabricación y/o ensamble de implementos, equipos y máquinas clasificados por separado.'
            },
            {
              key:'3-16-3',
              fraccion:'364',
              actividad:'Fabricación y/o ensamble de máquinas de coser, oficina, cómputo y sus partes.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de máquinas de coser, de escribir, protectoras de cheques, calculadoras, registradoras, franqueadoras de correspondencia, sus partes y otras máquinas de oficina. Incluye la fabricación de equipo de cómputo o de procesamiento electrónico de datos y sus periféricos. Excepto los equipos de comunicación, clasificados en la fracción 372.'
            },
            {
              key:'3-16-4',
              fraccion:'365',
              actividad:'Reparación y ensamble de máquinas de coser y de oficina.',
              clave:'I',
              descripcion:'Comprende a las empresas que con partes y accesorios provenientes de otras empresas, se dedican a la reparación y ensamble de máquinas de coser y de oficina. Excepto el ensamble y/o reparación de equipos de cómputo, clasificados en las fracciones 364 y 6711, respectivamente.'
            },
            {
              key:'3-16-5',
              fraccion:'366',
              actividad:'Fabricación de partes y piezas sueltas, para maquinaria y equipo en general.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de partes y piezas sueltas para maquinaria y equipo en general.'
            },
            {
              key:'3-16-6',
              fraccion:'367',
              actividad:'Reparación y/o mantenimiento de maquinaria y equipo en general.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la reparación y/o mantenimiento de maquinaria y equipo en general. Excepto empresas que se dediquen a la instalación de maquinaria y equipo en general, clasificadas en la fracción 843.'
            },
          ]
        },
        {key:'3-17',grupo:"37",label:'GRUPO 37 FABRICACIÓN Y/O ENSAMBLE DE MAQUINARIA, EQUIPOS, APARATOS, ACCESORIOS Y ARTÍCULOS ELÉCTRICOS, ELECTRÓNICOS Y SUS PARTES',
          children:[
            {
              key:'3-17-0',
              fraccion:'371',
              actividad:'Fabricación y/o ensamble de maquinaria y equipo para generación y transformación de energía eléctrica.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de generadores, motogeneradores, motorreductores, transformadores, reguladores, alternadores, rectificadores, motores eléctricos, punteadoras, soldadoras eléctricas y otros equipos y máquinas para generación y transformación de energía eléctrica. Excepto la fabricación y/o ensamble de partes para el sistema eléctrico de vehículos automóviles, clasificadas en la fracción 384.'
            },
            {
              key:'3-17-1',
              fraccion:'372',
              actividad:'Fabricación y/o ensamble de equipo y aparatos de radio, televisión y comunicaciones.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de aparatos de radio y televisión, grabadores o reproductores de la imagen o del sonido, equipos de telefonía, télex, radar, telegrafía, micrófonos, audífonos, altavoces, amplificadores y otros aparatos y equipos de radio, televisión y comunicaciones. Incluye a las empresas que en forma simultánea a la fabricación de los equipos y aparatos antes mencionados, fabriquen y/o ensamblen sus partes.'
            },
            {
              key:'3-17-2',
              fraccion:'373',
              actividad:'Fabricación y/o grabado de discos y cintas magnéticas para sonidos, imágenes y datos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o grabado de discos y cintas magnéticas para sonidos, imágenes y datos. Incluye el ensamble de los artículos mencionados en cartuchos.'
            },
            {
              key:'3-17-3',
              fraccion:'374',
              actividad:'Fabricación y/o ensamble de aparatos eléctricos y sus partes para uso doméstico.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de unidades terminadas o partes de batidoras, tostadores, freidoras, sartenetas, cafeteras, hornos de microondas, planchas, licuadoras, extractores de jugo, aspiradoras, enceradoras, máquinas para afeitar, cortar y secar el pelo, ventiladores y otros aparatos eléctricos similares para uso doméstico o comercial. Incluye a las empresas que además de fabricar alguno(s) de los aparatos anteriormente señalados, fabrican y/o ensamblan refrigeradores, lavadoras, estufas y otros equipos similares para uso doméstico. Las empresas que se dedican en forma exclusiva a fabricar y/o ensamblar refrigeradores, lavadoras, estufas y otros equipos similares, se clasifican por separado en la fracción 3712.'
            },
            {
              key:'3-17-4',
              fraccion:'375',
              actividad:'Fabricación, reconstrucción y/o ensamble de acumuladores eléctricos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, reconstrucción y/o ensamble de acumuladores eléctricos (húmedos) para usos diversos.'
            },
            {
              key:'3-17-5',
              fraccion:'376',
              actividad:'Fabricación y/o ensamble de pilas (secas), componentes eléctricos y electrónicos diversos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de pilas secas, partes e implementos eléctricos o electrónicos como escobillas de carbón, carbones para lámparas, electrodos de carbón, cristales piezoeléctricos, diodos, transistores, microcircuitos electrónicos, condensadores eléctricos y similares.'
            },
            {
              key:'3-17-6',
              fraccion:'377',
              actividad:'Fabricación y/o ensamble de lámparas (focos) y tubos al vacío para alumbrado eléctrico.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de lámparas (focos) y tubos al vacío para alumbrado eléctrico. Incluye válvulas electrónicas de vacío, de vapor, de gas y de rayos catódicos. Excepto empresas que fabriquen aparatos denominados luminarias que provistos de lámparas (focos) sirven para alumbrar, clasificadas en la fracción 3710.'
            },
            {
              key:'3-17-7',
              fraccion:'378',
              actividad:'Fabricación de conductores eléctricos.',
              clave:'III',
              descripcion:'Comprende a las empresas dedicadas a la fabricación de alambres y cables desnudos y aislados empleados para la conducción de energía eléctrica.'
            },
            {
              key:'3-17-8',
              fraccion:'379',
              actividad:'Fabricación y/o ensamble de aparatos, accesorios eléctricos o electrónicos, para empalme, corte, protección y conexión.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de interruptores, arrancadores, relevadores, tableros, conmutadores, cortacircuitos, pararrayos, amortiguadores de onda, alarmas, tomas de corriente, pletinas y similares.'
            },
            {
              key:'3-17-9',
              fraccion:'3710',
              actividad:'Fabricación de luminarias y anuncios luminosos.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de luminarias que provistas de focos, se utilizan para iluminación teatral, doméstica, industrial, arquitectónica y otras similares. Incluye la fabricación de semáforos, anuncios luminosos y/o luminiscentes.'
            },
            {
              key:'3-17-10',
              fraccion:'3711',
              actividad:'Fabricación en serie o con procesos continuos de acumuladores eléctricos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican, mediante procesos continuos o líneas de producción en serie, a la fabricación y/o ensamble de acumuladores eléctricos (húmedos) para usos diversos.'
            },
            {
              key:'3-17-11',
              fraccion:'3712',
              actividad:'Fabricación y/o ensamble de refrigeradores, estufas, lavadoras, secadoras y otros aparatos de línea blanca.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican en forma exclusiva a la fabricación y/o ensamble de aparatos eléctricos para uso comercial y doméstico, tales como: refrigeradores, congeladores, estufas, hornos, lavadoras, secadoras, lava-vajillas y otros similares de línea blanca. Incluye calentadores.'
            },
          ]
        },
        {key:'3-18',grupo:"38",label:'GRUPO 38 CONSTRUCCIÓN, RECONSTRUCCIÓN Y ENSAMBLE DE EQUIPO DE TRANSPORTE Y SUS PARTES',
          children:[
            {
              key:'3-18-0',
              fraccion:'381',
              actividad:'Fabricación y/o ensamble de aeronaves.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de aeronaves.'
            },
            {
              key:'3-18-1',
              fraccion:'382',
              actividad:'Fabricación y/o ensamble de carrocerías para vehículos de transporte.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble, adaptación o conversión de carrocerías y remolques para vehículos de transporte. Excepto la fabricación y/o ensamble de tanques para vehículos de transporte clasificados en la fracción 354.'
            },
            {
              key:'3-18-2',
              fraccion:'383',
              actividad:'Fabricación y/o ensamble de partes y accesorios para automóviles, autobuses, camiones, motocicletas y bicicletas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble, para automóviles, autobuses, camiones, motocicletas y bicicletas, de muelles, amortiguadores, asientos, escapes y otras partes similares. Incluye accesorios tales como: espejos retrovisores, antenas, volantes, cinturones de seguridad y otros. Excepto las partes y/o componentes para motores, clasificadas por separado.'
            },
            {
              key:'3-18-3',
              fraccion:'384',
              actividad:'Fabricación y/o ensamble de partes para el sistema eléctrico de vehículos automóviles.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de bobinas, generadores, distribuidores, reguladores, alternadores, transformadores, bujías, platinos, sistemas de encendido y otras partes y accesorios para el sistema eléctrico de vehículos automóviles. Excepto la fabricación de acumuladores, clasificados en las fracciones 375 y 3711.'
            },
            {
              key:'3-18-4',
              fraccion:'385',
              actividad:'Fabricación y/o ensamble de bicicletas y otros vehículos de pedal.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de bicicletas, triciclos y otros vehículos de pedal similares para transporte de personas o mercancías. Excepto motocicletas clasificadas en la fracción 388.'
            },
            {
              key:'3-18-5',
              fraccion:'386',
              actividad:'Fabricación, ensamble y/o reparación de carros de ferrocarril, equipo ferroviario y sus partes.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, montaje, reconstrucción y/o reparación de equipo ferroviario, armazones, estructuras para locomotoras, carros comedor, carros dormitorio, autovía, locomotoras, tranvías, vagones de carga, de pasajeros, de plataforma, frigoríficos, carros para trenes urbanos (metro), suburbanos y sus partes.'
            },
            {
              key:'3-18-6',
              fraccion:'387',
              actividad:'Fabricación, ensamble y/o reparación de embarcaciones.',
              clave:'V',
              descripcion:'Comprende a las empresas dedicadas a trabajos de construcción, reconstrucción y/o reparación de barcos, lanchones, barcazas, yates y similares. Incluye a las empresas que se dedican a la conversión, modificación y desguace de embarcaciones. Excepto la reparación de lanchas, clasificada en la fracción 891.'
            },
            {
              key:'3-18-7',
              fraccion:'388',
              actividad:'Fabricación y/o ensamble de automóviles, autobuses, camiones y motocicletas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de automóviles, autobuses, camiones y motocicletas.'
            },
            {
              key:'3-18-8',
              fraccion:'389',
              actividad:'Fabricación y/o ensamble de motores para automóviles, autobuses y camiones.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de motores como producto final para su uso inmediato en la función para la que fue creado en automóviles, autobuses y camiones. Excepto empresas que se dedican a fabricar partes y/o componentes para estos motores, clasificadas por separado.'
            },
            {
              key:'3-18-9',
              fraccion:'3810',
              actividad:'Fabricación de conjuntos mecánicos y sus partes para automóviles, autobuses, camiones y motocicletas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la fabricación en serie de conjuntos mecánicos tales como: sistemas de transmisión, de dirección, de suspensión, de embrague, de frenos y otros, así como sus partes. Incluye a las empresas que se dedican exclusivamente a la fabricación de partes metálicas para motores de combustión interna (gasolina o diesel), tales como: monoblocks, pistones, bielas, anillos, engranes, cigüeñales, árboles de levas, cabezas de cilindros, balancines, bujes, inyectores, bombas (de enfriamiento, lubricación y combustible), múltiples (de admisión y escape), poleas, tapas cojinete (de cigüeñal y de árbol de levas), válvulas (para admisión y escape), carcazas, retenes de sello de aceite, flechas, camisas para cilindro, filtros (para aceite, combustibles y aire) y carburadores. Excepto empresas que fabriquen partes para motor, como tornillos, tuercas, arandelas, bandas, mangueras, cables, partes metálicas para soporte y otras, clasificadas por separado.'
            },
          ]
        },
        {key:'3-19',grupo:"39",label:'GRUPO 39 OTRAS INDUSTRIAS MANUFACTURERAS',
          children:[
            {
              key:'3-19-0',
              fraccion:'390',
              actividad:'Fabricación, ensamble y/o reparación de equipos, aparatos científicos y profesionales e instrumentos de medida y control.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble y/o reparación de equipos, aparatos e instrumentos científicos, profesionales, médicos, quirúrgicos, de laboratorio, prótesis, ortopedia, auditivos, de medida, control y otros similares; excepto muebles metálicos, básculas industriales y prótesis dentales, que se clasifican por separado.'
            },
            {
              key:'3-19-1',
              fraccion:'391',
              actividad:'Fabricación, ensamble y/o reparación de aparatos, instrumentos y accesorios de óptica y fotografía.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, ensamble y/o reparación de anteojos, lentes, aparatos e instrumentos ópticos, fotográficos y de fotocopiado. Incluye la fabricación de películas, placas, papel sensible y otros accesorios de óptica y fotografía.'
            },
            {
              key:'3-19-2',
              fraccion:'392',
              actividad:'Fabricación, montaje y/o ensamble de relojes, joyas, artículos de orfebrería y fantasía.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación, montaje y/o ensamble de relojes, joyas, artículos de orfebrería, de fantasía, mecanismos, conjuntos mecánicos, partes o componentes para relojes. Incluye el corte, grabado, tallado y pulido de piedras preciosas y metales utilizados en joyería.'
            },
            {
              key:'3-19-3',
              fraccion:'394',
              actividad:'Fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes y artículos deportivos, con maquinaria y/o equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes (excepto los de plástico moldeado y de madera, clasificados por separado). Incluye a las empresas que fabrican artículos deportivos que por los materiales, maquinaria o equipo utilizados y procesos de trabajo desarrollados no puedan clasificarse en las fracciones correspondientes de la División de las Industrias de Transformación.'
            },
            {
              key:'3-19-4',
              fraccion:'395',
              actividad:'Fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes y artículos deportivos, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación y/o ensamble de instrumentos musicales, paraguas, juguetes (excepto los de madera), artículos deportivos y otros similares.'
            },
            {
              key:'3-19-5',
              fraccion:'396',
              actividad:'Fabricación de lápices, gomas, plumas y bolígrafos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de plumas fuente, estilográficas, lapiceros, bolígrafos, puntillas, minas, portaminas, lápices, crayones, tizas, gomas, sellos de goma, cintas, correctores y cartuchos para máquinas de escribir, de registro e impresoras y otros artículos similares.'
            },
            {
              key:'3-19-6',
              fraccion:'397',
              actividad:'Talleres de mecánica dental.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la fabricación de prótesis dentales, tales como: placas, puentes, dentaduras, dientes artificiales y similares.'
            },
            {
              key:'3-19-7',
              fraccion:'398',
              actividad:'Fabricación y/o ensamble de armas de fuego portátiles, cartuchos, municiones y accesorios.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la fabricación y/o ensamble de armas de fuego portátiles, cartuchos, municiones y accesorios.'
            },
            {
              key:'3-19-8',
              fraccion:'399',
              actividad:'Fabricación, ensamble y/o reparación de otros artículos manufacturados no clasificados anteriormente, sin maquinaria ni equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a la fabricación, ensamble y/o reparación de artículos diversos no clasificados anteriormente.'
            },
            {
              key:'3-19-9',
              fraccion:'3910',
              actividad:'Fabricación, ensamble y/o reparación de otros artículos manufacturados no clasificados anteriormente, con maquinaria y/o equipo motorizado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a la fabricación, ensamble y/o reparación de artículos diversos no clasificados anteriormente.'
            },
          ]
        }
      ]
    },
    {key:'4',division:'4',label:'DIVISIÓN 4 INDUSTRIA DE LA CONSTRUCCIÓN',
      children:[
        {key:'4-0',grupo:"41",label:'GRUPO 41 CONSTRUCCIÓN DE EDIFICACIONES Y DE OBRAS DE INGENIERÍA CIVIL',
          children:[
            {
              key:'4-0-0',
              fraccion:'411',
              actividad:'Construcción de edificaciones; excepto obra pública.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la construcción, reparación, reformas y reconstrucciones de edificaciones residenciales y no residenciales, excepto cuando se trate de obra pública. Se incluye la construcción de casas, conjuntos habitacionales, hoteles, moteles, instalaciones y edificaciones comerciales, de oficinas y servicios tales como bancos, consultorios, tiendas de autoservicio, hospitales, cuarteles, iglesias, escuelas, teatros, cines y similares. No se considerarán dentro de esta fracción, sino de la 412, las edificaciones realizadas por patrones personas morales, así como por patrones personas físicas, cuando éstos acrediten de manera fehaciente que se dedican normalmente a actividades de construcción.'
            },
            {
              key:'4-0-1',
              fraccion:'412',
              actividad:'Construcciones de obras de infraestructura y edificaciones en obra pública.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la construcción, reparación, reformas, reconstrucción y supervisión de obras de urbanización y saneamiento, de electrificación, de comunicaciones y transporte, hidráulicas y marítimas, de excavación, nivelación de terrenos, topografía, cimentación, perforación de pozos, alumbrado, andamiaje, demolición, montaje de estructuras prefabricadas (metálicas o de concreto) y similares. Se considera la construcción de instalaciones y edificaciones agropecuarias, industriales, edificaciones especiales relacionadas con el transporte (estaciones de pasajeros y otras) y edificaciones industriales especiales (centrales telefónicas, telegráficas o eléctricas, industria química y otras). Obras de colección, disposición y tratamiento de aguas negras, potabilizadoras y redes de distribución; camellones, banquetas, calles, avenidas, bulevares, viaductos, pasos a desnivel, sistemas de señalamiento, alumbrado público y otras obras de urbanización y saneamiento; líneas telegráficas, telefónicas, incluso cables submarinos, télex, red de microondas, torres transmisoras de radio y televisión, tendido de líneas para transmisión por cable y otros similares, incluso radares y microondas; caminos, brechas, carreteras, autopistas, pistas de aeropuertos, sistemas ferroviarios y transporte urbano eléctrico, estructura de vías para transporte ferroviario, urbano, suburbano e interurbano, estaciones subterráneas y vías férreas (metro); oleoductos, gasoductos y conductos similares y otras obras de comunicación y transportes; presas, estaciones de bombeo, acueductos y redes de distribución de agua, canales y obras de riego, obras para control de inundaciones (malecones, diques pluviales y otras), dragado y eliminación de rocas submarinas, puertos, muelles, desembarcaderos, diques rompeolas y similares; canales de navegación y otras obras marítimas; estadios, campos y canchas deportivas; perforación de pozos de agua, petroleros o de gas; lagos y estanques artificiales; instalación y remodelación de esculturas, monumentos y otras obras de ingeniería civil no especificadas. Se incluyen las edificaciones a que se refiere la fracción 411, cuando se trate de obra pública, cuando sean realizadas por personas morales o cuando, tratándose de personas físicas, éstas acrediten de manera fehaciente que se dedican normalmente a actividades de construcción.'
            },
          ]
        },
        {key:'4-1',grupo:"42",label:'GRUPO 42 TRABAJOS REALIZADOS POR CONTRATISTAS ESPECIALIZADOS',
          children:[
            {
              key:'4-1-0',
              fraccion:'421',
              actividad:'Instalaciones sanitarias, eléctricas, de gas y de aire acondicionado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la instalación de sistemas sanitarios, de plomería y fontanería, de sistema eléctrico, intercomunicación y de alarma, de sistemas de aire acondicionado, de redes de distribución de gas combustible e instalaciones similares. Incluye la modificación, ampliación o mantenimiento y reparación de las instalaciones mencionadas, así como la limpieza del alcantarillado, caños y tuberías.'
            },
            {
              key:'4-1-1',
              fraccion:'422',
              actividad:'Instalación y reparación de ascensores, escaleras electromecánicas y otros equipos para transportación.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la instalación de ascensores, escaleras electromecánicas y otros equipos o sistemas para elevación o transportación. Incluye la modificación, ampliación, mantenimiento y reparación de los equipos mencionados.'
            },
            {
              key:'4-1-2',
              fraccion:'423',
              actividad:'Instalación de ventanería, herrería, cancelería, vidrios y cristales.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la instalación de ventanería, herrería, cancelería (metálica, de madera u otros materiales), vitrales, vidrios, cristales y otros trabajos similares. Incluye la modificación, ampliación, mantenimiento y reparación de las instalaciones mencionadas y a las empresas que en forma simultánea fabrican e instalan los productos mencionados.'
            },
            {
              key:'4-1-2',
              fraccion:'424',
              actividad:'Otros servicios de instalación vinculados al acabado o remodelación de obras de construcción.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la instalación de revestimientos de interiores o exteriores de obras de construcción en general con mezclas de cemento, yeso o cal, materiales pétreos o vidriados, pinturas, madera, impermeabilizantes, materiales térmicos o acústicos, elementos ornamentales y otros materiales o partes no especificados, vinculados al acabado o remodelación de obras de construcción. Incluye a los rotulistas que realicen trabajos en interiores y exteriores de inmuebles sobre muros, paredes, paneles y similares y/o empresas que instalen los anuncios publicitarios, así como sus elementos de suspensión o sustentación.'
            },
          ]
        },
      ]
    },
    {key:'5',division:'5',label:'DIVISIÓN 5 INDUSTRIA ELÉCTRICA Y CAPTACIÓN Y SUMINISTRO DE AGUA POTABLE',
      children:[
        {key:'5-0',grupo:"50",label:'GRUPO 50 GENERACIÓN, TRANSMISIÓN Y DISTRIBUCIÓN DE ENERGÍA ELÉCTRICA',
          children:[
            {
              key:'5-0-0',
              fraccion:'500',
              actividad:'Generación, transmisión y distribución de energía eléctrica.',
              clave:'IV',
              descripcion:'Comprende a las empresas que realizan la generación, transmisión y distribución de energía eléctrica.'
            },
          ]
        },
        {key:'5-1',grupo:"51",label:'GRUPO 51 CAPTACIÓN Y SUMINISTRO DE AGUA POTABLE Y TRATADA',
          children:[
            {
              key:'5-1-0',
              fraccion:'510',
              actividad:'Captación y suministro de agua potable y tratada.',
              clave:'III',
              descripcion:'Comprende a las empresas que realizan la captación, tratamiento, conducción, suministro y distribución de agua potable y tratada. Excepto la construcción de obras civiles para la captación y suministro de agua potable y para la instalación de plantas purificadoras de agua, que se clasifican en la fracción 412.'
            },
          ]
        }
      ]
    },
    {key:'6',division:'6',label:'DIVISIÓN 6 COMERCIO',
      children:[
        {key:'6-0',grupo:"61",label:'GRUPO 61 COMPRAVENTA DE ALIMENTOS, BEBIDAS Y PRODUCTOS DEL TABACO',
          children:[
            {
              key:'6-0-0',
              fraccion:'611',
              actividad:'Expendios de ventas al menudeo de alimentos, bebidas y/o productos del tabaco.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de frutas, verduras, carnes, pollos, pescados, vísceras, huevo, leche, chiles secos, moles, especias, granos, y otros productos alimenticios agropecuarios o de la pesca, en estado natural o elaborados. Incluye tiendas de abarrotes, ultramarinos, misceláneas, dulcerías, salchichonerías, cremerías, tabaquerías, vinaterías y otros establecimientos con ventas al menudeo de alimentos, bebidas y/o productos del tabaco. Excepto supermercados o tiendas de autoservicio, almacenes y establecimientos con transporte, cantinas, restaurantes, cafeterías y otras empresas que preparen y den servicio de alimentos, clasificadas por separado.'
            },
            {
              key:'6-0-1',
              fraccion:'612',
              actividad:'Compraventa de alimentos, bebidas y/o productos del tabaco, sin transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de alimentos, bebidas y/o productos del tabaco, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-0-2',
              fraccion:'613',
              actividad:'Compraventa de alimentos, bebidas y/o productos del tabaco, con transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de alimentos, bebidas y/o productos del tabaco, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Incluye exclusivamente el almacenamiento, venta y distribución de hielo, aguas purificadas y refrescos con transporte. Excepto supermercados o tiendas de autoservicio y empresas que se dedican a prestar el servicio de transporte, clasificados por separado.'
            },
            {
              key:'6-0-3',
              fraccion:'614',
              actividad:'Compraventa e introducción de animales vivos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compraventa e introducción de animales vivos (ganado bovino, ovino, porcino, caprino, equino, aves y otros) a rastros o mataderos; excepto las empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
        {key:'6-1',grupo:"62",label:'GRUPO 62 COMPRAVENTA DE PRENDAS DE VESTIR Y OTROS ARTÍCULOS DE USO PERSONAL',
          children:[
            {
              key:'6-1-0',
              fraccion:'621',
              actividad:'Expendios de ventas al menudeo de prendas y accesorios de vestir y artículos para su confección.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de ropa en general, calzado, sombreros, pieles para dama, pelucas, telas, casimires, artículos de mercería, bonetería, sedería y otros establecimientos con ventas al menudeo de prendas y accesorios de vestir y/o artículos para su confección. Excepto supermercados o tiendas de autoservicio, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-1',
              fraccion:'622',
              actividad:'Compraventa de prendas y accesorios de vestir y artículos para su confección, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de prendas y accesorios de vestir y artículos para su confección que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-2',
              fraccion:'623',
              actividad:'Compraventa de prendas y accesorios de vestir y artículos para su confección, con transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de prendas y accesorios de vestir y artículos para su confección que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y empresas que se dedican a prestar el servicio de transporte, clasificados por separado.'
            },
            {
              key:'6-1-3',
              fraccion:'624',
              actividad:'Expendios de ventas al menudeo de artículos de uso personal.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de anteojos, juguetes, instrumentos musicales, relojes, artículos de platería y joyería, petacas, baúles, portafolios, carteras y otros artículos de cuero, piel y materiales sucedáneos, equipo y material fotográfico, cinematográfico y de dibujo, paraguas, sombrillas, artículos de protección personal contra riesgos profesionales, artículos y aparatos deportivos, armas de fuego, cartuchos, municiones y otros establecimientos con ventas al menudeo de artículos de uso personal. Excepto prendas y accesorios de vestir, supermercados o tiendas de autoservicio, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-4',
              fraccion:'625',
              actividad:'Compraventa de artículos de uso personal, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de artículos de uso personal, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto prendas y accesorios de vestir, supermercados o tiendas de autoservicio y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-5',
              fraccion:'626',
              actividad:'Compraventa de artículos de uso personal, con transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de artículos de uso personal, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto prendas y accesorios de vestir, supermercados o tiendas de autoservicio y empresas que se dedican a prestar el servicio de transporte, clasificados por separado.'
            },
            {
              key:'6-1-6',
              fraccion:'627',
              actividad:'Expendios de ventas al menudeo de medicamentos, productos farmacéuticos, químico-farmacéuticos y de perfumería.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de medicamentos, productos farmacéuticos, químico-farmacéuticos, de perfumería, veterinarios y otros establecimientos que expendan al menudeo productos o artículos similares. Excepto supermercados o tiendas de autoservicio, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-7',
              fraccion:'628',
              actividad:'Compraventa de medicamentos, productos farmacéuticos, químico-farmacéuticos y de perfumería, sin transporte.',
               clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de medicamentos, productos farmacéuticos, químico-farmacéuticos, de perfumería, veterinarios y similares, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-8',
              fraccion:'629',
              actividad:'Compraventa de medicamentos, productos farmacéuticos, químico-farmacéuticos y de perfumería, con transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de medicamentos, productos farmacéuticos, químico-farmacéuticos, de perfumería, veterinarios y similares, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-1-9',
              fraccion:'6210',
              actividad:'Expendios de ventas al menudeo de papelería, útiles escolares y de oficina; libros, periódicos y revistas.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de papelería, útiles escolares y de oficina; libros,  periódicos, revistas, billetes de lotería, pronósticos deportivos y  otros establecimientos que expendan al menudeo productos o artículos similares. Excepto supermercados o tiendas de autoservicio, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-10',
              fraccion:'6211',
              actividad:'Compraventa de papelería, útiles escolares y de oficina; libros, periódicos y revistas, sin transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de papelería, útiles escolares y de oficina; libros, periódicos, revistas y similares, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-1-11',
              fraccion:'6212',
              actividad:'Compraventa de papelería, útiles escolares y de oficina; libros, periódicos y revistas, con transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de papelería, útiles escolares y de oficina; libros, periódicos, revistas y similares, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto supermercados o tiendas de autoservicio y empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
        {key:'6-2',grupo:"63",label:'GRUPO 63 COMPRAVENTA DE ARTÍCULOS PARA EL HOGAR',
          children:[
            {
              key:'6-2-0',
              fraccion:'631',
              actividad:'Expendios de ventas al menudeo de máquinas, muebles, aparatos e instrumentos para el hogar, sus refacciones y accesorios.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de estufas, lavadoras, refrigeradores, cocinas integrales, aparatos eléctricos y electrónicos, radios, televisores, videocaseteras, máquinas de coser y tejer de uso doméstico, salas, recámaras, comedores y similares; incluso sus refacciones y accesorios. Excepto muebles para baño, oficinas, comercio y tiendas de departamentos especializados por línea de mercancías, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-2-1',
              fraccion:'632',
              actividad:'Compraventa de máquinas, muebles, aparatos e instrumentos para el hogar, sus refacciones y accesorios, sin transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de estufas, lavadoras, refrigeradores, cocinas integrales, aparatos eléctricos y electrónicos, radios, televisores, videocaseteras, máquinas de coser y tejer de uso doméstico, salas, recámaras, comedores y similares; incluso sus refacciones y accesorios, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto muebles para baño, oficinas, comercio y tiendas de departamentos especializados por línea de mercancías y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-2-2',
              fraccion:'633',
              actividad:'Compraventa de máquinas, muebles, aparatos e instrumentos para el hogar, sus refacciones y accesorios, con transporte y/o servicios de instalación.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de estufas, lavadoras, refrigeradores, cocinas integrales, aparatos eléctricos y electrónicos, radios, televisores, videocaseteras, máquinas de coser y tejer de uso doméstico, salas, recámaras, comedores y similares; incluso sus refacciones y accesorios, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o servicios de instalación. Excepto muebles para baño, oficinas y comercio y tiendas de departamentos especializados por línea de mercancías y empresas que se dedican a prestar el servicio de transporte, clasificados por separado.'
            },
            {
              key:'6-2-3',
              fraccion:'634',
              actividad:'Expendios de ventas al menudeo de otros artículos para el hogar.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de cristalería, loza, cuchillería y otros utensilios de comedor y cocina, de diversos materiales; alfombras, linóleums, pisos vinílicos, tapices, losetas vinílicas, cortinas, persianas; discos, discos compactos, cintas magnéticas para sonidos e imágenes; obras de arte, tales como: pinturas, esculturas; artículos religiosos, artesanías, antigüedades, plantas y flores naturales o artificiales. Incluye los denominados bazares. Excepto tiendas de departamentos especializados por línea de mercancías, almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-2-4',
              fraccion:'635',
              actividad:'Compraventa de otros artículos para el hogar, sin transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de cristalería, loza, cuchillería y otros utensilios de comedor y cocina, de diversos materiales; alfombras, linóleums, pisos vinílicos, tapices, losetas vinílicas, cortinas, persianas; discos, discos compactos, cintas magnéticas para sonidos e imágenes; obras de arte, tales como: pinturas, esculturas; artículos religiosos, artesanías, antigüedades, plantas y flores naturales o artificiales, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Incluye los denominados bazares. Excepto tiendas de departamentos especializados por línea de mercancías y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-2-4',
              fraccion:'636',
              actividad:'Compraventa de otros artículos para el hogar, con transporte y/o servicios de instalación.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de cristalería, loza, cuchillería y otros utensilios de comedor y cocina, de diversos materiales; alfombras, linóleums, pisos vinílicos, tapices, losetas vinílicas, cortinas, persianas; discos, discos compactos, cintas magnéticas para sonidos e imágenes; obras de arte, tales como: pinturas, esculturas; artículos religiosos, artesanías, antigüedades, plantas y flores naturales o artificiales, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o servicios de instalación. Incluye los denominados bazares. Excepto tiendas de departamentos especializados por línea de mercancías y empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
        {key:'6-3',grupo:"64",label:'GRUPO 64 COMPRAVENTA EN TIENDAS DE AUTOSERVICIO Y DE DEPARTAMENTOS ESPECIALIZADOS POR LÍNEA DE MERCANCÍAS',
          children:[
            {
              key:'6-3-0',
              fraccion:'641',
              actividad:'Supermercados, tiendas de autoservicio y de departamentos especializados por línea de mercancías.',
              clave:'II',
              descripcion:'Comprende a las empresas consideradas o denominadas como supermercados, tiendas de autoservicio y tiendas de departamentos especializados por línea de mercancías, que se dedican a la compraventa de artículos o productos misceláneos.'
            },
          ]
        },
        {key:'6-4',grupo:"65",label:'GRUPO 65 COMPRAVENTA DE GASES, COMBUSTIBLES Y LUBRICANTES',
          children:[
            {
              key:'6-4-0',
              fraccion:'651',
              actividad:'Compraventa, envasado y/o distribución de gases para uso doméstico, industrial y medicinal.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la compra, venta, envase y/o distribución de gases a través de redes concesionadas, pipas, cilindros y otros similares, para uso doméstico, industrial y medicinal.'
            },
            {
              key:'6-4-1',
              fraccion:'652',
              actividad:'Compraventa de lubricantes y aditivos, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de aceites y grasas lubricantes y aditivos no comestibles, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Incluye cambios de aceite en vehículos automóviles, cuando éstos sean realizados por la venta de dichas mercancías. Excepto establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-4-2',
              fraccion:'653',
              actividad:'Estaciones de venta de gasolina, diesel y compraventa de lubricantes y aditivos, con transporte.',
              clave:'III',
              descripcion:'Comprende a las estaciones de venta de gasolina, diesel y otros combustibles similares y a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de aceites y grasas lubricantes y aditivos no comestibles, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-4-3',
              fraccion:'654',
              actividad:'Compraventa de leña, carbón vegetal y mineral.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de leña, carbón vegetal y mineral y otros combustibles similares. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
        {key:'6-5',grupo:"66",label:'GRUPO 66 COMPRAVENTA DE MATERIAS PRIMAS, MATERIALES Y AUXILIARES',
          children:[
            {
              key:'6-5-0',
              fraccion:'661',
              actividad:'Expendios de ventas al menudeo de materias primas agropecuarias.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de algodón en pluma, semillas para siembra, cueros y pieles sin curtir, fibras textiles naturales, tabaco en rama, corcho, copra, chicle y otras materias primas agropecuarias. Incluye guanos, forrajes y alimentos balanceados para animales. Excepto almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-5-1',
              fraccion:'662',
              actividad:'Compraventa de materias primas agropecuarias, sin transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de algodón en pluma, semillas para siembra, cueros y pieles sin curtir, fibras textiles naturales, tabaco en rama, corcho, copra, chicle y otras materias primas agropecuarias, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Incluye guanos, forrajes y alimentos balanceados para animales. Excepto establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-5-2',
              fraccion:'663',
              actividad:'Compraventa de materias primas agropecuarias, con transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de algodón en pluma, semillas para siembra, cueros y pieles sin curtir, fibras textiles naturales, tabaco en rama, corcho, copra, chicle y otras materias primas agropecuarias, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Incluye guanos, forrajes y alimentos balanceados para animales. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-3',
              fraccion:'664',
              actividad:'Compraventa de materiales para construcción, tales como madera, aceros y productos de ferretería, sin transporte, ni preparación de mercancías.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de cemento, cal, yeso, arena, grava, piedra, tabiques, ladrillos, mosaicos, losetas, azulejos, tejas, láminas acanaladas y lisas, tinacos, muebles sanitarios y otros similares; madera en diversas formas, tales como: postes, polines, vigas, tableros macizos, aglomerados, triplay y similares; varilla, alambre, alambrón, mallas metálicas, tubería, perfiles metálicos, barra, placa; vaciados o partes fundidas, valvulería, herramientas, cuchillería, herrajes, cerrajería, tornillería, artículos de plomería, soldadura, empaques y otros materiales o suministros similares, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Incluye productos de fibra de vidrio, PVC y otros. Excepto empresas que preparen las mercancías mencionadas para su venta (con procesos de corte, soldadura u otros) y almacenes o empresas con transporte, clasificados por separado.'
            },
            {
              key:'6-5-4',
              fraccion:'665',
              actividad:'Compraventa de materiales para construcción tales como: madera, aceros y productos de ferretería, con transporte y/o preparación de mercancías.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de cemento, cal, yeso, arena, grava, piedra, tabiques, ladrillos, mosaicos, losetas, azulejos, tejas, láminas acanaladas y lisas, tinacos, muebles sanitarios y otros similares; madera en diversas formas, tales como: postes, polines, vigas, tableros macizos, aglomerados, triplay y similares; varilla, alambre, alambrón, mallas metálicas, tubería, perfiles metálicos, barra, placa, vaciados o partes fundidas, valvulería, herramientas, cuchillería, herrajes, cerrajería, tornillería, artículos de plomería, soldadura, empaques y otros materiales o suministros, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías, así como empresas que preparen para su venta las mercancías mencionadas (con procesos de corte, soldadura, doblado u otros). Incluye productos de fibra de vidrio, PVC y otros. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-5',
              fraccion:'666',
              actividad:'Compraventa de material eléctrico, pinturas y productos de tlapalería, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de material eléctrico y/o accesorios, pinturas y productos de tlapalería, lacas, barnices, disolventes y otros, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-5-6',
              fraccion:'667',
              actividad:'Compraventa de material eléctrico, pinturas y productos de tlapalería, con transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de material eléctrico y/o accesorios, pinturas y productos de tlapalería, lacas, barnices, disolventes y otros, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-7',
              fraccion:'668',
              actividad:'Compraventa de vidrio plano, cristales, espejos y lunas, sin transporte ni servicios de instalación.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de vidrio, cristales, espejos y lunas, que no instalen ni cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-5-8',
              fraccion:'669',
              actividad:'Compraventa de vidrio plano, cristales, espejos y lunas, con transporte y/o servicios de instalación.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de vidrio, cristales, espejos y lunas, que instalen y/o cuenten con transporte para la distribución o equipo para el movimiento de las mercancías. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-9',
              fraccion:'6610',
              actividad:'Compraventa de fertilizantes, plaguicidas y productos químicos (no explosivos) en envases cerrados, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de fertilizantes, plaguicidas y productos químicos diversos (no explosivos) en envases cerrados o a granel, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Incluye la compraventa, recarga y mantenimiento de extintores. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-10',
              fraccion:'6611',
              actividad:'Compraventa de fertilizantes, plaguicidas y productos químicos (no explosivos) en envases cerrados o a granel, con transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de fertilizantes, plaguicidas y productos químicos diversos (no explosivos) en envases cerrados o a granel, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Incluye la compraventa, recarga y mantenimiento de extintores. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-11',
              fraccion:'6612',
              actividad:'Compraventa de pieles, cueros curtidos y otros artículos de peletería, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de pieles, cueros curtidos y otros artículos de peletería, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-5-12',
              fraccion:'6613',
              actividad:'Compraventa de pieles, cueros curtidos y otros artículos de peletería, con transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de pieles, cueros curtidos y otros artículos de peletería, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-13',
              fraccion:'6614',
              actividad:'Compraventa de papel y cartón nuevos, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de papel y cartón nuevos, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-5-14',
              fraccion:'6615',
              actividad:'Compraventa de papel y cartón nuevos, con transporte.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de papel y cartón nuevos, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-5-15',
              fraccion:'6616',
              actividad:'Compraventa de chatarra, fierro viejo, partes o mecanismos usados y desperdicios en general.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de chatarra o fierro viejo, partes o mecanismos usados y desperdicios en general. Se consideran las plantas procesadoras de basura y empresas que prestan servicios de recolección y/o control de desechos industriales y en general; así como los establecimientos de compraventa de maquinaria vieja en general, trapo, papel, cartón, vidrio y plástico usados. Excepto empresas que se dedican al desmantelamiento o deshuese de equipo de transporte, para poner sus partes o mecanismos a la venta y las que prestan el servicio de transporte, clasificadas en las fracciones 683 y 712, respectivamente.'
            },
            {
              key:'6-5-16',
              fraccion:'6617',
              actividad:'Compraventa de explosivos y productos de pirotecnia.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de explosivos, incluso productos químicos explosivos y productos de pirotecnia. Excepto empresas que se dedican exclusivamente a prestar el servicio de transporte clasificadas por separado.'
            },
          ]
        },
        {key:'6-6',grupo:"67",label:'GRUPO 67 COMPRAVENTA DE MAQUINARIA, EQUIPO, INSTRUMENTOS, APARATOS, HERRAMIENTAS; SUS REFACCIONES Y ACCESORIOS',
          children:[
            {
              key:'6-6-0',
              fraccion:'671',
              actividad:'Expendio de ventas al menudeo de refacciones y accesorios para maquinaria y/o equipo para la producción de bienes.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de refacciones y accesorios para maquinaria y/o equipo industrial en general. Excepto almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-6-1',
              fraccion:'672',
              actividad:'Compraventa de maquinaria, equipo y sus refacciones y/o accesorios para la producción de bienes, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de maquinaria y equipo industrial en general, sus refacciones y/o accesorios, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-6-2',
              fraccion:'673',
              actividad:'Compraventa de maquinaria, equipo y sus refacciones y/o accesorios para la producción de bienes, con transporte y/o servicios de reparación o mantenimiento.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de maquinaria y equipo industrial en general, sus refacciones y/o accesorios, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o con servicios de reparación y mantenimiento. Excepto empresas que se dedican a prestar el servicio de transporte y aquellas que en forma simultánea prestan los servicios de instalación, clasificadas por separado.'
            },
            {
              key:'6-6-3',
              fraccion:'674',
              actividad:'Compraventa de maquinaria, equipo y sus refacciones y/o accesorios para la producción de bienes, con servicios de instalación.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de maquinaria y equipo industrial en general, sus refacciones y/o accesorios, que cuenten con servicios de instalación.'
            },
            {
              key:'6-6-4',
              fraccion:'675',
              actividad:'Expendios de ventas al menudeo de equipo, mobiliario, sus partes y/o accesorios para la prestación de servicios y el comercio.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de equipos, mobiliario, sus partes y/o accesorios para oficinas y comercios, hoteles, restaurantes, peluquerías, salones de belleza, billares, boliches y otro equipo y mobiliario para la prestación de servicios y el comercio. Excepto almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-6-5',
              fraccion:'676',
              actividad:'Compraventa de equipo, mobiliario, sus partes y/o accesorios para la prestación de servicios y el comercio, sin transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de equipo y mobiliario, sus partes y/o accesorios para oficinas y comercios, hoteles, restaurantes, peluquerías, salones de belleza, billares, boliches y otro equipo y mobiliario para la prestación de servicios y el comercio, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-6-6',
              fraccion:'677',
              actividad:'Compraventa de equipo, mobiliario, sus partes y/o accesorios para la prestación de servicios y el comercio, con transporte y/o servicios de instalación, reparación y mantenimiento.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de equipo y mobiliario, sus partes y/o accesorios para oficinas y comercios, hoteles, restaurantes, peluquerías, salones de belleza, billares, boliches y otro equipo y mobiliario para la prestación de servicios y el comercio, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o con servicios de instalación, reparación y mantenimiento. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-6-7',
              fraccion:'678',
              actividad:'Expendios de ventas al menudeo de aparatos e instrumentos de medición, precisión, cirugía, laboratorio y otros usos científicos.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de básculas, balanzas, aparatos e instrumentos médicos, quirúrgicos, de laboratorio, de prótesis, ortopedia y otros aparatos e instrumentos técnicos, científicos de medida y control. Excepto almacenes y establecimientos con transporte, clasificados por separado.'
            },
            {
              key:'6-6-8',
              fraccion:'679',
              actividad:'Compraventa de aparatos e instrumentos de medición, precisión, cirugía, laboratorio y otros usos científicos, sin transporte.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de básculas, balanzas, aparatos e instrumentos médicos, quirúrgicos, de laboratorio, de prótesis, ortopedia y otros aparatos e instrumentos técnicos, científicos de medida y control, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías.'
            },
            {
              key:'6-6-9',
              fraccion:'6710',
              actividad:'Compraventa de aparatos e instrumentos de medición, precisión, cirugía, laboratorio y otros usos científicos, con transporte y/o servicios de instalación, reparación o mantenimiento.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de básculas, balanzas, aparatos e instrumentos médicos, quirúrgicos, de laboratorio, de prótesis, de ortopedia y otros aparatos e instrumentos técnicos científicos de medida y control, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o con servicios de instalación, reparación o mantenimiento. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
            {
              key:'6-6-10',
              fraccion:'6711',
              actividad:'Compraventa de equipo de cómputo o de procesamiento electrónico de datos y sus periféricos, con servicios de instalación, reparación y/o mantenimiento.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de equipo de cómputo o de procesamiento electrónico de datos; servicios de instalación, reparación y/o mantenimiento; incluye los equipos denominados periféricos, como son las impresoras, unidades de cintas y discos o disquetes, mouse, digitalizadores, scanners, monitores, modems, plotters, ampliadores de memoria, teclados y otros similares. También se incluyen equipos semejantes, como aparatos de videojuegos, de sonido y máquinas de escribir electrónicas que se adapten como equipo periférico de computadoras.'
            },
          ]
        },
        {key:'6-7',grupo:"68",label:'GRUPO 68 COMPRAVENTA DE EQUIPO DE TRANSPORTE; SUS REFACCIONES Y ACCESORIOS',
          children:[
            {
              key:'6-7-0',
              fraccion:'681',
              actividad:'Expendios de ventas al menudeo de refacciones, accesorios y/o partes para equipo de transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de refacciones, accesorios y/o partes nuevas o usadas para automóviles, autobuses, camiones, motocicletas, bicicletas, aeronaves, embarcaciones y otros equipos de transporte. Excepto almacenes y establecimientos con transporte y empresas que se dedican al desmantelamiento o desarmado de equipos de transporte para poner sus partes o mecanismos a la venta, clasificadas en las fracciones 682 y 683.'
            },
            {
              key:'6-7-1',
              fraccion:'682',
              actividad:'Compraventa de equipo de transporte, sus refacciones, accesorios y/o partes, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de equipos de transporte, nuevos o usados (automóviles, autobuses, camiones, motocicletas, bicicletas, aeronaves, embarcaciones y otros equipos de transporte) y/o sus refacciones, accesorios o partes, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías. Excepto empresas que se dedican al desmantelamiento o desarmado de equipo de transporte para poner sus partes o mecanismos a la venta o a prestar servicios de instalación, reparación o mantenimiento, clasificadas en la fracción 683.'
            },
            {
              key:'6-7-2',
              fraccion:'683',
              actividad:'Compraventa de equipo de transporte, sus refacciones, accesorios y/o partes, con transporte y/o servicios de instalación, reparación o mantenimiento.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de equipos de transporte, nuevos o usados (automóviles, autobuses, camiones, motocicletas, bicicletas, aeronaves, embarcaciones y otros equipos de transporte) y/o sus refacciones, accesorios o partes, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o con servicios de instalación, reparación y mantenimiento; incluye empresas que se dedican al desmantelamiento o deshuese de equipo de transporte para poner sus partes o mecanismos a la venta. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
        {key:'6-8',grupo:"69",label:'GRUPO 69 COMPRAVENTA DE INMUEBLES Y ARTÍCULOS DIVERSOS',
          children:[
            {
              key:'6-8-0',
              fraccion:'691',
              actividad:'Compraventa de bienes inmuebles.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compraventa de bienes inmuebles.'
            },
            {
              key:'6-8-1',
              fraccion:'692',
              actividad:'Expendios de ventas al menudeo de artículos diversos no clasificados.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la compra y expendio al menudeo de artículos diversos no clasificados. Excepto almacenes y establecimientos con transporte y empresas que presten servicios de instalación, reparación y/o mantenimiento, clasificadas por separado.'
            },
            {
              key:'6-8-2',
              fraccion:'693',
              actividad:'Compraventa de artículos diversos no clasificados, sin transporte.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de artículos diversos no clasificados, que no cuenten con transporte para la distribución ni equipo para el movimiento de las mercancías, ni presten servicios de instalación, reparación o mantenimiento.'
            },
            {
              key:'6-8-3',
              fraccion:'694',
              actividad:'Compraventa de artículos diversos no clasificados, con transporte y/o servicios de instalación, reparación o mantenimiento.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la compra, almacenamiento y venta al menudeo, medio mayoreo y/o mayoreo de artículos diversos no clasificados, que cuenten con transporte para la distribución y/o equipo para el movimiento de las mercancías o que presten los servicios de instalación, reparación y mantenimiento. Excepto empresas que se dedican a prestar el servicio de transporte, clasificadas por separado.'
            },
          ]
        },
      ]
    },
    {key:'7',division:'7',label:'DIVISIÓN 7 TRANSPORTES Y COMUNICACIONES',
      children:[
        {key:'7-0',grupo:"71",label:'GRUPO 71 TRANSPORTE TERRESTRE',
          children:[
            {
              key:'7-0-0',
              fraccion:'711',
              actividad:'Transporte de pasajeros.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de transporte urbano, suburbano y foráneo de pasajeros en autobuses, vehículos de ruleteo, escolares, turísticos y otros especializados. Excepto ambulancias, clasificadas en la fracción 942.'
            },
            {
              key:'7-0-1',
              fraccion:'712',
              actividad:'Transporte de carga.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a prestar exclusivamente servicios de transporte de carga en general. Se considera el transporte de minerales, productos agropecuarios, alimentos, bebidas, productos manufacturados, materiales para construcción, mudanzas, animales y otros similares.'
            },
            {
              key:'7-0-2',
              fraccion:'713',
              actividad:'Transporte ferroviario y eléctrico.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de transporte en trenes de ferrocarril, autovía, tranvías, trolebuses y trenes subterráneos (metro), incluyendo servicios diversos a bordo de las unidades de transporte señaladas anteriormente.'
            },
          ]
        },
        {key:'7-1',grupo:"72",label:'GRUPO 72 TRANSPORTE POR AGUA',
          children:[
            {
              key:'7-1-0',
              fraccion:'721',
              actividad:'Transporte marítimo y de navegación interior y servicios diversos a bordo y/o en plataformas marinas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de transportación marítima, de carga y pasajeros, de altura, cabotaje, fluvial, lacustre y en el interior de puertos; incluyendo servicios diversos a bordo y/o asistencia en plataformas marinas, tales como: preparación y servicio de alimentos y de limpieza y aseo.'
            },
            {
              key:'7-1-1',
              fraccion:'722',
              actividad:'Servicios directamente vinculados con el transporte por agua y/o servicios de supervisión y mantenimiento en plataformas marinas.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios relacionados con el transporte marítimo, fluvial y lacustre como carga y descarga (estiba y alijo); mantenimiento y explotación de canales, muelles, atracaderos y otros servicios directamente vinculados con el transporte por agua. Incluye servicios de supervisión y mantenimiento preventivo y correctivo en plataformas marinas.'
            },
          ]
        },
        {key:'7-2',grupo:"73",label:'GRUPO 73 TRANSPORTE AÉREO',
          children:[
            {
              key:'7-2-0',
              fraccion:'730',
              actividad:'Transporte aéreo.',
              clave:'	II',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de transportación aérea, de carga y/o pasajeros, incluyendo servicios diversos a bordo de las aeronaves; así como la explotación de aeropuertos, campos de aterrizaje e instalaciones para la navegación aérea, escuelas y academias de aeronavegación, trabajos de aerofotografía, publicidad, propaganda y otros servicios de transporte aéreo no especificados.'
            },
          ]
        },
        {key:'7-3',grupo:"74",label:'GRUPO 74 SERVICIOS CONEXOS AL TRANSPORTE',
          children:[
            {
              key:'7-3-0',
              fraccion:'740',
              actividad:'Administración de vías de comunicación, terminales y servicios auxiliares.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de administración de caminos, puentes, aeropuertos, puertos marítimos, lacustres, fluviales, centrales camioneras, terminales y servicios auxiliares.'
            },
          ]
        },
        {key:'7-4',grupo:"75",label:'GRUPO 75 SERVICIOS RELACIONADOS CON EL TRANSPORTE EN GENERAL',
          children:[
            {
              key:'7-4-0',
              fraccion:'751',
              actividad:'Servicios de almacenamiento y/o refrigeración.',
              clave:'IV',
              descripcion:'Comprende a las empresas que prestan los servicios de almacenamiento y/o refrigeración de productos y mercancías diversas en locales, bodegas y similares. Incluye a los "Almacenes Generales de Depósito".'
            },
            {
              key:'7-4-1',
              fraccion:'752',
              actividad:'Servicios sin transporte de agencias de gestión aduanal, de equipajes, viajes y turísticas.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios turísticos, de representación y gestión aduanal, de equipajes, organización y promoción de viajes, venta de boletos y reservación para hospedaje, que no cuenten con operadores de vehículos ni transporte para su distribución y entrega.'
            },
            {
              key:'7-4-2',
              fraccion:'753',
              actividad:'Servicios de grúa y emergencia para vehículos.',
              clave:'IV',
              descripcion:'Comprende a las empresas que prestan servicios de grúa y de emergencia para vehículos.'
            },
            {
              key:'7-4-3',
              fraccion:'754',
              actividad:'Servicios de alquiler de aeronaves, carros de ferrocarril y transportes acuáticos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican al alquiler de aeronaves, carros de ferrocarril y transportes acuáticos.'
            },
            {
              key:'7-4-4',
              fraccion:'755',
              actividad:'Servicios con transporte de agencias de gestión aduanal, de mensajería y paquetería, de equipajes, viajes, turísticas y otras actividades relacionadas con los transportes en general.',
              clave:'IV',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios turísticos, de representación y gestión aduanal, de equipajes, organización y promoción de viajes, venta de boletos y reservación para hospedaje, que cuenten con operadores de vehículos y/o transporte para su distribución y entrega. Incluye a las empresas que se dedican a la recepción, almacenamiento, manipulación de carga y embalaje, distribución y entrega de mensajería y paquetería; así como a las academias o escuelas de manejo y otras actividades relacionadas con los transportes en general no clasificadas anteriormente. Excepto las que se dedican exclusivamente a la transportación turística de pasajeros, que se clasifican en la fracción 711.'
            },
          ]
        },
        {key:'7-5',grupo:"76",label:'GRUPO 76 COMUNICACIONES',
          children:[
            {
              key:'7-5-0',
              fraccion:'760',
              actividad:'Comunicaciones.',
              clave:'II',
              descripcion:'Comprende a las empresas que prestan servicios telefónicos, de telefax, telefonía celular y otros servicios de telecomunicaciones. Se considera el servicio postal, telegráfico y radiotelegráfico, aunque su manejo está reservado en forma exclusiva al Estado. Excepto radiodifusión, televisión y empresas que realizan trabajos de canalización y tendido de líneas telefónicas, casetas subterráneas, instalación de postes, torres y otros trabajos similares, clasificadas en las fracciones 882 y 412, respectivamente.'
            },
          ]
        },
      ]
    },
    {key:'8',division:'8',label:'DIVISIÓN 8 SERVICIOS PARA EMPRESAS, PERSONAS Y EL HOGAR',
      children:[
        {key:'8-0',grupo:"81",label:'GRUPO 81 SERVICIOS FINANCIEROS Y DE SEGUROS (BANCOS, FINANCIERAS, COMPAÑÍAS DE SEGUROS Y SIMILARES)',
          children:[
            {
              key:'8-0-0',
              fraccion:'810',
              actividad:'Instituciones de crédito, seguros y fianzas.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican al ejercicio de la banca de depósito y ahorro; operaciones financieras; de crédito hipotecario; de capitalización y fiduciarias y otras organizaciones auxiliares de crédito, aseguradoras y afianzadoras a excepción de los "Almacenes Generales de Depósito", que se clasifican en la fracción 751.'
            },
          ]
        },
        {key:'8-1',grupo:"82",label:'GRUPO 82 SERVICIOS COLATERALES A LAS INSTITUCIONES FINANCIERAS Y DE SEGUROS',
          children:[
            {
              key:'8-1-0',
              fraccion:'820',
              actividad:'Servicios colaterales a las instituciones financieras y de seguros.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de asesoramiento de inversiones y agencias de bolsa de valores; servicios de montepíos; casas de cambio y otros servicios colaterales a las instituciones financieras y de seguros.'
            },
          ]
        },
        {key:'8-2',grupo:"83",label:'GRUPO 83 SERVICIOS RELACIONADOS CON INMUEBLE',
          children:[
            {
              key:'8-2-0',
              fraccion:'830',
              actividad:'Servicios relacionados con inmuebles.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican al alquiler de terrenos, locales, edificios, piso para comercios ambulantes en tianguis y bazares. Incluye los servicios de corredores de bienes raíces y administración de inmuebles, que no cuenten con personal para mantenimiento y/o limpieza de los mismos.'
            },
          ]
        },
        {key:'8-3',grupo:"84",label:'GRUPO 84 SERVICIOS PROFESIONALES Y TÉCNICOS',
          children:[
            {
              key:'8-3-0',
              fraccion:'841',
              actividad:'Servicios profesionales y técnicos.',
              clave:'I',
              descripcion:'Comprende a las empresas que prestan servicios profesionales y/o técnicos como: notarías públicas, bufetes jurídicos, contaduría, auditoría y teneduría de libros, asesoría y estudios técnicos de arquitectura e ingeniería, asesoría en administración, organización de empresas, relaciones públicas, economía, investigación de mercado, solvencia financiera, patentes y marcas industriales, análisis de sistemas y procesamiento electrónico de datos, administrativos, de trámite y cobranzas, escritorios públicos, comisiones y representaciones mercantiles, centros de fotocopiado, estudios fotográficos, agencias de publicidad, información, noticias y otras especialidades similares. Incluye a las agencias de colocación de personal o bolsas de trabajo, que actúen como intermediarios en los términos de la Ley Federal del Trabajo.'
            },
            {
              key:'8-3-1',
              fraccion:'843',
              actividad:'Servicios de instalación de maquinaria y equipo en general.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la instalación o montaje de maquinaria y equipo en general, excepto aquellas dedicadas al montaje de estructuras prefabricadas (metálicas o de concreto), clasificadas en la fracción 412.'
            },
            {
              key:'8-3-2',
              fraccion:'844',
              actividad:'Servicios de protección y custodia.',
              clave:'III',
              descripcion:'Comprende a las empresas que prestan servicios de protección y custodia, traslado de valores, así como detectives y otros servicios similares. Excepto servicios de seguridad pública, clasificados en la fracción 942.'
            },
            {
              key:'8-3-3',
              fraccion:'845',
              actividad:'Servicios de laboratorio para la industria en general.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de laboratorio, en forma independiente, a diversos tipos de actividades y ramas industriales, tales como: construcción, metal-mecánica, química, textil, metalúrgica, farmacéutica, alimenticia, agrícola y otras; así como a las que se dedican al diagnóstico y control ambiental. Incluye a los centros de verificación de emisión de contaminantes automotrices, que no proporcionen los servicios de reparación, lavado, engrasado, estacionamiento de vehículos, ni servicios mecánicos y/o de hojalatería, que se clasifican por separado en la fracción 891.'
            },
          ]
        },
        {key:'8-4',grupo:"85",label:'GRUPO 85 SERVICIOS DE ALQUILER; EXCEPTO DE INMUEBLES',
          children:[
            {
              key:'8-4-0',
              fraccion:'851',
              actividad:'Servicios de alquiler de maquinaria y equipo agrícola.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican al alquiler de maquinaria y equipo agrícola.'
            },
            {
              key:'8-4-1',
              fraccion:'852',
              actividad:'Servicios de alquiler de maquinaria y equipo para la construcción con operadores.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican al alquiler de maquinaria y equipo para la construcción con operadores.'
            },
            {
              key:'8-4-2',
              fraccion:'853',
              actividad:'Servicios de alquiler de maquinaria y equipo para la construcción sin operadores.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican al alquiler de maquinaria y equipo para la construcción sin operadores.'
            },
            {
              key:'8-4-3',
              fraccion:'854',
              actividad:'Servicios de alquiler de equipo y mobiliario a empresas.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican al servicio de alquiler de equipo de cómputo o procesamiento electrónico de datos, equipo y mobiliario para comercios, servicios y oficinas. Excepto vehículos.'
            },
            {
              key:'8-4-4',
              fraccion:'855',
              actividad:'Servicios de alquiler para el público en general.',
              clave:'I',
              descripcion:'Comprende a las empresas que prestan servicios de alquiler de salones para fiestas, conferencias y convenciones, así como muebles, sillas, mesas, cristalería, cubiertos, vajillas, mantelería, toldos, sinfonolas, televisores, equipo de sonido e instrumentos musicales, equipo fotográfico, proyectores, ropa en general y otros servicios de alquiler. Excepto vehículos.'
            },
            {
              key:'8-4-5',
              fraccion:'856',
              actividad:'Servicios de alquiler o renta de automóviles, bicicletas y motocicletas.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican al alquiler de vehículos automóviles, bicicletas y motocicletas. Incluye el servicio de pesado de camiones. Excepto servicios de alquiler de maquinaria y equipo para la agricultura y la construcción, clasificados por separado.'
            },
          ]
        },
        {key:'8-5',grupo:"86",label:'GRUPO 86 SERVICIOS DE ALOJAMIENTO TEMPORAL',
          children:[
            {
              key:'8-5-0',
              fraccion:'860',
              actividad:'Servicios de alojamiento temporal.',
              clave:'II',
              descripcion:'Comprende a las empresas que prestan servicios de alojamiento en hoteles, moteles, campamentos para casas móviles, casas de huéspedes, departamentos, albergues juveniles, centros vacacionales, centros para socios (tiempos compartidos) y otros establecimientos de hospedaje.'
            },
          ]
        },
        {key:'8-6',grupo:"87",label:'GRUPO 87 PREPARACIÓN Y SERVICIO DE ALIMENTOS Y BEBIDAS',
          children:[
            {
              key:'8-6-0',
              fraccion:'871',
              actividad:'Preparación y servicio de alimentos.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a la preparación y a prestar servicios de alimentos en restaurantes, cafés, fondas, cocinas económicas, loncherías, ostionerías, rosticerías, pizzerías, taquerías, torterías, neverías, refresquerías, merenderos, cenadurías y similares, que cuenten o no con el servicio de entrega a domicilio. Incluye a aquellas empresas que además de prestar los servicios antes mencionados, simultáneamente preparen y sirvan bebidas alcohólicas. Excepto empresas que se dedican a la preparación y servicio de bebidas en cantinas, bares, cervecerías y otros similares, clasificadas en la fracción 872.'
            },
            {
              key:'8-6-1',
              fraccion:'872',
              actividad:'Preparación y servicio de bebidas alcohólicas.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la preparación y servicio de bebidas en cantinas, bares, cervecerías y otros similares.'
            },
          ]
        },
        {key:'8-7',grupo:"88",label:'GRUPO 88 SERVICIOS PARA EMPRESAS, PERSONAS Y EL HOGAR',
          children:[
            {
              key:'8-7-0',
              fraccion:'881',
              actividad:'Servicios recreativos.',
              clave:'II',
              descripcion:'Comprende a las empresas que prestan servicios recreativos de balnearios, albercas, gimnasios, pistas para patinar, billares, boliches, juegos eléctricos y electrónicos, alquiler de caballos; centros sociales recreativos, clubes deportivos; promoción y presentación de espectáculos deportivos; así como las federaciones y asociaciones con fines recreativos y similares. Excepto el alquiler de vehículos automotores.'
            },
            {
              key:'8-7-1',
              fraccion:'882',
              actividad:'Servicios de esparcimiento.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la producción, distribución, alquiler, exhibición, copia, edición, rotulación y sonido de películas cinematográficas; promoción, montaje y representación de espectáculos de música, teatro y danza. Así como la producción, transmisión y repetición de programas de radio y televisión. Excepto empresas que realicen como parte de su servicio, trabajos de canalización y tendido de líneas para la recepción y transmisión de señal por cable y otros similares, clasificadas en la fracción 412.'
            },
            {
              key:'8-7-2',
              fraccion:'883',
              actividad:'Hipódromos, galgódromos, lienzos charros, palenques y promoción y presentación de espectáculos taurinos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a promover y presentar espectáculos en hipódromos, galgódromos, autódromos, velódromos, lienzos charros, palenques, plazas de toros y similares.'
            },
            {
              key:'8-7-3',
              fraccion:'884',
              actividad:'Servicios de centros nocturnos, salones de baile y casinos.',
              clave:'II',
              descripcion:'Comprende a las empresas que ofrecen la preparación y servicio de alimentos y bebidas alcohólicas, presentación de espectáculos y variedades en centros nocturnos, salones de baile, discotecas, casinos y similares.'
            },
            {
              key:'8-7-4',
              fraccion:'885',
              actividad:'Promoción y montaje de exposiciones de pintura y escultura.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la promoción y montaje de exposiciones de pintura, escultura y otras obras de arte similares. Incluye estudios de pintura y escultura.'
            },
            {
              key:'8-7-5',
              fraccion:'886',
              actividad:'Circos y juegos electromecánicos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a la promoción y presentación de espectáculos circenses, juegos electromecánicos, adiestramiento y exhibición de animales salvajes, acrobacia aérea y otros similares.'
            },
          ]
        },
        {key:'8-8',grupo:"89",label:'GRUPO 89 SERVICIOS PERSONALES PARA EL HOGAR Y DIVERSOS',
          children:[
            {
              key:'8-8-0',
              fraccion:'891',
              actividad:'Servicios de reparación, lavado, engrasado, verificación de emisión de contaminantes y estacionamiento de vehículos con servicios mecánicos y/o de hojalatería.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican a los servicios de reparación de automóviles, camiones, autobuses, motocicletas, bicicletas, lanchas, aeronaves y sus partes componentes como: motores, transmisiones, cajas de cambio, carburadores, arranques, radiadores, frenos, sistema eléctrico, carrocerías (hojalatería, pintura, asientos, polarizado de cristales y otros); así como los servicios de parchado de llantas y cámaras, lubricación, lavado y engrasado, alineación y balanceo; el servicio de estacionamiento y pensión de vehículos, siempre y cuando además presten alguno(s) de los servicios antes mencionados. Incluye a los centros de verificación de emisión de contaminantes automotrices, que realicen en forma simultánea la(s) actividad(es) descrita(s) en esta fracción. Excepto empresas que se dedican a la reforma, reconstrucción (como la regeneración y vulcanización de llantas) o fabricación de equipo de transporte y sus partes, que se clasifican por separado.'
            },
            {
              key:'8-8-1',
              fraccion:'892',
              actividad:'Servicios de reparación de artículos de uso doméstico y personal, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que prestan servicios de reparación o mantenimiento de artículos de uso doméstico y personal, sin empleo de maquinaria ni equipo motorizado.'
            },
            {
              key:'8-8-2',
              fraccion:'893',
              actividad:'Servicios de reparación de artículos de uso doméstico y personal, con maquinaria y/o equipo motorizado.',
              clave:'IV',
              descripcion:'Comprende a las empresas que prestan servicios de reparación o mantenimiento de artículos de uso doméstico y personal, con empleo de maquinaria y/o equipo motorizado. Incluye talleres de reparación de calzado, afiladurías y cerrajerías.'
            },
            {
              key:'8-8-3',
              fraccion:'894',
              actividad:'Servicios para el aseo personal y sanitarios.',
              clave:'II',
              descripcion:'Comprende a las empresas que prestan servicios para el aseo personal y estético, que cuenten con baño de vapor, turco, sauna, aparatos para ejercicio físico, peluquerías, salones de belleza, bolerías y masajistas. Incluye los servicios sanitarios públicos y otros servicios para el aseo personal.'
            },
            {
              key:'8-8-4',
              fraccion:'895',
              actividad:'Servicios de peluquería y salones de belleza.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a prestar servicios de peluquerías y salones de belleza que no cuenten con baños de vapor, turcos, sauna, ni aparatos para ejercicio físico. Incluye bolerías.'
            },
            {
              key:'8-8-5',
              fraccion:'896',
              actividad:'Servicios de aseo y limpieza, sin maquinaria ni equipo motorizado.',
              clave:'II',
              descripcion:'Comprende a las empresas que sin empleo de maquinaria ni equipo motorizado, se dedican a proporcionar servicios de limpieza, tales como: lavado y/o planchado de ropa, alfombras, tapetes, cortinas, blancos y otros en lavanderías, tintorerías y planchadurías. Incluye los servicios de aseo y limpieza en interiores de inmuebles (lavado, pulido, encerado y similares).'
            },
            {
              key:'8-8-6',
              fraccion:'897',
              actividad:'Servicios de aseo y limpieza, con maquinaria y/o equipo motorizado.',
              clave:'III',
              descripcion:'Comprende a las empresas que con empleo de maquinaria y/o equipo motorizado, se dedican a proporcionar servicios de limpieza tales como: lavado y/o planchado de ropa, alfombras, tapetes, cortinas, blancos y otros en lavanderías, tintorerías y planchadurías. Incluye los servicios de aseo y limpieza en interiores de inmuebles (lavado, pulido, encerado y similares). Excepto empresas que se dedican a los servicios de fontanería (limpieza de caños y tuberías), clasificadas en la fracción 421.'
            },
            {
              key:'8-8-7',
              fraccion:'898',
              actividad:'Servicios de limpieza de ventanas y fachadas.',
              clave:'IV',
              descripcion:'Comprende a las empresas que prestan el servicio de limpieza en exteriores de inmuebles como ventanas, fachadas y otros similares.'
            },
            {
              key:'8-8-8',
              fraccion:'899',
              actividad:'Servicios de fumigación, desinfección y control de plagas.',
              clave:'III',
              descripcion:'Comprende a las empresas que realizan actividades de fumigación, desinfección y control de plagas en plantaciones agrícolas, establecimientos industriales, comerciales, de servicios y del hogar. Excepto la desinfección y erradicación de plagas propias del ganado y la aerotecnia agrícola, clasificadas por separado.'
            },
            {
              key:'8-8-9',
              fraccion:'8910',
              actividad:'Aerotecnia agrícola.',
              clave:'V',
              descripcion:'Comprende a las empresas que se dedican a la desinfección, fumigación, fertilización y otras actividades similares, con empleo de aeronaves.'
            },
            {
              key:'8-8-10',
              fraccion:'8911',
              actividad:'Servicios de revelado fotográfico.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a la prestación de servicios de revelado fotográfico.'
            },
            {
              key:'8-8-11',
              fraccion:'8912',
              actividad:'Inhumaciones y servicios conexos.',
              clave:'II',
              descripcion:'Comprende a las agencias de inhumaciones, cementerios y servicios auxiliares conexos.'
            },
            {
              key:'8-8-12',
              fraccion:'8913',
              actividad:'Servicios domésticos.',
              clave:'I',
              descripcion:'Comprende a los patrones personas físicas, que tienen a su servicio trabajadores domésticos, considerados éstos como los que prestan servicios de aseo, asistencia y demás, propios o inherentes al hogar, una persona o familia.'
            },
            {
              key:'8-8-13',
              fraccion:'8914',
              actividad:'Servicios de estacionamiento y/o pensión para vehículos.',
              clave:'III',
              descripcion:'Comprende a las empresas que se dedican exclusivamente a prestar servicios de estacionamiento y/o pensión de vehículos a ras de suelo, subterráneo, con estructura, en inmuebles de uno o varios pisos, o una combinación de éstos. Excepto las empresas que además de los servicios anteriores, presten los de reparación, lavado, engrasado y servicios mecánicos y/o de hojalatería, que se clasifican en la fracción 891.'
            },
          ]
        },
      ]
    },
    {key:'9',division:'9',label:'DIVISIÓN 9 SERVICIOS SOCIALES Y COMUNALES',
      children:[
        {key:'9-0',grupo:"91",label:'GRUPO 91 SERVICIOS DE ENSEÑANZA, INVESTIGACIÓN CIENTÍFICA Y DIFUSIÓN CULTURAL',
          children:[
            {
              key:'9-0-0',
              fraccion:'911',
              actividad:'Servicios de enseñanza académica, capacitación, investigación científica y difusión cultural.',
              clave:'I',
              descripcion:'Comprende a las empresas que prestan servicios de guardería, enseñanza preprimaria, primaria, secundaria, media superior (preparatoria, vocacional), subprofesional, profesional, enseñanza comercial, idiomas y cursos por correspondencia; capacitación técnica de oficios y artesanías; música, danza y otras artes; servicios de investigación científica; bibliotecas, museos, jardines botánicos y otros servicios similares de difusión cultural. Excepto academias o escuelas de manejo de vehículos y de cultura física (gimnasios) clasificadas en las fracciones 755 y 881, respectivamente.'
            },
          ]
        },
        {key:'9-1',grupo:"92",label:'GRUPO 92 SERVICIOS MÉDICOS, ASISTENCIA SOCIAL Y VETERINARIOS',
          children:[
            {
              key:'9-1-0',
              fraccion:'921',
              actividad:'Servicios médicos.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a proporcionar servicios médicos en hospitales, sanatorios, clínicas generales, maternidades, consultorios y clínicas dentales, incluso servicios de obstetricia y enfermería. Excepto las empresas que además de los servicios médicos, cuenten con transporte; operadores para traslado de pacientes; laboratorios de análisis químico biológicos; bancos de sangre; servicios radiológicos, radioterapéuticos y otros similares, clasificados en la fracción 922.'
            },
            {
              key:'9-1-1',
              fraccion:'922',
              actividad:'Servicios médicos, paramédicos y auxiliares.',
              clave:'II',
              descripcion:'Comprende a las empresas que se dedican a proporcionar servicios médicos en hospitales, sanatorios, clínicas generales, maternidades, consultorios y clínicas dentales; incluso servicios de obstetricia, enfermería y/o paramédicos; así como los servicios auxiliares de diagnóstico que se realicen en forma simultánea, o prestados en forma exclusiva como laboratorios de análisis químico-biológicos y bancos de sangre, radiología, radioscopia, radioterapia, electroencefalogramas y otros similares, que cuenten con transporte y/u operadores para el traslado de pacientes. Excepto las empresas que prestan en forma exclusiva el servicio de ambulancias y los laboratorios para la industria en general, clasificadas en las fracciones 942 y 845, respectivamente.'
            },
            {
              key:'9-1-2',
              fraccion:'923',
              actividad:'Servicios de asistencia social.',
              clave:'I',
              descripcion:'Comprende a las entidades que prestan servicios de casas de cuna, orfanatorios, asilos, dispensarios y otros similares.'
            },
            {
              key:'9-1-3',
              fraccion:'924',
              actividad:'Servicios veterinarios y auxiliares.',
              clave:'I',
              descripcion:'Comprende a las empresas que se dedican a proporcionar servicios de veterinaria, así como servicios de estética, adiestramiento y pensión para perros y otros similares. Incluye establecimientos que se dedican a la compraventa de animales domésticos-ornato.'
            }
          ]
        },
        {key:'9-2',grupo:"93",label:'GRUPO 93 AGRUPACIONES MERCANTILES, PROFESIONALES, CÍVICAS, POLÍTICAS, LABORALES Y RELIGIOSAS',
          children:[
            {
              key:'9-2-0',
              fraccion:'931',
              actividad:'Asociaciones y organizaciones comerciales, profesionales, cívicas, laborales y políticas.',
              clave:'I',
              descripcion:'Comprende asociaciones y organizaciones tales como: cámaras industriales, de comercio, agricultores, ganaderos, abogados, actuarios, médicos, ingenieros; cívicas, fraternidades, clubes literarios e históricos, políticas, sindicales, laborales y otras asociaciones y organizaciones similares.'
            },
            {
              key:'9-2-1',
              fraccion:'933',
              actividad:'Organizaciones religiosas.',
              clave:'I',
              descripcion:'Comprende a las organizaciones que prestan servicios religiosos en iglesias, mezquitas, sinagogas, templos y otras instituciones que se dedican al fomento de actividades religiosas.'
            }
          ]
        },
        {key:'9-3',grupo:"94",label:'GRUPO 94 SERVICIOS DE ADMINISTRACIÓN PUBLICA Y SEGURIDAD SOCIAL',
          children:[
            {
              key:'9-3-0',
              fraccion:'941',
              actividad:'Servicios generales de la administración pública.',
              clave:'II',
              descripcion:'Comprende la dirección, coordinación, evaluación y control de los órganos de los Gobiernos Federal, Estatales y Municipales; administración de personal, adquisiciones, edificios, maquinaria, vehículos y demás aspectos relacionados con el ejercicio presupuestal; recaudación de impuestos, derechos, productos y aprovechamientos; gestión de la deuda pública y fiscalización del empleo de fondos públicos; administración general, asuntos de relaciones exteriores e intergubernamentales (excepto los asuntos monetarios y militares); supervisión y formulación de programas de educación; servicios legislativos, asuntos de planeación económica global relativos al territorio, empleo, estadísticas, celebración de elecciones; servicios prestados por tribunales de justicia y órganos afines y otros servicios de la administración pública similares; servicios de fomento, reglamentación, investigación, desarrollo, registro y vigilancia de asuntos laborales, agropecuarios, incluso los de caza, pesca y relacionados con las industrias extractivas y de construcción; la industria manufacturera y la industria eléctrica; el comercio y los servicios; vías y medios de comunicación y transportes; servicios de fomento regional, turísticos y de otras actividades similares, así como la administración general, supervisión y apoyo de programas de vivienda. Cuando se trate de la incorporación parcial al I.M.S.S. de servicios generales de la administración pública, la clasificación se hará conforme a la actividad que desarrollen en los términos y forma de este ordenamiento. La construcción y servicios de conservación de mantenimiento de obras públicas, se clasifican por separado en las fracciones de la División de la Construcción.'
            },
            {
              key:'9-3-1',
              fraccion:'942',
              actividad:'Seguridad pública.',
              clave:'III',
              descripcion:'Comprende a las entidades de servicios de vigilancia, investigación policiaca, incluso regularización de tránsito, combate de incendios y otros de esa índole. Así como de servicios de corrección y rehabilitación social. Incluye a las empresas que prestan en forma exclusiva el servicio de ambulancias para traslado de enfermos, personas accidentadas y otros servicios similares.'
            },
            {
              key:'9-3-2',
              fraccion:'943',
              actividad:'Seguridad social.',
              clave:'II',
              descripcion:'Comprende a las instituciones públicas que tienen por finalidad prestar asistencia médica, proteger los medios de subsistencia y prestar servicios sociales para el bienestar individual y colectivo.'
            }
          ]
        },
        {key:'9-4',grupo:"99",label:'GRUPO 99 SERVICIOS DE ORGANIZACIONES INTERNACIONALES Y OTROS ORGANISMOS EXTRATERRITORIALES',
          children:[
            {
              key:'9-4-0',
              fraccion:'990',
              actividad:'Servicios de organizaciones internacionales y otros organismos extraterritoriales.',
              clave:'I',
              descripcion:'Comprende los servicios de oficina y representación de organizaciones internacionales, servicios de embajadas, legaciones y consulados de otros países; servicios de oficina y representación de otros países u organismos que gozan de extraterritorialidad.'
            }
          ]
        }
      ]
    }
  ];

  constructor() {}

  /**
   * Devuelve todo el catálogo completo
   */
  getCatalogoCompleto() {
    return this.catalogo_de_actividades;
  }

  /**
   * Devuelve una lista plana con todas las actividades (nivel más bajo)
   */
  getListaActividadesPlanas() {
    const lista: any[] = [];
    this.catalogo_de_actividades.forEach(division => {
      division.children.forEach(grupo => {
        grupo.children.forEach(actividad => {
          lista.push({
            division: division.label,
            grupo: grupo.label,
            fraccion: actividad.fraccion,
            clave: actividad.clave,
            actividad: actividad.actividad,
            descripcion: actividad.descripcion
          });
        });
      });
    });

    return lista;
  }

  /**
   * Devuelve todas las divisiones (nivel 1)
   */
  getDivisiones() {
    return this.catalogo_de_actividades.map(d => ({
      key: d.key,
      division_id: d.division,
      division_nombre: d.label,
      //children: d.children
    }));
  }

  getDivisionNombre(division:any) {
    const act_division = this.catalogo_de_actividades.find((div:any) => div.division === division);
    return typeof act_division !== 'undefined' ? act_division.label : '';
  }

  getActividadesPorGrupoNombre(division: string, grupo: string) {
    const div = this.catalogo_de_actividades.find(d => d.division === division);
    const group = div?.children.find(g => g.grupo === grupo);
    return typeof div !== 'undefined' && typeof group !== 'undefined' ? group.label : '';
  }

  getActividadesPorFraccionNombre(division: string, grupo: string, fraccion: string) {
    const div = this.catalogo_de_actividades.find(d => d.division === division);
    const group = div?.children.find(g => g.grupo === grupo);
    const frac = group?.children.find(f => f.fraccion === fraccion);
    return typeof div !== 'undefined' && typeof group !== 'undefined' && typeof frac !== 'undefined' ? frac.actividad : '';
  }

  /**
   * Devuelve los grupos de una división
   */
  getGruposPorDivision(keyDivision: string) {
    const division = this.catalogo_de_actividades.find(d => d.division === keyDivision);
    return division ? division.children : [];
  }

  /**
   * Devuelve las actividades de un grupo específico
   */
  getActividadesPorGrupo(keyDivision: string, keyGrupo: string) {
    const division = this.catalogo_de_actividades.find(d => d.division === keyDivision);
    const grupo = division?.children.find(g => g.key === keyGrupo);
    return grupo ? grupo.children : [];
  }

  getActividadesPorGrupoGR(keyDivision: string, grupo_numero: string) {
    const division = this.catalogo_de_actividades.find(d => d.division === keyDivision);
    const grupo = division?.children.find(g => g.grupo === grupo_numero);
    return grupo ? grupo.children : [];
  }
}
