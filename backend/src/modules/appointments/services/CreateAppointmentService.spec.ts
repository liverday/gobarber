import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointment.execute({
            user_id: 'user',
            date: new Date(2021, 2, 13, 13, 0, 0),
            provider_id: 'teste123',
        });

        expect(appointment.provider_id).toBe('teste123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2021, 0, 19, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2021, 0, 19, 13, 0, 0);

        await createAppointment.execute({
            user_id: 'user',
            date: appointmentDate,
            provider_id: 'teste123',
        });

        await expect(
            createAppointment.execute({
                user_id: 'user',
                date: appointmentDate,
                provider_id: 'teste123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        await expect(
            createAppointment.execute({
                user_id: 'user',
                date: new Date(2021, 2, 13, 11, 0, 0),
                provider_id: 'teste123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        await expect(
            createAppointment.execute({
                user_id: 'user',
                date: new Date(2021, 2, 13, 13, 0, 0),
                provider_id: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoulkd not be able to create an appointment before 8am', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        await expect(
            createAppointment.execute({
                user_id: 'user',
                date: new Date(2021, 2, 13, 7, 0, 0),
                provider_id: 'teste123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoulkd not be able to create an appointment after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 12, 0, 0).getTime();
        });

        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        await expect(
            createAppointment.execute({
                user_id: 'user',
                date: new Date(2021, 2, 13, 18, 0, 0),
                provider_id: 'teste123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
