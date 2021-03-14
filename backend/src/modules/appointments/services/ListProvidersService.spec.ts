import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
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
            fakeCacheProvider,
        );

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([userOne, userTwo]);
    });
});
