import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  username: string,
  email: string, 
  password: string,
}

const usersSchema: Schema<IUser> = new mongoose.Schema<IUser>({
    username: { type: String, required: [true, 'A username is required'] },

    email: { type: String, 
    required: [true, 'An e-mail is required'], 
    unique: true,
    validate: {
        validator: (v: string) => {
          // ! Regular expression for email validation
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Invalid email format'
      } },

      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
          validator: (v: string) => {
            // ! Regular expression for password validation: at least one letter, one number, and one special character
            return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
          },
          message: 'Password must contain at least one letter, one number, and one special character'
        }
      }, 
  }, {
      timestamps: true,
      toJSON: {
        transform: function(doc, ret) {
          delete ret.password;
          delete ret._id;
          return ret;
        }
      }
});

usersSchema.virtual('confirmPassword')
  .get(function (this: any) {
    return this._confirmPassword;
  })
  .set(function (this: any, value: string) {
    this._confirmPassword = value;
  });

// ! Validate password confirmation matches the password
usersSchema.pre('validate', function (this: any, next) {
  if (this.password !== this._confirmPassword) {
    this.invalidate('confirmPassword', 'Password confirmation does not match');
  }
  next();
});

// ! Add a unique index for the email field
usersSchema.index({ email: 1 }, { unique: true });

usersSchema.pre('save', function hashPassword(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
    console.log("Hashed Password:", this.password);
    next();
});

export function validatePassword(plainTextPassword: string, hashPasswordFromDB: string): boolean {
    return bcrypt.compareSync(plainTextPassword, hashPasswordFromDB);
}

export default mongoose.model('Users', usersSchema);
