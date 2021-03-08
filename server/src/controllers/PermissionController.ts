import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';

class PermissionController {
  async create(req: Request, res: Response){
    const permissionRepository = getCustomRepository(PermissionRepository);

    const { name, description } = req.body;

    const permissionExist = await permissionRepository.findOne({ name })
    if(permissionExist)
      return res.status(400).json({err: "Permissão já existe!"})

    const permission = permissionRepository.create({name, description});
    
    await permissionRepository.save(permission);

    return res.json(permission);
  }
}

export default new PermissionController;