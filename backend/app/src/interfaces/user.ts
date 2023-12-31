/**
 * Define the user interface
 * 
 * @interface User
 *  
 */

export interface IUser {
    _id: string;
    email: string;
    name: string;
    password: string;
    role: number;
}

export default IUser;
