import mongoose, { Schema, Document, Types } from 'mongoose'

export interface User extends Document {
  email: string
  sub: string
  username: string
  toDoList: Array<{
    _id: string
    title: string
    description?: string
    isDone?: boolean
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
        _id: {
          type: Types.ObjectId,
          index: true,
          auto: true,
        },
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
