import {Company} from '../company/company.model';

export interface Address {
    uuid: string;
    name: string;
    company?: Company;
    companyId?: string;
}
