import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,

        @inject('CacheProvider') private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ user_id }: IRequest): Promise<User[]> {
        let users = await this.cacheProvider.get<User[]>(
            `providers-list:${user_id}`,
        );

        console.log(users);

        if (!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id,
            });
        }

        await this.cacheProvider.put(`providers-list:${user_id}`, users);

        return users;
    }
}

export default ListProvidersService;
