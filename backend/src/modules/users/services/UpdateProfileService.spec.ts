import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
    });

    it('should be able to update user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'john@tre.com',
        });

        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('john@tre.com');
    });

    it('shoulde not be able to change the email to an existing one', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'John Poe',
            email: 'john@poe.com',
            password: '123456',
        });

        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'john@doe.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'john@doe.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.name).toBe('John Doe');
        expect(updatedUser.email).toBe('john@doe.com');
        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password for non existing user', async () => {
        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            updateProfileService.execute({
                user_id: 'teste_teste',
                name: 'John Doe',
                email: 'john@doe.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'john@doe.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '123456',
        });

        const updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'john@doe.com',
                old_password: 'wrong_password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
