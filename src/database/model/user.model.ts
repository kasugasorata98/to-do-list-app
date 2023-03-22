import mongoose, { Schema, Document } from 'mongoose'

export interface User extends Document {
  email: string
  sub: string
  name: string
  username: string
  toDoList: Array<{
    title: string
    description: string
    isDone: boolean
  }>
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
    toDoList: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
        isDone: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<User>('User', UserSchema)
