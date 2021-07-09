const { perfis, proximoId } = require('../../data/db');

// FUNÇÃO PARA BUSCAR O USUARIO
function indicePerfil(filtro){
    // SE NÃO FOR PASSADO UM FILTRO
    if(!filtro) return -1;
    // PEGAR OS DADOS DE ID E EMAIL
    const { id } = filtro
    if(id){
        return perfis.findIndex(u => u.id === id)
    }
    // SE NÃO ENCONTRAR O USUARIO
    return -1
}

module.exports = {

    // MINHAS RESOLVERS

    novoPerfil(_, { dados }){

        // VALIDAR SE NOME EXISTE
        const nomeExistente = perfis.some(u => u.nome === dados.nome)
        if(nomeExistente){
            throw new Error('Nome já cadastrado!');
        }

        const novo = {
            id: proximoId(),
            ...dados,
        }

        perfis.push(novo)

        return novo;
    },

    excluirPerfil(_, { filtro }){
        // PEGAR ITEM
        const i = indicePerfil(filtro)
        // VALIDAR SE EXISTE
        if(i < 0) return null
        // EXCLUIR
        const excluidos = perfis.splice(i, 1)
        // RETORNAR
        return excluidos ? excluidos[0] : null
    },

    alterarPerfil(_, { filtro, dados }) {
        // PEGAR USUARIO
        const i = indicePerfil(filtro)
        // VALIDAR SE EXISTE
        if(i < 0) return null
        // ALTERAR DADOS
        perfis[i].nome = dados.nome ? dados.nome : perfis[i].nome;
        // RETORNAR DADO ALTERADO
        return perfis[i]
    }

}