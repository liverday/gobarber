import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailabilityService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
    });

    it('should be able to list the mont availability from provider', async () => {
        const hourStart = 8;
        await Promise.all([
            ...Array.from({ length: 10 }, (_, index) => index + hourStart).map(
                hour => {
                    return fakeAppointmentsRepository.create({
                        provider_id: 'provider',
                        date: new Date(2021, 2, 12, hour, 0, 0),
                    });
                },
            ),
            fakeAppointmentsRepository.create({
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 8, 0, 0),
            }),
        ]);

        const listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );

        const availability = await listProviderMonthAvailabilityService.execute(
            {
                provider_id: 'provider',
                year: 2021,
                month: 3,
            },
        );

        expect(availability).toEqual(
            expect.arrayContaining([
                {
                    day: 12,
                    available: false,
                },
                {
                    day: 13,
                    available: true,
                },
            ]),
        );
    });
});
