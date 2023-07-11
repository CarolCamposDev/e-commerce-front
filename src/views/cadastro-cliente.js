import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCliente() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/clientes`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  const [dados, setDados] = useState({});

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setCpf('');
      setEmail('');
      setSenha('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setUf('');
      setCep('');
    } else {
      setId(dados.id);
      setNome(dados.nome);
      setCpf(dados.cpf);
      setEmail(dados.email);
      setSenha(dados.senha);
      setLogradouro(dados.endereco.logradouro);
      setNumero(dados.endereco.numero);
      setComplemento(dados.endereco.complemento);
      setBairro(dados.endereco.bairro);
      setCidade(dados.endereco.cidade);
      setUf(dados.endereco.uf);
      setCep(dados.endereco.cep);
    }
  }

  async function salvar() {
    if (!nome) {
      mensagemErro('Por favor, preencha o campo Nome.');
      return;
    }

    if (!cpf) {
      mensagemErro('Por favor, preencha o campo CPF.');
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      mensagemErro('CPF inválido. O CPF deve ter 11 dígitos.');
      return;
    }

    if (!email) {
      mensagemErro('Por favor, preencha o campo Email.');
      return;
    }

    if (!senha) {
      mensagemErro('Por favor, preencha o campo Senha.');
      return;
    }

    if (!logradouro) {
      mensagemErro('Por favor, preencha o campo Logradouro.');
      return;
    }

    if (!numero) {
      mensagemErro('Por favor, preencha o campo Número.');
      return;
    }

    if (!bairro) {
      mensagemErro('Por favor, preencha o campo Bairro.');
      return;
    }

    if (!cidade) {
      mensagemErro('Por favor, preencha o campo Cidade.');
      return;
    }

    if (!uf) {
      mensagemErro('Por favor, preencha o campo UF.');
      return;
    }

    if (!cep) {
      mensagemErro('Por favor, preencha o campo CEP.');
      return;
    }

    const data = {
      nome,
      email,
      cpf,
      senha,
      endereco: { logradouro, numero, complemento, bairro, cidade, uf, cep },
    };

    try {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Cliente alterado com sucesso!');
      } else {
        await axios.post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Cliente cadastrado com sucesso!');
      }
      navigate('/listagem-clientes');
    } catch (error) {
      if (error.response) {
        mensagemErro(error.response.data);
      } else {
        mensagemErro('Ocorreu um erro de rede.');
      }
    }
  }

  async function buscarEndereco(cep) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const endereco = response.data;
      // Aqui você pode atualizar os estados dos campos do endereço com os dados recebidos
      setLogradouro(endereco.logradouro);
      setBairro(endereco.bairro);
      setCidade(endereco.localidade);
      setUf(endereco.uf);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  }

  useEffect(() => {
    async function buscarDados() {
      if (idParam != null) {
        try {
          const response = await axios.get(`${baseURL}/${idParam}`);
          setDados(response.data);
        } catch (error) {
          mensagemErro(error.response.data);
        }
      }
    }
    buscarDados();
  }, [idParam]);

  useEffect(() => {
    if (dados && Object.keys(dados).length > 0) {
      inicializar();
    }
  }, [dados]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Cliente'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  maxLength='11'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpf'
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                />
              </FormGroup>

              <FormGroup label='CEP:' htmlFor='inputCEP'>
                <input
                  type='text'
                  value={cep}
                  onChange={(event) => {
                    const novoCep = event.target.value;
                    setCep(novoCep.replace(/\D/g, ''));
                    if (novoCep.length === 8) {
                      buscarEndereco(novoCep);
                    }
                  }}
                />
              </FormGroup>

              <FormGroup label='Logradouro:' htmlFor='inputLogradouro'>
                <input
                  type='text'
                  id='inputLogradouro'
                  value={logradouro}
                  className='form-control'
                  name='logradouro'
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Número:' htmlFor='inputNumero'>
                <input
                  type='text'
                  id='inputNumero'
                  value={numero}
                  className='form-control'
                  name='numero'
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Complemento:' htmlFor='inputComplemento'>
                <input
                  type='text'
                  id='inputComplemento'
                  value={complemento}
                  className='form-control'
                  name='complemento'
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Bairro:' htmlFor='inputBairro'>
                <input
                  type='text'
                  id='inputBairro'
                  value={bairro}
                  className='form-control'
                  name='bairro'
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Cidade:' htmlFor='inputCidade'>
                <input
                  type='text'
                  id='inputCidade'
                  value={cidade}
                  className='form-control'
                  name='cidade'
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='UF:' htmlFor='inputUF'>
                <input
                  type='text'
                  id='inputUF'
                  value={uf}
                  className='form-control'
                  name='uf'
                  onChange={(e) => setUf(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='E-mail: *' htmlFor='inputEmail'>
                <input
                  type='email'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Senha: *' htmlFor='inputSenha'>
                <input
                  type='password'
                  id='inputSenha'
                  value={senha}
                  className='form-control'
                  name='senha'
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormGroup>

              <Stack direction='row' spacing={2}>
                <button className='btn btn-success' onClick={salvar}>
                  Salvar
                </button>
                <button className='btn btn-danger' onClick={() => navigate('/listagem-clientes')}>
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroCliente;
