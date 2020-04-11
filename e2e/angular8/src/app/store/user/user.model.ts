import {Company} from '../company/company.model';

export interface User {
    userId: string;
    name: string;
    managerId?: string;
    employee?: User;
    employees?: Array<User>;
    company?: Company;
    companyId?: string;
}
