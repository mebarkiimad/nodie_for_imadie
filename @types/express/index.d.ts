import {user} from '../../src/models/userModel';


declare global{
    namespace Express {
        interface Request {
            currentUser: user
        }
    }
}