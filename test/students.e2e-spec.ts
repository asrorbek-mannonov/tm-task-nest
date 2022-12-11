import { INestApplication } from '@nestjs/common'
import { StudentsModule } from '../src/students/students.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/auth/auth.module'
import { Test, TestingModule } from '@nestjs/testing'

import * as request from 'supertest'
import { exec as legacyExec } from 'child_process'
import * as util from 'util'

const user = {
  username: 'user',
  password: 'password',
}
let accessToken = ''

describe('Students', () => {
  let app: INestApplication

  beforeAll(async () => {
    const exec = util.promisify(legacyExec)
    const { stdout, stderr } = await exec('npx prisma migrate reset --force')

    console.log(stdout)
    console.log('Error:', stderr)

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        StudentsModule,
        AuthModule,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('/POST auth/login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('access_token')
        accessToken = body.access_token
      })
  })

  it('/GET auth/user [should fail without Authorization header]', () => {
    return request(app.getHttpServer()).get('/auth/user').expect(401)
  })

  it('/GET auth/user', () => {
    return request(app.getHttpServer())
      .get('/auth/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('username')
        expect(body).toHaveProperty('status')
        expect(body).toHaveProperty('username')
        expect(body.username).toBe(user.username)

        if (body.branch_id) {
          expect(body.branch.id).toBe(body.branch_id)
        }
      })
  })

  it('/POST students [should create a new user]', () => {
    const createUserDto = {
      fullname: 'User ' + Date.now(),
      phone: '+99 (891) 111-22-33',
      date_of_birth: new Date('12-12-1996'),
      parent_phone: '+99 (891) 111-22-44',
    }

    return request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createUserDto)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('branch')
        expect(body).toHaveProperty('wallet')
        expect(body.fullname).toEqual(createUserDto.fullname)
        expect(body.phone).toEqual(createUserDto.phone)
        expect(body.parent_phone).toEqual(createUserDto.parent_phone)
        expect(body.status).toEqual(true)
        expect(body.wallet.balance).toEqual(0)
      })
  })

  it('/PUT student/:id [should update the user]', () => {
    const updateUserDto = {
      fullname: 'User ' + Date.now(),
    }

    return request(app.getHttpServer())
      .put('/students/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateUserDto)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id')
      })
  })

  it('/GET students [should return paginated user list]', () => {
    return request(app.getHttpServer())
      .get('/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('data')
        expect(body).toHaveProperty('meta')
        expect(body.data).toHaveLength(1)
      })
  })

  it("/POST students/:id/topup [should topup student's wallet]", () => {
    return request(app.getHttpServer())
      .post('/students/1/topup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 100000,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('wallet')
        expect(body.wallet.balance).toEqual(100000)
      })
  })

  it('/GET students/get-active [should return only active students less than 50]', () => {
    return request(app.getHttpServer())
      .get('/students/get-active')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBeLessThanOrEqual(50)
      })
  })

  it('/GET students/:id [should return full info about a student]', () => {
    return request(app.getHttpServer())
      .get('/students/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        console.log(body)
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('wallet')
        expect(body).toHaveProperty('topups')
        // expect(Array.isArray(body.topups)).toBeTruthy()
        expect(body).toHaveProperty('body')
        expect(body).toHaveProperty('attendances')
        // expect(Array.isArray(body.attendances)).toBeTruthy()
        expect(body).toHaveProperty('students_groups')
      })
  })

  // it('/DELETE students/:id [should delete a student]', () => {
  //   return request(app.getHttpServer())
  //     .delete('/students/1')
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body).toHaveProperty('id')
  //       expect(body).toHaveProperty('fullname')
  //     })
  // })

  afterAll(async () => {
    await app.close()
  })
})
