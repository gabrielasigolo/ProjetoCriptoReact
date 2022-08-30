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