const { usuarios, proximoId } = require('../data/db');

module.exports = {

    // MINHAS RESOLVERS

    novoUsuario(_, args){

        // VALIDAR SE E-MAIL EXISTE
        const emailExistente = usuarios.some(u => u.email === args.email)
        if(emailExistente){
            throw new Error('E-mail cadastrado!');
        }

        const novo = {
            id: proximoId(),
            ...args,
            perfil_id: 1,
            status: 'ATIVO'
        }

        usuarios.push(novo)

        return novo;
    },

    excluirUsuario(_, { id }){
        // PEGAR ITEM
        const i = usuarios.findIndex(u => u.id === id)
        // VALIDAR SE EXISTE
        if(i < 0){
            return null;
        };
        // EXCLUIR
        const excluidos = usuarios.splice(i, 1)
        // RETORNAR
        return excluidos ? excluidos[0] : null
    },

    alterarUsuario(_, args) {
        const i = usuarios.findIndex(u => u.id === args.id)

        if(i < 0) return null

        usuarios[i].nome = args.nome ? args.nome : usuarios[i].nome;
        usuarios[i].email = args.email ? args.email : usuarios[i].email;
        usuarios[i].idade = args.idade ? args.idade : usuarios[i].idade;

        // const usuario = {
        //     ...usuarios[i],
        //     ...args
        // }

        // usuarios.splice(i, 1, usuario)

        return usuarios[i]
    }

}