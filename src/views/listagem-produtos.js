import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/produtos`;

function ListagemProdutos() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);

  const cadastrar = () => {
    navigate('/cadastro-produto');
  };

  const editar = (id) => {
    navigate(`/cadastro-produto/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso('Produto excluído com sucesso!');
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir o produto');
    }
  };

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className='container'>
      <Card title='Listagem de Produtos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={cadastrar}
              >
                Novo Produto
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Id</th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Preço</th>
                    <th scope='col'>Quantidade Estoque</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.id}</td>
                      <td>{dado.nome}</td>
                      <td>{dado.descricao}</td>
                      <td>{formatarPreco(dado.preco)}</td>
                      <td>{dado.quantidadeEstoque}</td>
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

export default ListagemProdutos;
