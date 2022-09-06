import themes from "../themes"

export const getCotacoes = async () => {
    const urlCoin = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    try {
        const response = await fetch(urlCoin)
        const data = await response.json()
        data.sort(function(elemAtual, elemAnterior){
            let atual = elemAtual.name.toUpperCase(),
                anterior = elemAnterior.name.toUpperCase()
            return atual == anterior ? 0 : atual > anterior ? 1 : -1
        })
        // console.table(data)
        return data
    }
    catch (error) {
        console.error(error.message)
    }
}

export const getGraficoCripto = async(idCripto) => {
    // Utilizando String Literals do ECMA6 (Ecma Script)
    const urlChart = `https://api.coingecko.com/api/v3/coins/${idCripto}/market_chart?vs_currency=brl&days=15&interval=daily`
    try {
        const response = await fetch (urlChart)
        const data = await response.json()
        const dadosGrafico = data.prices.map(formataGrafico)
        const informacoesGrafico = [    
            {
                color: themes.colors.utility.info,
                seriesName: 'cotacoes',
                data: dadosGrafico
            }
        ]
        // console.table(data) //exibindo os dados na console
        return informacoesGrafico
    } catch (error) {
        console.error(error.message)        
    }

    function formataGrafico(elemento) {
        let objeto = {}
        let dataFormatada = new Date(elemento[0]).toLocaleDateString('pt-br')
        objeto = {x: dataFormatada, y: elemento[1]}
        return objeto
    }
}