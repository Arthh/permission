import { Request, Response, NextFunction} from 'express';
import { decode } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

async function decoder(req: Request): Promise<User | undefined >  {
  const authHeader = req.headers.authorization || "";
  const userRepository = await getCustomRepository(UserRepository);

  const [ , token ] = authHeader?.split(" ");

  const payload = decode(token);

  const user = await userRepository.findOne(payload?.sub , { relations: ['roles'] });

  return user;
}

 function is(role: String[]){

  const roleAuthorized = async (req: Request, resp: Response, next: NextFunction) =>  {
    const user = await decoder(req);

    const userRoles = user?.roles.map( role => role.name);

    const rolesExists = userRoles?.some(r => role.includes(r));

    if(rolesExists)
      return next();
    

    return resp.status(401).json({message: "Não autorizado!"})
  }
  return roleAuthorized;
}

export { is }