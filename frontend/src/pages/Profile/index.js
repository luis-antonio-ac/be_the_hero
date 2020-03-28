import React, { useEffect, useState } from 'react';
import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { FiPower, FiTrash2 } from 'react-icons/fi';

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const history = useHistory();

    const ong_nome = localStorage.getItem('ong_nome');
    const ong_id = localStorage.getItem('ong_id');

    // Recebe dois paramestros
    // --> Uma função para ser executada
    // Quando queremos executar essa função
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ong_id,
            }
        }).then(response => {
            setIncidents(response.data)
        }) 
    }, [ong_id]);

    async function handleDeleteIncident(incident_id) {
        try {
            await api.delete(`incidents/${incident_id}`, {
                headers: {
                    Authorization: ong_id,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== incident_id));
        } catch {
            alert('Erro ao deletar o caso, tente novamente.');
        }
    }

    function handleLogout() {
        localStorage.clear();

        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be a Hero"/>
                <span>Bem vinda, {ong_nome}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#e02041"></FiPower>
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size={20} color="a8a8b3"></FiTrash2>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}