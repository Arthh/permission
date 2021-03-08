import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { sign } from 'jsonwebtoken';

class SessionController {

  async create(req: Request, res: Response){
    const { username , password } = req.body;

    const userRepository = getCustomRepository(UserRepository);
    
    const user = await userRepository.findOne({username}, {relations: ['roles']});

    if(!user)
      return res.status(400).json({err: "Usuario não existe!"});

    const matchPassword = await compare(password, user.password);

    if(!matchPassword)
      return res.status(400).json({err: "Usuario ou senha incorreto!"});

    const roles = user.roles.map( role => role.name);

    const token = await sign({roles}, "7asd6879asd7fdsdasd" , {
      subject: user.id,
      expiresIn: '1d'
    });

    return res.json({token, user})
  }

}

export default new SessionController;