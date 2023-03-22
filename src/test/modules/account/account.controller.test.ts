import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import AccountController from '../../../modules/account/account.controller'
import userModel from '../../../database/model/user.model'

let mongoServer: MongoMemoryServer
const accountController = new AccountController()

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('featureAccessController', () => {
  describe('registerUser', () => {
    it('should create a new user', async () => {
      const idToken =
        'eyJraWQiOiJ6Wm1lREFNVGRDUktPQ2pKRGpuZ2NlTDZoZkJudlVmQjhTMmdjMmllNGpNPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiUHAzeWtERmVDc3FUS3c0TGpCSjRIdyIsInN1YiI6ImQyN2UyMzRlLTY0NTMtNDViNi1hNGIzLTAxMGFiZjQzNzQwMCIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX3dHcTZqQ1pPaF9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfd0dxNmpDWk9oIiwiY29nbml0bzp1c2VybmFtZSI6Imdvb2dsZV8xMDM4NzY1MDQ4MTczODQ0NjI5NDMiLCJub25jZSI6InVtUjZtRVU1UEpLc01US1JBU2F3Qzl0Tm5WUGI5OS1iYzd0dHdUaHBXbk10NDJ1QktVTEdSR3NiOURnSTFKYVFtT1EtU25qSzB5OHg3UFIwQjY1YnZIRjZpM0c5a0xDdmYzR1dZcmFDZ3Vucm9HYWRSVE5GdU5aVkxEX0I1VW1idnM0N21GQ0w1NDFmVk5CZVdoZjJWN1duLWZETElla2lnZXk1Yzk2d1JUQSIsIm9yaWdpbl9qdGkiOiJkOWYyNGFhNS1hMjRmLTRhOTMtOTcwNS0xZjM0YTYyY2IxZDEiLCJhdWQiOiIxaTM1YjhnM3A0dm8ydm0xdnJkN2RncG1udCIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjEwMzg3NjUwNDgxNzM4NDQ2Mjk0MyIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2Nzk0OTU0ODA4MDQifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjc5NTA0OTM5LCJleHAiOjE2Nzk1MDg1MzksImlhdCI6MTY3OTUwNDkzOSwianRpIjoiYjYwZWUyOGItZmRmOS00ZjdjLTg3MTEtMzIyMTZjYWY1ZDU3IiwiZW1haWwiOiJqZXJvbXlraG85OEBnbWFpbC5jb20ifQ.js7ljKUryIJySOWHILrs5Pa5F8TbV5EeE6HsaDHL6ksvegSoH_E37hfdED5l-PO4f9PmqtzTuPOnqGCdJq_c-wldjdxkwpF8qNm_2nyrbBtOmxrhHix5GNejaEGZNo2rusJt2WfxWyn0xZHYvaCKAcx_ayW6rMMAzVHkHPL0q-Yim01Ea3PRJwoRA4bwLTW_RZih5a1S0VhqmKYEg79d2yycZNyls7zUXBHbHN04A9TBvkb9HqxMu_I4sp7sBuE4jEpPQBDqFWC6eP6j8eeKiYiprBi2c-vWmJKyIYf0sC4IkYImK1YsU7LOpF-yBkKwy5pdIn8TVWBiMEEyYkKaPw'
      await accountController.registerUser(idToken)
      // Expect a user document to be created in the database
      const dbUser = await userModel.findOne({ email: 'jeromykho98@gmail.com' })
      expect(dbUser).toMatchObject({
        email: 'jeromykho98@gmail.com',
        sub: 'd27e234e-6453-45b6-a4b3-010abf437400',
        username: 'google_103876504817384462943',
      })
    })
    it('should fail create a new user', async () => {
      try {
        const idToken = 'fake-id-token'
        await accountController.registerUser(idToken)
      } catch (err: any) {
        expect(err.message).toBe(
          "Invalid token specified: Cannot read properties of undefined (reading 'replace')"
        )
      }
    })
  })
  describe('getUser', () => {
    it('should return null if user does not exist', async () => {
      const user = await accountController.getUser('641b1255e0128b5bad081a22')
      expect(user).toBeNull()
    })
    it('should return the user if user exists', async () => {
      // Create a user document in the database
      const dbUser = await userModel.create({
        email: 'test@example.com',
        sub: '123',
        username: 'testuser',
      })

      const user = await accountController.getUser(dbUser._id)

      expect(user).toMatchObject({
        email: 'test@example.com',
        sub: '123',
        username: 'testuser',
      })
    })
  })
})
