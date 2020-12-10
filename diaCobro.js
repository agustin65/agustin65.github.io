
const Feriados = [
    [1, 4],
    [24, 25],
    [23, 24, 31],
    [10],
    [1, 25],
    [15, 20],
    [9, 10],
    [17],
    [],
    [12],
    [23],
    [7, 8, 25]
]

const y = '2021'

const Calendario = mes => {
    let Dias = []
    const feriados = Feriados[mes * 1 - 1]
    for (let i = 1; i < 32; i++) {
        const date = new Date(Fecha(mes) + '/' + Fecha(i) + '/' + y)
        if (date.getDay() < 6 && date.getDay() > 0 && date.getMonth() == mes * 1 - 1) {
            Dias.push(i)
        }
        for (let n in feriados) {
            if (feriados[n] == i) {
                Dias.pop()
            }
        }

    }
    Dias[-1] = Dias[Dias.length - 1]
    Dias[-2] = Dias[Dias.length - 2]
    return Dias
}

const Fecha = string => {
    if (string.toString().length == 1) {
        return '0' + string
    } else {
        return string
    }
}

const mes = document.getElementById('mes')
const dia = document.getElementById('dia')
const diaCobro = document.getElementById('diaCobro')

dia.addEventListener('input', () => { CalcularDia() })
mes.addEventListener('change', () => { CalcularDia() })

const CalcularDia = () => {
    let Mes = 0
    if (mes.value == 0) {
        const date = new Date()
        Mes = date.getMonth() * 1 + 1
    } else {
        Mes = mes.value
    }
    const calendario = Calendario(Mes)
    for (let i in calendario) {
        if (calendario[i] == dia.value) {
            diaCobro.value = i * 1 + 1
            return
        }
    }
    diaCobro.value = -1
}