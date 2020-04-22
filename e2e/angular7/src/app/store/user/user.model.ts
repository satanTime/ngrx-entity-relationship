import {Company} from '../company/company.model';

export interface User {
    id: string;
    name: string;
    managerId?: string;
    manager?: User;
    employees?: Array<User>;
    company?: Company;
    companyId?: string;
}
