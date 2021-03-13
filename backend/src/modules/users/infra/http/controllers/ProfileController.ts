import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class UsersController {
    public async show(request: Request, response: Response): Promise<Response> {
        const showProfileService = container.resolve(ShowProfileService);

        const user = await showProfileService.execute({
            user_id: request.user.id,
        });

        delete user.password;

        return response.json(user);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { name, email, oldPassword, password } = request.body;

            const updateProfileService = container.resolve(
                UpdateProfileService,
            );

            const user = await updateProfileService.execute({
                user_id: request.user.id,
                name,
                email,
                oldPassword,
                password,
            });

            delete user.password;

            return response.json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}
