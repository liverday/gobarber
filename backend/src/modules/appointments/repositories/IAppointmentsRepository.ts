import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';
import IFindByDateFromProviderDTO from '../dtos/IFindByDateFromProviderDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        data: IFindByDateFromProviderDTO,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthProviderDTO,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayProviderDTO,
    ): Promise<Appointment[]>;
}
