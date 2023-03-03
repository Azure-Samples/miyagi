// ** Icon imports
import ViewDashboardOutline from 'mdi-material-ui/ViewDashboardOutline'
import MapMarkerRadiusOutline from 'mdi-material-ui/MapMarkerRadiusOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import { WrenchOutline } from 'mdi-material-ui'
import { CartOutline } from 'mdi-material-ui'

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dasboard',
    icon: ViewDashboardOutline,
    path: '/home'
  },
  {
    title: 'Locations',
    icon: MapMarkerRadiusOutline,
    path: '/locations'
  },
  {
    title: 'Customers',
    icon: AccountGroupOutline,
    path: '/customers',
    action: 'read',
    subject: 'acl-page'
  },
  {
    title: 'Worker',
    icon: WrenchOutline,
    path: '/worker',
    action: 'read',
    subject: 'acl-page'
  },
  {
    title: 'Products',
    icon: CartOutline,
    path: '/products',
    action: 'read',
    subject: 'acl-page'
  }
]

export default navigation
