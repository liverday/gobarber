import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: 'teste123',
        });

        expect(appointment.provider_id).toBe('teste123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2021, 0, 19, 23);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: 'teste123',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: 'teste123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
