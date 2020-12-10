//Grilla o grillas a utilizar 
const Grilla = {
    cd: [
        //{ c: 5, v: 440 },
        //{ c: 6, v: 390 },
        { c: 7, v: 350 },
        //{ c: 8, v: 320 },
        { c: 9, v: 300 },
        //{ c: 10, v: 290 },
        { c: 12, v: 265 },
        //{ c: 15, v: 240 },
        { c: 18, v: 215 },
    ],
    la: [
        //{ c: 5, v: 500 },
        //{ c: 6, v: 430 },
        { c: 7, v: 395 },
        //{ c: 8, v: 375 },
        { c: 9, v: 360 },
        //{ c: 10, v: 310 },
        { c: 12, v: 280 },
        { c: 18, v: 220 }
    ]
}

//link con elementos de html que se van a utilizar
const haberes = document.querySelector("#haberes");
const descuentos = document.querySelector("#descuentos");

const Metodo = document.querySelector("#metodo");
const CuotaSocial = document.querySelector("#cs");
const Opciones = document.querySelector("#op");
const MontoMaximo = document.querySelector("#mm");
const CuotasMaximas = document.querySelector("#cm");

//agregado escucha de los cambios de todas las opciones 
Metodo.addEventListener('change', () => {
    /*CambiarCS()*/
    //CambiarMM()
    calcular()
})
CuotaSocial.addEventListener('change', () => { calcular() })
Opciones.addEventListener('change', () => { calcular() })
MontoMaximo.addEventListener('change', () => { calcular() })
CuotasMaximas.addEventListener('change', () => { calcular() })

var hab = [];
var des = [];

const CambiarCS = () => {
    if (Metodo.value == 'la') {
        CuotaSocial.value = 200
    } else {
        CuotaSocial.value = 250
    }
}

const CambiarMM = () => {
    if (Metodo.value == 'la') {
        MontoMaximo.value = 10000
    } else {
        MontoMaximo.value = 10000
    }
}

haberes.addEventListener('submit', e => {
    e.preventDefault();
    let input = haberes.querySelector('input').value;
    if (input != '') {
        hab.push(input)
        haberes.reset();
        display('#dhaberes', hab);
    }
    calcular();
})

document.querySelector('#bhaberes').addEventListener('click', () => {
    if (hab.length > 0) {
        hab.pop();
        display('#dhaberes', hab)
    }
    calcular();
})

descuentos.addEventListener('submit', e => {
    e.preventDefault();
    let input = descuentos.querySelector('input').value;
    if (input != '') {
        des.push(input)
        descuentos.reset();
        display('#ddescuentos', des);
    }
    calcular();
})

document.querySelector('#bdescuentos').addEventListener('click', () => {
    if (des.length > 0) {
        des.pop();
        display('#ddescuentos', des)
    }
    calcular();
})

//despliega para el usuario los descuentos y haberes ingresados 
function display(donde, que) {
    document.querySelector(donde).value = que.map(q => (q));
}

//todo lo relacionado a la calificacion se hace en esta funcion 
function calcular() {
    //suma de haberes y descuentos
    let haberes = 0;
    hab.map(h => (haberes += h * 1));
    let descuentos = 0;
    des.map(d => (descuentos += d * 1));
    //determinacion de cuanto hay disponible
    const diferencia = Math.trunc((haberes - descuentos) / 3) - CuotaSocial.value;
    let texto = '';
    if (diferencia > 0) {
        //seleccion de grilla a usar
        let grilla = [];
        if (Metodo.value == "cd") {
            grilla = Grilla.cd
        } else if (Metodo.value == "la") {
            grilla = Grilla.la
        }
        if (grilla.length > 0) {
            let opciones = [];
            //orden de opciones y montos disponibles
            for (let i in grilla) {
                //control de que no se tomen en cuenta mas cuotas de las seleccionadas
                if (grilla[i].c <= CuotasMaximas.value) {
                    //determina si el valor de la grilla encaja en el disponible, y se filtra los que estan arriba del maximo
                    if (diferencia / grilla[i].v < (MontoMaximo.value / 1000) && Math.trunc(diferencia / grilla[i].v) > 0) {
                        opciones.push({
                            i: diferencia / grilla[i].v - Math.trunc(diferencia / grilla[i].v),    //index (numero usado para ordenar las opciones)
                            v: grilla[i].v,                                                        //valor de cuota
                            m: Math.trunc(diferencia / grilla[i].v) * 1000,                        //monto maximo disponible
                            c: grilla[i].c                                                         //cantidad de cuotas
                        });
                    } else if (Math.trunc(diferencia / grilla[i].v) > 0) {
                        opciones.push({
                            i: diferencia / grilla[i].v - Math.trunc(diferencia / grilla[i].v),
                            v: grilla[i].v,
                            m: MontoMaximo.value,
                            c: grilla[i].c
                        });
                    }
                }
            }
            //ordena las opciones en base a su index (que monto encaja mejor)
            opciones.sort((a, b) => (a.i - b.i))
            //elimina todas las opciones sobrantes 
            while (opciones.length > Opciones.value) {
                opciones.pop()
            }
            //crea las lineas de texto que contienen informacion guardada en 'opciones'
            for (let i in opciones) {
                texto += 'Hasta $' + opciones[i].m + ' en ' + opciones[i].c + ' cuotas de $' + opciones[i].m / 1000 * opciones[i].v + '\n';
            }
            //agrega el texto estatico de respuesta
            texto += "Más una cuota social mensual de $" + CuotaSocial.value;
            //if(Metodo.value == 'la'){
            texto += '\n Preaprobado'
            //}
        } else {
            //si la grilla seleccionada no existe, se desplegara este mensaje
            texto = 'Error en la grilla seleccionada'
        }
    } else {
        //se despliega si el monto disponible es 0 o menor 
        texto = 'No califica'
    }
    //envia el texto creado a que se imprima en pantalla 
    displayText(texto);
}

//Solo se encarga de desplegar el texto dentro del textarea #texto
function displayText(text) {
    document.querySelector("#texto").innerHTML = text
}

//se le da funcionalidad a los botones de limpiar y copiar
document.querySelector('#limpiar').addEventListener('click', () => { limpiar() })
document.querySelector('#copiar').addEventListener('click', () => { copiar() })

//limpia los valores de haberes y descuentos, mantiene el resto de selecciones 
function limpiar() {
    hab = [];
    des = [];
    display('#dhaberes', hab);
    display('#ddescuentos', des);
    displayText('Ingrese datos');
}

//se copia el texto al portapapeles
function copiar() {
    document.querySelector("#texto").select();
    document.execCommand("copy");
}