import {ngrxEntityRelationshipReducer} from 'ngrx-entity-relationship';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import EntityClassMapTo from './entity/EntityClassMapTo';
import EntityClassSelf from './entity/EntityClassSelf';
import {EntityFunction} from './entity/EntityFunction';
import {EntityEffects} from './entity/store/entity.effects';
import {EntityService} from './entity/store/entity.service';
import {rootReducer} from './entity/store/reducers';

const store = createStore(ngrxEntityRelationshipReducer(rootReducer));

const entityEffects = new EntityEffects(store);
const entityService = new EntityService(store);
entityEffects.address();
entityEffects.company();
entityEffects.user();

class App extends React.Component<any, {view: string}> {
    public state: {view: string} = {
        view: '',
    };

    public render(): React.ReactNode {
        return (
            <Provider store={store}>
                <div>
                    <button onClick={() => this.setState({view: 'EntityClassSelf'})} role='EntityClassSelf'>
                        EntityClassSelf
                    </button>
                    <button onClick={() => this.setState({view: 'EntityClassMapTo'})} role='EntityClassMapTo'>
                        EntityClassMapTo
                    </button>
                    <button onClick={() => this.setState({view: 'EntityFunction'})} role='EntityFunction'>
                        EntityFunction
                    </button>
                </div>
                <div>
                    {this.state.view === 'EntityClassSelf' && <EntityClassSelf service={entityService} />}
                    {this.state.view === 'EntityClassMapTo' && <EntityClassMapTo service={entityService} />}
                    {this.state.view === 'EntityFunction' && <EntityFunction service={entityService} />}
                </div>
            </Provider>
        );
    }
}

export default App;
