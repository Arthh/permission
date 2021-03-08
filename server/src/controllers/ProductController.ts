import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../repositories/ProductRepository';

class ProductController {
  async create(req: Request, res: Response){
    const productRepository = getCustomRepository(ProductRepository);

    const { name, description } = req.body;

    const productExist = await productRepository.findOne({ name })
    if(productExist)
      return res.status(400).json({err: "Produto já existe!"})

    const product = productRepository.create({name, description});
    
    await productRepository.save(product);

    return res.json(product);
  }

  async index(req: Request, res: Response){
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();
    
    return res.json(products);
    
  }

  async show(req: Request, res: Response){
    const productRepository = getCustomRepository(ProductRepository);

    const { id } = req.params;

    const product = await productRepository.findOne(id);

    return res.json(product)
  }
}

export default new ProductController;