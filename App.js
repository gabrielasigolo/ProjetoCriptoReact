import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, StatusBar, Image,
  ActivityIndicator, TextInput, FlatList, Modal, Pressable
} from 'react-native'
import { getCotacoes, getGraficoCripto } from './services/criptoService'
import themes from './themes'
import CriptoItem from './components/CriptoItem'
// yarn add react-native-pure-chart
import PureChart from 'react-native-pure-chart'

const App = () => {
  const [criptos, setCriptos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [busca, setBusca] = useState('')
  const [modalVisivel, setModalVisivel] = useState(false)
  const [criptoSelecionada, setCriptoSelecionada] = useState({})
  const [dadosGrafico, setDadosGrafico] = useState([])
  const [graficoBarra, setGraficoBarra] = useState(true)


  const trataModal = async(moeda) => {
    // alert(JSON.stringify(moeda))
    const dadosAPI = await getGraficoCripto(moeda.item.id)
    setDadosGrafico(dadosAPI)
    setCriptoSelecionada(moeda.item)
    setModalVisivel(true)
  }

  const carregaCotacoes = async () => {
    setCarregando(true)
    const dadosCotacoes = await getCotacoes()
    setCriptos(dadosCotacoes)
    setCarregando(false)
  }

  useEffect(() => {
    //Iremos carregar os dados na primeira vez
    carregaCotacoes()
  }, []) // quando o array vazio, executa só uma vez

  const semDados = () => {
    return(
      <View style={{
        backgroundColor: themes.colors.utility.danger,
        borderRadius: 16,
        marginTop: 16
      }}>
        <Text style={{
          color: themes.colors.neutral.foreground,
          margin: 8,
          fontWeight: 'bold'
        }}>
          ☹️ Ah não! Infelizmente a cripto {busca} não existe. Refaça a busca.
          </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themes.colors.brand.azul} />
      <View style={styles.header}>
        <Image source={require('./img/logo.png')}
          style={styles.logo} />
        <Text style={styles.titulo}>Cotação das Criptos</Text>
      </View>
      {carregando &&
        <ActivityIndicator size="large"
          color={themes.colors.utility.contrast} />}
      <TextInput
        placeholder='🔎Filtrar...'
        autoFocus
        placeholderTextColor={themes.colors.neutral.foreground}
        onChangeText={(text) => setBusca(text)}
        style={styles.buscaInput}
      />
      <FlatList
        style={styles.listagem}
        data={criptos.filter(
          (coin) => 
          coin.name.toLowerCase().includes(busca.toLocaleLowerCase()) || 
          coin.symbol.toLowerCase().includes(busca.toLocaleLowerCase()) 
        )}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => <CriptoItem coin={item} onPress={() => trataModal({item})} />} ListEmptyComponent={semDados()}
      />

      <Modal 
        animationType='slide'
        transparent={true}
        visible={modalVisivel}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 24}}>
        <View style={styles.modalView}>
          <Image source={{ uri: criptoSelecionada.image}} style={styles.logo}/>
          <Text>Gráfico dos últimos 15 dias da Cripto {criptoSelecionada.name}</Text>

          <PureChart data={dadosGrafico} width={'100%'} height={200} type='bar'/>

          <View style={{flexDirection: 'row'}}>
          <Pressable style={styles.botaoFechaModal} onPress={()=> setModalVisivel(!modalVisivel)}>
            <Text>📊Mudar Gráfico</Text>
          </Pressable>
          <Pressable style={styles.botaoFechaModal} onPress={()=> setModalVisivel(!modalVisivel)}>
            <Text>❌Fechar</Text>
          </Pressable>
          </View>
        </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  listagem: { width: '90%' },
  titulo: {
    fontSize: 24, color: themes.colors.brand.laranja,
    marginTop: 8, width: '70%'
  },
  container: {
    backgroundColor: themes.colors.neutral.background,
    flex: 1,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    width: '90%',
    marginBottom: 8,
    justifyContent: 'space-between'
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 8,
    resizeMode: 'contain'
  },
  buscaInput: {
    color: themes.colors.neutral.foreground,
    backgroundColor: themes.colors.neutral.neutral100,
    borderBottomColor: themes.colors.utility.contrast,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    borderBottomWidth: 2,
    textAlign: 'left'
  },
  modalView: {
    margin: 8,
    backgroundColor: themes.colors.neutral.foreground,
    borderRadius: 24,
    padding: 8,
    width: '100%',
    alignItems: 'center'
  },
  botaoFechaModal: {
    marginTop: 16,
    marginRight: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: themes.colors.utility.contrast
  }

})
export default App
