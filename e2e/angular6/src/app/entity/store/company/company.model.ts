import {Address} from '../address/address.model';
import {User} from '../user/user.model';

export interface Company {
    id: string;
    name: string;
    staff?: Array<User>;
    admin?: User;
    adminId?: string;
    address?: Address;
    addressId?: string;
}
