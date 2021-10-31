import BottomTab from './navigation/BottomTab';

import CodeVerify from './server/CodeVerify'
import CodeTap from './server/CodeTap'
import DeviceList from './server/DeviceList'
import PartnerList from './server/PartnerList';
import DeviceOptions from './server/DeviceOptions';
import UsersList from './server/UsersList';
import Colors from './vars/Colors';

export const Objects = { 
    Navigation: {
        BottomTab,
    },
    Server: {
        CodeVerify,
        CodeTap,
        DeviceList,
        PartnerList,
        DeviceOptions,
        UsersList,
    },
    Vars: {
        Colors,
    }
}
