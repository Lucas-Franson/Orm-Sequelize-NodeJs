// const database = require('../models');
// const Sequelize = require('sequelize');
const { PessoasServices} = require('../services');
const pessoasServices = new PessoasServices();

class PessoaController {

    static async pegaPessoasAtivas(req, res) {
        try {
            const pessoasAtivas = await pessoasServices.pegaRegistrosAtivos();
    
            return res.status(200).json(pessoasAtivas);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaTodasAsPessoas(req, res) {
        try {
            const todasAsPessoas = await pessoasServices.pegaTodosOsRegistros();
    
            return res.status(200).json(todasAsPessoas);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaUmaPessoa(req, res) {
        const { id } = req.params;
        try {
            const umaPessoa = await database.Pessoas.findOne({ where: { id: Number(id) }});

            return res.status(200).json(umaPessoa);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }

    static async criaPessoa(req, res) {
        const novaPessoa = req.body;
        try {
            const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
            return res.status(200).json(novaPessoaCriada);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async atualizaPessoa(req, res) {
        const novasInfos = req.body;
        const { id } = req.params;
        try {
            await database.Pessoas.update(novasInfos, {
                where: {
                    id: Number(id)
                }
            });

            const pessoaAtualizada = await database.Pessoas.findOne({ where: { id: Number(id) }});
            return res.status(200).json(pessoaAtualizada);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async apagaPessoa(req, res) {
        const { id } = req.params;
        try {
            await database.Pessoas.destroy({ where: { id: Number(id) }})
            return res.status(200).json({ mensagem: `id ${id} deletado` });
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async restauraPessoa(req, res) {
        const { id } = req.params;
        try {
            await database.Pessoas.restore( { where: { id: Number(id) }});
            return res.status(200).json({ mensagem: `id ${id} restaurado` });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaUmaMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params;
        try {
            const umaMatricula = await database.Matriculas.findOne({ where: { 
                id: Number(matriculaId),
                estudanteId: Number(estudanteId) 
            }});

            return res.status(200).json(umaMatricula);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }

    static async criaMatricula(req, res) {
        const { estudanteId } = req.params;
        const novaMatricula = { ...req.body, estudanteId: Number(estudanteId) };
        try {
            const novaMatriculaCriada = await database.Matriculas.create(novaMatricula);
            return res.status(200).json(novaMatriculaCriada);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async atualizaMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params;
        const novasInfos = req.body;
        try {
            await database.Matriculas.update(novasInfos, {
                where: {
                    id: Number(matriculaId),
                    estudanteId: Number(estudanteId)
                }
            });

            const matriculaAtualizada = await database.Matriculas.findOne({ where: { id: Number(matriculaId) }});
            return res.status(200).json(matriculaAtualizada);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async apagaMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params;
        try {
            await database.Matriculas.destroy({ where: { id: Number(matriculaId) }});
            return res.status(200).json({ mensagem: `id ${matriculaId} deletado` });
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaMatriculas(req, res) {
        const { estudanteId } = req.params;
        try {
            const pessoa = await database.Pessoas.findOne({ where: {id: Number(estudanteId) }});
            const matriculas = await pessoa.getAulasMatriculadas();

            return res.status(200).json(matriculas);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaMatriculasPorTurma(req, res) {
        const { turmaId } = req.params;
        try {
            const todasAsMatriculas = await database.Matriculas
                .findAndCountAll({
                    where: {
                        turma_id: Number(turmaId),
                        status: 'confirmado'
                    },
                    limit: 1,
                    order: [['estudante_id', 'DESC']]
                })

            return res.status(200).json(todasAsMatriculas);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async pegaTurmasLotadas(req, res) {
        const lotacaoTurma = 2;
        try {
            const turmasLotadas = await database.Matriculas.findAndCountAll({
                where: {
                    status: 'confirmado'
                },
                attributes: ['turma_id'],
                group: ['turma_id'],
                having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
            });

            return res.status(200).json(turmasLotadas);
        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

    static async cancelaPessoa(req, res) {
        const { estudanteId } = req.params;
        try {
            database.sequelize.transaction(async transacao => {
                await database.Pessoas
                    .update({ ativo: false }, { where: {id: Number(estudanteId) } }, 
                    { transaction: transacao })
                await database.Matriculas
                    .update({ status: 'cancelado' }, { where: { estudante_id: Number(estudanteId) } },
                    { transaction: transacao })
                
                return res.status(200).json({ message: `Matricula ref. estudante ${estudanteId} canceladas` })
            })

        } catch(err) {
            return res.status(500).json(err.message);
        }
    }

}

module.exports = PessoaController;