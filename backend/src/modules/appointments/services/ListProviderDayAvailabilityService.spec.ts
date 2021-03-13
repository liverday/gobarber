import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailabilityService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
    });

    it('should be able to list the mont availability from provider', async () => {
        await Promise.all([
            fakeAppointmentsRepository.create({
                user_id: 'user',
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 12, 0, 0),
            }),
            fakeAppointmentsRepository.create({
                user_id: 'user',
                provider_id: 'provider',
                date: new Date(2021, 2, 13, 13, 0, 0),
            }),
        ]);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 2, 13, 11, 0, 0).getTime();
        });

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
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 11, available: false },
                { hour: 12, available: false },
                { hour: 13, available: false },
                { hour: 14, available: true },
            ]),
        );
    });
});
