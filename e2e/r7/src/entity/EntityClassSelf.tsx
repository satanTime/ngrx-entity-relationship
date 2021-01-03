import {HANDLER_ENTITIES, HANDLER_ENTITY, rootEntities} from 'ngrx-entity-relationship';
import React, {ReactNode} from 'react';
import {connect, DefaultRootState} from 'react-redux';

import {Company} from './store/company/company.model';
import {EntityService} from './store/entity.service';
import {
    sAddressCompany,
    sCompany,
    sCompanyAddress,
    sCompanyAdmin,
    sCompanyStaff,
    selectCurrentCompanyId,
    selectCurrentUsersIds,
    sUser,
    sUserCompany,
    sUserEmployees,
    sUserManager,
} from './store/reducers';
import {User} from './store/user/user.model';

class EntityClassSelf extends React.Component<{
    service: EntityService;
    state: DefaultRootState;
}> {
    // prettier-ignore
    protected readonly companyWithCrazyData: HANDLER_ENTITY<Company> = sCompany(
        sCompanyAddress(),
        sCompanyAdmin(
            sUserEmployees(),
        ),
        sCompanyStaff(
            sUserCompany(
                sCompanyAddress(
                    sAddressCompany(),
                ),
            ),
        ),
    );

    // prettier-ignore
    protected readonly users: HANDLER_ENTITIES<User> = rootEntities(
        sUser(
            sUserEmployees(
                sUserManager(),
            ),
            sUserManager(),
        ),
    );

    public render(): ReactNode {
        return (
            <div>
                <h1>EntityClassSelf</h1>
                <button onClick={() => this.props.service.changeUser('user1')} role='user1'>
                    Change user1
                </button>
                <button onClick={() => this.props.service.changeUser('user2')} role='user2'>
                    Change user2
                </button>
                <button onClick={() => this.props.service.changeUser('user3')} role='user3'>
                    Change user3
                </button>
                <button onClick={() => this.props.service.changeUser('user4')} role='user4'>
                    Change user4
                </button>
                <button onClick={() => this.props.service.changeUser('user5')} role='user5'>
                    Change user5
                </button>
                <button onClick={() => this.props.service.changeUser('user6')} role='user6'>
                    Change user6
                </button>
                <button onClick={() => this.props.service.changeCompany('company1')} role='company1'>
                    Change company1
                </button>
                <button onClick={() => this.props.service.changeCompany('company2')} role='company2'>
                    Change company2
                </button>
                <button onClick={() => this.props.service.changeCompany('company3')} role='company3'>
                    Change company3
                </button>
                <button onClick={() => this.props.service.changeAddress('address1')} role='address1'>
                    Change address1
                </button>
                <button onClick={() => this.props.service.changeAddress('address2')} role='address2'>
                    Change address2
                </button>

                <section>
                    <h2>Company</h2>
                    <strong>selector</strong>
                    <pre>
                        {`
protected readonly companyWithCrazyData: HANDLER_ENTITY<Company> = sCompany(
    sCompanyAddress(),
    sCompanyAdmin(
        sUserEmployees(),
    ),
    sCompanyStaff(
        sUserCompany(
            sCompanyAddress(
                sAddressCompany(),
            ),
        ),
    ),
);
                        `.trim()}
                    </pre>
                    <strong>usage</strong>
                    <pre>
                        {`
protected readonly selectedCompany = (store: DefaultRootState) =>
    this.companyWithCrazyData(store, selectCurrentCompanyId);
                    `.trim()}
                    </pre>
                    <strong>
                        {`
{JSON.stringify(this.selectedCompany(this.props.state), null, 2)}
                    `.trim()}
                    </strong>
                    <pre role='companies'>{JSON.stringify(this.selectedCompany(this.props.state), null, 2)}</pre>
                </section>

                <section>
                    <h2>Users</h2>
                    <strong>selector</strong>
                    <pre>
                        {`
protected readonly users: HANDLER_ENTITIES<User> = rootEntities(
    sUser(
        sUserEmployees(
            sUserManager(),
        ),
        sUserManager(),
    ),
);
                        `.trim()}
                    </pre>
                    <strong>usage</strong>
                    <pre>
                        {`
protected readonly selectedUsers =
    (store: DefaultRootState) => this.users(store, selectCurrentUsersIds);
                    `.trim()}
                    </pre>
                    <strong>
                        {`
{JSON.stringify(this.selectedUsers(this.props.state), null, 2)}
                    `.trim()}
                    </strong>
                    <pre role='users'>{JSON.stringify(this.selectedUsers(this.props.state), null, 2)}</pre>
                </section>
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.users.release();
        this.companyWithCrazyData.release();
    }

    protected readonly selectedUsers = (store: DefaultRootState) => this.users(store, selectCurrentUsersIds);
    protected readonly selectedCompany = (store: DefaultRootState) =>
        this.companyWithCrazyData(store, selectCurrentCompanyId);
}

export default connect(state => ({state}))(EntityClassSelf);
