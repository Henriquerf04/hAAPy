import { Request, Response } from 'express'
import { getRepository } from 'typeorm'                               // repositório para gerenciar as operações no BD
import Orphanage from '../models/Orphanage'                           // importando o model
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'                                            // validação de dados (é importado diferente pois não tem export default)

export default {
  async index(req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return res.json(orphanageView.renderMany(orphanages))
  },

  async show(req: Request, res: Response) {
    const { id } = req.params

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    })

    return res.json(orphanageView.render(orphanage))
  },

  async create(req: Request, res: Response) {
    const {
     name, 
     latitude,
     longitude,
     about,
     instructions,
     opening_hours,
     open_on_weekends
    } = req.body
    
    const orphanagesRepository = getRepository(Orphanage)     // repositório configurado com o model 'Orphanage'
    
    const requestImages = req.files as Express.Multer.File[]   // definindo o req.files como array de arquivos, evita erros quando for upload de multiplos arquivos
    const images = requestImages.map(image => {
      return { path: image.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',                                   // se for true vai mandar true
      images
    }

    const schema = Yup.object().shape({                                                // schema de validação
      name: Yup.string().required('Não é possível cadastrar um Orfanato sem nome'),    // podemos personalizar a mensagem
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      immages: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    })

    await schema.validate(data, {
      abortEarly: false                                        // não parar validação se achar erro para que mostre todos os erros
    })

    const orphanage = orphanagesRepository.create(data)
    
    await orphanagesRepository.save(orphanage)                 // é uma ação demorada, precisa do await
    
    return res.status(201).json(orphanage)                      // status 201 = algo foi criado
  }
}