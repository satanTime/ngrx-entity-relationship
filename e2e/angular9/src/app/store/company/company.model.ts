import {Address} from 'src/app/store/address/address.model';
import {User} from 'src/app/store/user/user.model';

export interface Company {
  id: string;
  name: string;
  staff?: Array<User>;
  admin?: User;
  adminId?: string;
  address?: Address;
  addressId?: string;
}
