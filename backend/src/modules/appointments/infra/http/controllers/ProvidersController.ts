import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { plainToClass, classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import User from '@modules/users/infra/typeorm/entities/User';

export default class ProvidersController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const listProvidersService = container.resolve(ListProvidersService);

        const providers = await listProvidersService.execute({
            user_id,
        });

        return response.json(classToClass(plainToClass(User, providers)));
    }
}
