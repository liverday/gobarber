import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;

describe('ListProvidersService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
    });

    it('should be able to list all providers, except the logged user', async () => {
        const userOne = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const userTwo = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'john@tre.com',
            password: '123456',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'John Quá',
            email: 'john@doe.com',
            password: '123456',
        });

        const listProvidersService = new ListProvidersService(
            fakeUsersRepository,
        );

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([userOne, userTwo]);
    });
});
