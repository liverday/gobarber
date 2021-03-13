import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailiabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailabilityService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
    });

    it('should be able to list the mont availability from provider', async () => {
        await Promise.all([
            fakeAppointmentsRepository.create({
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 8, 0, 0),
            }),
            fakeAppointmentsRepository.create({
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 10, 0, 0),
            }),
        ]);

        const listProviderMonthAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );

        const availability = await listProviderMonthAvailabilityService.execute(
            {
                provider_id: 'provider',
                year: 2021,
                month: 3,
                day: 13,
            },
        );

        expect(availability).toEqual(
            expect.arrayContaining([
                {
                    hour: 8,
                    available: false,
                },
                {
                    hour: 9,
                    available: true,
                },
                {
                    hour: 10,
                    available: false,
                },
                {
                    hour: 11,
                    available: true,
                },
            ]),
        );
    });
});
