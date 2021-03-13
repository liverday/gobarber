import { v4 as uuid } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        user_id,
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), user_id, provider_id, date });

        this.appointments.push(appointment);

        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointmentInSameDate = this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );

        return findAppointmentInSameDate;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        year,
        month,
    }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) === month - 1 &&
                getYear(appointment.date) === year,
        );
    }

    public async findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
    }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) === month - 1 &&
                getYear(appointment.date) === year &&
                getDate(appointment.date) === day,
        );
    }
}

export default FakeAppointmentsRepository;
