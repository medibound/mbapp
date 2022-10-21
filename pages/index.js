import Pathways from "./index/Pathways";
import Devices from "./index/Devices";
import Account from "./index/Account";
import Partners from "./index/Partners";
import Reports from "./index/Reports";
import Users from "./index/Users";

import Login from "./auth/Login";
import Register from "./auth/Register";

export const Pages = { 
    Pathways,
    Devices,
    Account,
    Reports,
    Partners,
    Users,
    Auth: {
        Login,
        Register,
    }
}
