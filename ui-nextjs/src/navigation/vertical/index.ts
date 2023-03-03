// ** Icon imports
// import HomeOutline from 'mdi-material-ui/HomeOutline'
// import EmailOutline from 'mdi-material-ui/EmailOutline'
// import ShieldOutline from 'mdi-material-ui/ShieldOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import ViewDashboardOutline from "mdi-material-ui/ViewDashboardOutline";

// import MapMarkerRadiusOutline from "mdi-material-ui/MapMarkerRadiusOutline";
// import AccountGroupOutline from "mdi-material-ui/AccountGroupOutline";
// import {CartOutline, WrenchOutline} from "mdi-material-ui";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dasboard',
      icon: ViewDashboardOutline,
      path: '/home'
    }

    // {
    //   title: 'Locations',
    //   icon: MapMarkerRadiusOutline,
    //   path: '/locations'
    // },
    // {
    //   title: 'Customers',
    //   icon: AccountGroupOutline,
    //   path: '/customers',
    //   action: 'read',
    //   subject: 'acl-page'
    // },
    // {
    //   title: 'Worker',
    //   icon: WrenchOutline,
    //   path: '/worker',
    //   action: 'read',
    //   subject: 'acl-page'
    // },
    // {
    //   title: 'Products',
    //   icon: CartOutline,
    //   path: '/products',
    //   action: 'read',
    //   subject: 'acl-page'
    // }
  ]
}

export default navigation
