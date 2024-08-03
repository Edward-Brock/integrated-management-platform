import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SECRET = useRuntimeConfig().authSecret

export default defineEventHandler(async (event) => {
  const result = z.object({
    username: z.string().min(1).max(32),
    password: z.string().min(1).max(128),
  }).safeParse(await readBody(event))

  // 判断是否缺少必填字段
  if (!result.success) {
    throw createError({ statusCode: 403, message: '缺少必填字段' })
  }

  const { username } = result.data

  // 通过用户名查找用户及所属角色信息
  const userFromDb = await prisma.user.findUnique({
    where: { username }, include: {
      roles: {
        include: {
          Role: true,
        },
      },
    },
  })

  // 判断用户是否存在
  if (!userFromDb) {
    throw createError({ statusCode: 403, message: '用户不存在' })
  }

  // 判断该账号密码是否正确
  const compare = await bcrypt.compare(result.data.password, userFromDb.password)
  if (!compare) {
    throw createError({ statusCode: 400, message: '用户名或密码错误' })
  }

  // 将用户名及用户全部角色整合为对象
  const user = {
    username: userFromDb.username,
    roles: userFromDb.roles.map(userRole => userRole.Role.name), // 用户所属角色
  }

  // 获取当前时间，用于 Token 签发时间
  const currentTime = Math.floor(Date.now() / 1000)
  // JWT 签发者
  const cookieDomain = useRuntimeConfig().cookieDomain

  // 短期 Token
  const accessToken = jwt.sign({
    iss: cookieDomain,
    sub: userFromDb.id, // 用户 ID
    iat: currentTime,
    ...user,
  }, SECRET, { expiresIn: useRuntimeConfig().authAccessExpiresIn })

  // 长期 Token
  const refreshToken = jwt.sign({
    iss: cookieDomain,
    sub: userFromDb.id, // 用户 ID
    iat: currentTime,
    ...user,
  }, SECRET, { expiresIn: useRuntimeConfig().authRefreshExpiresIn })

  return {
    token: {
      accessToken,
      refreshToken,
    },
  }
})
