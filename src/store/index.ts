import { createStore } from 'vuex';

import { LoginModule } from './modules/authentication.store';
import { ContextModule } from './modules/context.store';

export default createStore({
  modules: {
    LoginModule,
    ContextModule
  }
})
