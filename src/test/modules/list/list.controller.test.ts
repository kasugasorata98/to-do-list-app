import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ListController from '../../../modules/list/list.controller'
import ListService from '../../../modules/list/list.service'

let mongoServer: MongoMemoryServer
let listController: ListController
let mockAddToList: jest.MockedFunction<typeof ListService.prototype.addToList>
