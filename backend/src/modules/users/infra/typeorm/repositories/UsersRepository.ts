import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    findById(id: string): Promise<User | undefined> {
        return this.ormRepository.findOne(id);
    }

    findByEmail(email: string): Promise<User | undefined> {
        return this.ormRepository.findOne({ where: { email } });
    }

    create(data: ICreateUserDTO): User {
        return this.ormRepository.create(data);
    }

    save(data: User): Promise<User> {
        return this.ormRepository.save(data);
    }
}
