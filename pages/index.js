import Home from "./index/Home";
import Users from "./index/Users";
import Devices from "./index/Devices";
import Partners from "./index/Partners";
import Account from "./index/Account";

import Login from "./auth/Login";
import Register from "./auth/Register";

export const Pages = { 
    Home,
    Users,
    Devices,
    Partners,
    Account,
    Auth: {
        Login,
        Register,
    }
}
