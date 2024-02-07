import { Document, Model } from 'mongoose';

interface User {
  username: string;
  password: string;
}

interface UserDocument extends Document, User {}

declare const User: Model<UserDocument>;

export default User;