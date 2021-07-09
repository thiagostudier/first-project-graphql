const { usuarios, proximoId } = require('../../data/db');

// FUNÇÃO PARA BUSCAR O USUARIO
function indiceUsuario(filtro){
    // SE NÃO FOR PASSADO UM FILTRO
    if(!filtro) return -1;
    // PEGAR OS DADOS DE ID E EMAIL
    const { id, email } = filtro
    if(id){
        return usuarios.findIndex(u => u.id === id)
    }else if(email){
        return usuarios.findIndex(u => u.email === email);
    }
    // SE NÃO ENCONTRAR O USUARIO
    return -1
}

module.exports = {

    // MINHAS RESOLVERS

    novoUsuario(_, { dados }){

        // VALIDAR SE E-MAIL EXISTE
        const emailExistente = usuarios.some(u => u.email === dados.email)
        if(emailExistente){
            throw new Error('E-mail cadastrado!');
        }

        const novo = {
            id: proximoId(),
            ...dados,
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)

        return novo;
    },

    excluirUsuario(_, { filtro }){
        // PEGAR ITEM
        const i = indiceUsuario(filtro)
        // VALIDAR SE EXISTE
        if(i < 0) return null
        // EXCLUIR
        const excluidos = usuarios.splice(i, 1)
        // RETORNAR
        return excluidos ? excluidos[0] : null
    },

    alterarUsuario(_, { filtro, dados }) {
        // PEGAR USUARIO
        const i = indiceUsuario(filtro)
        // VALIDAR SE EXISTE
        if(i < 0) return null
        // ALTERAR DADOS
        usuarios[i].nome = dados.nome ? dados.nome : usuarios[i].nome;
        usuarios[i].email = dados.email ? dados.email : usuarios[i].email;
        usuarios[i].idade = dados.idade ? dados.idade : usuarios[i].idade;
        // RETORNAR DADO ALTERADO
        return usuarios[i]
    }

}