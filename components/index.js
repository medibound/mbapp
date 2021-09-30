import BottomTab from './navigation/BottomTab';

import CodeVerify from './server/CodeVerify'
import CodeTap from './server/CodeTap'
import DeviceList from './server/DeviceList'
import PartnerList from './server/PartnerList';
import DeviceOptions from './server/DeviceOptions';
import UsersList from './server/UsersList';

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
    }
}
