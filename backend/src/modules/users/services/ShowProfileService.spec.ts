import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
    });

    it('should be able to fetch an user data', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'teste123',
        });

        const showProfileService = new ShowProfileService(fakeUsersRepository);

        const userShown = await showProfileService.execute({
            user_id: user.id,
        });

        expect(userShown.name).toBe('John Doe');
        expect(userShown.email).toBe('john@doe.com');
    });

    it('should not be able to fetch data for a non existing user', async () => {
        const showProfileService = new ShowProfileService(fakeUsersRepository);

        await expect(
            showProfileService.execute({
                user_id: 'wrong_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
