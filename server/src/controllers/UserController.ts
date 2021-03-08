import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { hash } from 'bcryptjs'
import RoleRepository from '../repositories/RoleRepository';

class UserController {

  async create(req: Request, res: Response){
    const userRepository = getCustomRepository(UserRepository);
    const roleRepository = getCustomRepository(RoleRepository);

    const { name, username, password, roles } = req.body;
    
    const userExist = await userRepository.findOne({username});
    if(userExist)
      return res.status(400).json({err: "Usuario já existe!"});

    const passwordHashed = await hash(password, 8);

    const rolesExist = await roleRepository.findByIds(roles)

    const user = userRepository.create({
      name,
      username,
      password:passwordHashed,
      roles: rolesExist,
    });

    await userRepository.save(user);
    
    return res.status(201).json(user);
  }


}

export default new UserController;