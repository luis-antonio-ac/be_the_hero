import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import logoImg from '../../assets/logo.png';
import styles from './styles';

import api from '../../services/api';

export default function Incidents() {
    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);

    // Controla a paginação, inicia na pg 1
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    function navigateToDetail(incident) {
        // Mesmo nome que 
        // <AppStack.Screen name="Details" component={Details} />
        // Do arquivo routes.js
        navigation.navigate('Details', { incident });

        // Segundo parâmetro são as informações que você pode passar para
        // a pagina a qual você está redirecionando o usuário 
    }

    async function loadIncidents() {
        if(loading === true) return;

        // Se o total de casos for maior que zero e o todos os casos ja
        // tiverem sido carregados não faça nada
        if(total > 0 && incidents.length === total) {
            return;
        }

        // Marca o inicio da requisição ao banco
        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });

        // Anexa os novos incidentes aos ja carregados
        setIncidents([...incidents, ...response.data.incidents]);

        // X-total-count é o nome do contador que nós definimos no backend
        // Ele retorna o total de casos
        setTotal(response.headers['x-total-count']);

        // Pula para a próxima página
        setPage(page + 1);

        // Marca o fim da requisição ao banco
        setLoading(false);
    } 

    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>
        

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia</Text>

            <FlatList
                data={incidents}
                style={styles.incidentList} 
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                    
                    <View style={styles.incidentItem}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.nome}</Text>
     
                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>
     
                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{
                            Intl.NumberFormat(
                                'pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(incident.value)}</Text>
     
                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041" />
                       </TouchableOpacity>
     
                    </View>
                )}
            />
        </View>
    );
}