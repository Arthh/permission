import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';
import RoleRepository from '../repositories/RoleRepository';

class RoleController {
  async create(req: Request, res: Response){
    const roleRepository = getCustomRepository(RoleRepository);
    const permissionRepository = getCustomRepository(PermissionRepository);

    const { name, description, permissions } = req.body;

    const roleExist = await roleRepository.findOne({ name })
    if(roleExist)
      return res.status(400).json({err: "Role já existe!"});

    const permissionsExist = await permissionRepository.findByIds(permissions);


    const role = roleRepository.create({name,
      description,
      permission: permissionsExist,
    });
    
    await roleRepository.save(role);

    return res.json(role);
  }
}

export default new RoleController;