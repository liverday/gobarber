import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindByDateFromProviderDTO from '@modules/appointments/dtos/IFindByDateFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        user_id,
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            user_id,
            provider_id,
            date,
        });

        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async findByDate({
        provider_id,
        date,
    }: IFindByDateFromProviderDTO): Promise<Appointment | undefined> {
        const findAppointmentInSameDate = await this.ormRepository.findOne({
            where: { provider_id, date },
        });

        return findAppointmentInSameDate;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        year,
        month,
    }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName => `
                    to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'
                `,
                ),
            },
        });
    }

    public async findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
    }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName => `
                    to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'
                `,
                ),
            },
            relations: ['user'],
        });
    }
}

export default AppointmentsRepository;
