const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { page = 1} = request.query;
 
        // Retorna a quantidade total de casos pelo cabeçalho da resposta
        const [count] = await connection('incidents').count();
        response.header('X-Total-Count', count['count(*)']);

        // Retorna 5 casos por pagina, mostrando as ongs relacionadas a cada caso
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.nome',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.cidade',
                'ongs.uf'
            ]);

        return response.json({ incidents });
    },
    
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        console.log(ong_id);
        console.log(id);

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(ong_id !== incident.ong_id) {
            return response.status(401).json({ error: 'Operação não autorizada' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
}