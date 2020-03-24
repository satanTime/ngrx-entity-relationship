import {Company} from 'src/app/store/company/company.model';

export interface User {
  id: string;
  name: string;
  managerId?: string;
  employee?: User;
  employees?: Array<User>;
  company?: Company;
  companyId?: string;
}
