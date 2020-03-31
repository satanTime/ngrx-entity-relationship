import {Company} from 'src/app/store/company/company.model';

export interface Address {
    id: string;
    name: string;
    company?: Company;
    companyId?: string;
}
