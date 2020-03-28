import React, { useState } from 'react';
import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { FiArrowLeft } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

export default function NewIncident() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');

    const ong_id = localStorage.getItem('ong_id');
    const history = useHistory();

    async function handleNewIncident(e) {
        
        e.preventDefault();
        
        const data = {
            title, 
            description,
            value
        };
        
        try {
            await api.post('incidents', data, {
                headers: {
                    Authorization: ong_id,
                }
            });
            console.log('ola');

            history.push('/profile');
        } catch(err) {
            console.log(err);
            alert('Erro ao cadastrar caso, tente novament.');
        }
    }

    return (
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be a Hero"/>

                    <h1>Cadastrar Novo Caso</h1>
                    <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso</p>

                    <Link className="back-link" to="/profile">
                        <FiArrowLeft size={16} color="#e02041"/>
                        Voltar para Home
                    </Link>
                </section>

                <form onSubmit={handleNewIncident}>
                    <input 
                        placeholder="Titulo do caso"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        />
                    <textarea 
                        placeholder="Descrição do caso" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}>    
                    </textarea>
                    <input 
                        placeholder="Valor em reais"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        />

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}