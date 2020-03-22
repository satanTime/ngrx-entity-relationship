import {Company} from 'src/app/store/company/company.model';

export interface User {
  id: string;
  name: string;
  company?: Company;
  companyId?: string;
}
