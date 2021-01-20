import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { v4 as uuid } from 'uuid';

export default class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    create(data: ICreateUserDTO): User {
        const user = new User();

        Object.assign(user, { id: uuid() }, { ...data });

        this.users.push(user);

        return user;
    }

    async save(data: User): Promise<User> {
        const findIndex = this.users.findIndex(user => user.id === data.id);

        if (findIndex >= 0) {
            this.users[findIndex] = data;
        }

        return data;
    }
}
