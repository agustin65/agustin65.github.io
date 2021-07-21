//feriados del año
const feriados = [
    '9/7',
    '16/8',
    '8/10',
    '11/10',
    '20/11',
    '22/11',
    '8/12',
    '25/12'
]

//tasas usadas
const tasaInmediata = 0.02

const tasaDiferida = 0.07 / 30

const tasaApertura = 0.03

//default input value
Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

document.getElementById('fechaInicio').value = new Date().toDateInputValue()

//inputs
const operacion = document.getElementById('operacion')
const monto = document.getElementById('monto')
const fechaInicio = document.getElementById('fechaInicio')
const fechaFin = document.getElementById('fechaFin')

//outputs
const montoFinal = document.getElementById('montoFinal')
const montoARecibir = document.getElementById('montoARecibir')
const inputDias = document.getElementById('dias')
const gastosBancarios = document.getElementById('gastos')
const comMutual = document.getElementById('comisionMutual')
const comAmcap = document.getElementById('comisionAmcap')
const inputTasaApertura = document.getElementById('tasaApertura')
const montoInteres = document.getElementById('montoInteres')
const restos = document.getElementById('restos')

//ocultar inputs / cosas esteticas
const inputFechas = document.getElementById('inputFechas')
const displayInteres = document.getElementById('displayInteres')

function SeleccionFecha() {
    if (operacion.value === 'instantaneo') {
        inputFechas.hidden = true
        displayInteres.innerText = 'Interes (2%)'
    } else {
        displayInteres.innerText = 'Interes (7%)'
        inputFechas.hidden = false
    }
}

function Decimales(n) {
    n = +n
    return '$' + formatNumber((Math.ceil(n)).toString())
}

function QuitarFormato(n) {
    n = n.toString().replace('$', '')
    while (n.indexOf(',') > 0) {
        n = n.replace(',', '')
    }
    return +n
}

//calcular dias entre fechainicio y fechafin
function CalcularDias() {
    if (fechaFin.value !== '' && fechaInicio.value !== '') {
        let diasAgregados = AgregarDias(new Date(fechaFin.value))
        const date1 = new Date(fechaInicio.value);
        const date2 = new Date(fechaFin.value);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + diasAgregados
    } else {
        return 0
    }
}

function AgregarDias(d) {
    let add = 0
    const fecha = (d.getDate() + 1) + '/' + (d.getMonth() + 1)
    if (feriados.includes(fecha)) {
        add = 1
    }
    console.log(d.getDay())
    if (d.getDay() > 1) {
        return 5 + add
    } else {
        return 3 + add
    }
}

//main function
function Calcular() {
    if (operacion.value === 'instantaneo') {
        if (monto.value !== '') {
            let m = QuitarFormato(monto.value)
            montoFinal.value = Decimales(m - (m * tasaApertura) - (m * tasaInmediata))
            inputDias.value = 1
            gastosBancarios.value = Decimales(m * 0.012)
            comMutual.value = Decimales(m * 0.01)
            inputTasaApertura.value = Decimales(m * tasaApertura)
            montoInteres.value = Decimales(m * tasaInmediata)
            restos.value = Decimales(QuitarFormato(inputTasaApertura.value) - QuitarFormato(gastosBancarios.value))
            comAmcap.value = Decimales(QuitarFormato(montoInteres.value) - QuitarFormato(comMutual.value))
            montoARecibir.value = Decimales(QuitarFormato(montoFinal.value) + QuitarFormato(gastosBancarios.value) + QuitarFormato(comMutual.value))
        }
    } else {
        if (monto.value !== '' && fechaInicio.value !== '' && fechaFin.value !== '') {
            let dias = CalcularDias()
            let m = QuitarFormato(monto.value)
            montoFinal.value = Decimales(m - (m * tasaApertura) - (m * tasaDiferida * dias))
            inputDias.value = dias
            gastosBancarios.value = Decimales(m * 0.012)
            comMutual.value = Decimales(m * (0.01 / 30) * dias)
            inputTasaApertura.value = Decimales(m * tasaApertura)
            montoInteres.value = Decimales(m * tasaDiferida * dias)
            restos.value = Decimales(QuitarFormato(inputTasaApertura.value) - QuitarFormato(gastosBancarios.value))
            comAmcap.value = Decimales(QuitarFormato(montoInteres.value) - QuitarFormato(comMutual.value))
            montoARecibir.value = Decimales(QuitarFormato(montoFinal.value) + QuitarFormato(gastosBancarios.value) + QuitarFormato(comMutual.value))
        }
    }
}

//add event listeners
operacion.onchange = () => {
    SeleccionFecha()
    Calcular()
}
monto.onchange = () => Calcular()
fechaInicio.onchange = () => Calcular()
fechaFin.onchange = () => Calcular()

//copiado para dar formato de moneda
// Jquery Dependency

$("input[data-type='currency']").on({
    keyup: function () {
        formatCurrency($(this));
    },
    blur: function () {
        formatCurrency($(this), "blur");
    }
});

function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") {
        return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = "$" + left_side + "." + right_side;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = "$" + input_val;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}