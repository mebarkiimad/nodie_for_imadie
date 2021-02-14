import  {AccessControl} from 'accesscontrol'

const ac:AccessControl = new AccessControl();

    ac.grant("basic")
    .readOwn("profile")
    .updateOwn("profile")
    
   ac.grant("supervisor")
    .extend("basic")
    .readAny("profile")
    
   ac.grant("admin")
    .extend("basic")
    .extend("supervisor")
    .updateAny("profile")
    .deleteAny("profile")
    

export  {ac};