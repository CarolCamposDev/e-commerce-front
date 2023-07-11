import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/carrinhos`;

function ListagemCarrinhos() {
  const navigate = useNavigate();
  const [precoTotal, setPrecoTotal] = useState({});
  const [dados, setDados] = useState(null);

  const cadastrar = () => {
    navigate(`/cadastro-carrinho`);
  };

  const editar = (id) => {
    navigate(`/cadastro-carrinho/${id}`);
  };

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;
    console.log(url);
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Carrinho excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir carrinho`);
      });
  }

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  useEffect(() => {
    if (dados) {
      const fetchPrecoTotal = async () => {
        try {
          const carrinhoPromises = dados.map((dado) => {
            return axios.get(`${baseURL}/${dado.id}`);
          });
          const carrinhoResponses = await Promise.all(carrinhoPromises);
          const carrinhos = carrinhoResponses.map((response) => response.data);
          const precoTotalMap = {};
          carrinhos.forEach((carrinho) => {
            const total = carrinho.produtos.reduce(
              (acc, produto) => acc + produto.preco,
              0
            );
            precoTotalMap[carrinho.id] = total;
          });
          setPrecoTotal(precoTotalMap);
        } catch (error) {
          console.error('Erro ao obter detalhes do carrinho:', error);
        }
      };
      fetchPrecoTotal();
    }
  }, [dados]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de Carrinhos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={cadastrar}
              >
                Novo Carrinho
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Id</th>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Produto</th>
                    <th scope='col'>Total</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.id}</td>
                      <td>{dado.cliente.nome}</td>
                      <td>
                        {dado.produtos.map((produto) => (
                          <div key={produto.id}>
                            {produto.nome} - {produto.descricao}
                          </div>
                        ))}
                      </td>
                      <td>
                        {precoTotal[dado.id] ? precoTotal[dado.id].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                      </td>
                      <td>{dado.status}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemCarrinhos;
