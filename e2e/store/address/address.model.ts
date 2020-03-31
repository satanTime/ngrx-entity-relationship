import {Company} from '../company/company.model';

export interface Address {
    id: string;
    street: string;
    city: string;
    country: string;
    company?: Company;
    companyId?: string;
}
