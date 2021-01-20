import { v4 as uuid } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), provider_id, date });

        this.appointments.push(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointmentInSameDate = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointmentInSameDate;
    }
}

export default FakeAppointmentsRepository;
