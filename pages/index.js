import Pathways from "./index/Pathways";
import Device from "./index/Device";
import Account from "./index/Account";
import Partners from "./index/Partners";
import Reports from "./index/Reports";
import Users from "./index/Users";

import Login from "./auth/Login";
import Register from "./auth/Register";

export const Pages = { 
    Pathways,
    Device,
    Account,
    Reports,
    Partners,
    Users,
    Auth: {
        Login,
        Register,
    }
}
