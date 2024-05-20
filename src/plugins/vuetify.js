
// Styles
import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import { aliases,fa } from 'vuetify/iconsets/fa'
import 'vuetify/styles'
//import Vuetify from 'vuetify/lib/framework';

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
 {
  icons: {
    defaultSet: 'fa',
    aliases,
    iconfont: 'fa' || 'md' || 'mdi',
    sets: {
      fa,
    },
},
 }
)





