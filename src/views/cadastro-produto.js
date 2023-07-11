import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroProduto() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/produtos`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
  const [dados, setDados] = useState(null);

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
    if (dados) {
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);
      setPreco(dados.preco);
      setQuantidadeEstoque(dados.quantidadeEstoque);
    }
  }, [dados]);

  function inicializar() {
    setId('');
    setNome('');
    setDescricao('');
    setPreco(0);
    setQuantidadeEstoque(0);
  }
async function salvar() {
  if (nome.trim() === '') {
    mensagemErro('O campo Nome é obrigatório.');
    return;
  }

  if (descricao.trim() === '') {
    mensagemErro('O campo Descrição é obrigatório.');
    return;
  }

  if (preco <= 0) {
    mensagemErro('O campo Preço deve ser maior que zero.');
    return;
  }

  if (quantidadeEstoque < 0) {
    mensagemErro('O campo Quantidade em Estoque deve ser maior ou igual a zero.');
    return;
  }

  const data = { id, nome, descricao, preco, quantidadeEstoque };
  try {
    if (idParam) {
      await axios.put(`${baseURL}/${idParam}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      mensagemSucesso(`Produto ${nome} alterado com sucesso!`);
    } else {
      await axios.post(baseURL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      mensagemSucesso(`Produto ${nome} cadastrado com sucesso!`);
    }
    navigate('/listagem-produtos');
  } catch (error) {
    if (error.response) {
      mensagemErro(error.response.data);
    } else {
      mensagemErro('Ocorreu um erro de rede.');
    }
  }
}

  return (
    <div className='container'>
      <Card title='Cadastro de Produto'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome:' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <input
                  type='text'
                  id='inputDescricao'
                  value={descricao}
                  className='form-control'
                  name='descricao'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Preço:' htmlFor='inputPreco'>
                <input
                  type='number'
                  id='inputPreco'
                  value={preco}
                  className='form-control'
                  name='preco'
                  onChange={(e) => setPreco(e.target.value)}
                />
              </FormGroup>

              <FormGroup
                label='Quantidade em Estoque:'
                htmlFor='inputQuantidadeEstoque'
              >
                <input
                  type='number'
                  id='inputQuantidadeEstoque'
                  value={quantidadeEstoque}
                  className='form-control'
                  name='quantidadeEstoque'
                  onChange={(e) => setQuantidadeEstoque(e.target.value)}
                />
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
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

export default CadastroProduto;