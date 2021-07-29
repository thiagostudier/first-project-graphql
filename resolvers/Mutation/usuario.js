const db = require('../../config/db')

const { perfil: obterPerfil } = require('../Query/perfil'); //IMPORTANDO FUNÇÃO DE PEGAR PERFIL
const { usuario: obterUsuario } = require('../Query/usuario'); //IMPORTANDO FUNÇÃO DE PEGAR PERFIL

module.exports = {
    async novoUsuario(_, { dados }) {
        try {
            const idsPerfis = [] //CRIAR ARRAY VAZIO 
            if(dados.perfis){ //SE HOUVEREM PERFIS 
                for(let filtro of dados.perfis){ //PERCORRER PERFIS
                    const perfil = await obterPerfil(_, {filtro}) //PEGAR PERFIL PELA FUNÇÃO IMPORTADA
                    if(perfil) idsPerfis.push(perfil.id) //SE HOUVER O PERFIL, ADICIONAR O ID NO ARRAY
                }
            }
            // REMOVER OS DADOS DOS PERFIS ADICIONADOS NO "dados"
            delete dados.perfis;
            // CRIAR USUÁRIO
            const [ id ] = await db('usuarios')
                .insert({...dados});
            // CRIAR OS RELACIONAMENTOS ENTRE O USUARIOS E O(S) PERFIL(S)
            for(let perfil_id of idsPerfis){
                await db('usuarios_perfis')
                    .insert({ perfil_id, usuario_id: id });
            }
            // RETORNAR O USUARIO CRIADO
            // return obterUsuario(_, {filtro: {id: id}});
            return db('usuarios')
                .where({ id })
                .first();
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async excluirUsuario(_, { filtro }) {
        try {
            const usuario = await obterUsuario(_, {filtro}); //PEGAR USUARIO PELA FUNÇÃO IMPORTADA
            if(usuario){ 
                //PEGAR ID
                const { id } = usuario;
                // APAGR OS RELACIONAMENTOS ENTRE OS USUARIOS E OS PERFILS DESTE USUARIO
                await db('usuarios_perfis')
                    .where({ usuario_id: id })
                    .delete();
                // APAGAR USUARIO
                await db('usuarios')
                    .where({ id })
                    .delete();
            }
            return usuario;
        } catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    async alterarUsuario(_, { filtro, dados }) {
        try {
            const usuario = await obterUsuario(_, {filtro}); //PEGAR USUARIO PELA FUNÇÃO IMPORTADA
            if(usuario){ 
                const { id } = usuario
                // SE HOUVEREM PERFIS PARA EDITAR
                if(dados.perfis){
                    // APAGAR TODOS OS RELACIONAMENTOS ENTRE OS PERFIS
                    await db('usuarios_perfis')
                        .where( {usuario_id: id} )
                        .delete()
                    // PERCORRER PERFIS ADICIONADOS
                    for(let filtro of dados.perfis){
                        // PEGAR PERFIL 
                        const perfil = await obterPerfil(_, {filtro});
                        // CRIAR RELACIONAMENTO SE O PERFIL EXISTIR
                        perfil && await db('usuarios_perfis')
                            .insert({ 
                                perfil_id: perfil.id, 
                                usuario_id: id 
                            });
                    }
                }
                // REMOVER OS DADOS DOS PERFIS ADICIONADOS NO "dados"
                delete dados.perfis;
                // ATUALIZAR DADOS
                await db('usuarios')
                    .where({ id })
                    .update(dados);
            }
            // RETORNAR DADOS ATUALIZADOS OU VALOR NULO 
            return !usuario ? null : { ...usuario, ...dados }
        } catch(e) {
            throw new Error(e)
        }
    }
}