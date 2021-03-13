import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';
import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    user_id: string;
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationRepository,
    ) {}

    public async execute({
        user_id,
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                "You can't create an appointment on a past date",
            );
        }

        if (user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You can only create appointments between 8am and 5pm',
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
