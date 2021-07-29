const db = require('../../config/db')

module.exports = {
    async perfis() {
        return db('perfis')
    },
    async perfil(_, { filtro }) {
        if(!filtro) return null
        const { id, nome } = filtro
        if(id){
            return db('perfis')
                .where({ id })
                .first();
        }else if(nome){
            return db('perfis')
                .where({ nome })
                .first();
        }else{
            return null;
        }
    }
}