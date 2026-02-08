// models/User.ts
import mongoose, { Document, Model, Schema, CallbackError } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ROLES, UserRole } from '../lib/auth-utils';

// Define the user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  role: UserRole;
  addresses: any[];
  orders: any[];
  wishlist: any[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Check if model is already defined
let User: Model<IUser>;

// Define the user schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false },
  role: { 
    type: String, 
    enum: Object.values(ROLES),
    default: ROLES.USER,
    required: true
  },
  addresses: [{ type: Schema.Types.Mixed }],
  orders: [{ type: Schema.Types.Mixed }],
  wishlist: [{ type: Schema.Types.Mixed }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next: any) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as CallbackError);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Always use UserBackend collection
User = mongoose.models.UserBackend as Model<IUser> || mongoose.model<IUser>('UserBackend', userSchema);

export default User;