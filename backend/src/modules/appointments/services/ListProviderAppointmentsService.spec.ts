import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
    });

    it('should be able to list the mont availability from provider', async () => {
        const [appointmentOne, appointmentTwo] = await Promise.all([
            fakeAppointmentsRepository.create({
                user_id: 'user',
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 9, 0, 0),
            }),
            fakeAppointmentsRepository.create({
                user_id: 'user',
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 10, 0, 0),
            }),
            fakeAppointmentsRepository.create({
                user_id: 'user',
                provider_id: 'provider',
                date: new Date(2021, 2, 12, 9, 0, 0),
            }),
        ]);

        const listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            year: 2021,
            month: 3,
            day: 13,
        });

        expect(appointments).toEqual([appointmentOne, appointmentTwo]);
    });
});
