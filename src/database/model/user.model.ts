import mongoose, { Schema, Document } from 'mongoose'

export interface User extends Document {
  email: string
  sub: string
  name: string
  username: string
}

const UserSchema: Schema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    sub: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<User>('User', UserSchema)
