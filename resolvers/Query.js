const { usuarios, perfis } = require('../data/db')

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
    // PEGAR USUARIOS
    usuarios() {
        return usuarios
    },
    // PEGAR USUARIO
    usuario(_, { filtro }) {
        // PEGAR ITEM
        const i = indiceUsuario(filtro)
        // VALIDAR SE EXISTE
        if(i < 0) return null
        // RETORNAR
        return usuarios[i];
    },
    // PEGAR PERFIS
    perfis() {
        return perfis
    },
    // PEGAR PERFIL
    perfil(_, { id }) {
        const sels = perfis
            .filter(p => p.id === id)
        return sels ? sels[0] : null 
    }
}