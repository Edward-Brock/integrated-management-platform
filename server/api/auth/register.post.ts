import { z } from 'zod'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// 缓存默认角色 ID
let defaultRoleId: string

async function getDefaultRoleId() {
  if (!defaultRoleId) {
    // 通过角色名查找角色表
    const defaultRole = await prisma.role.findUnique({
      where: { name: 'User' },
    })
    if (defaultRole) {
      // 将 User ID 缓存
      defaultRoleId = defaultRole.id
    }
    else {
      throw createError({ statusCode: 400, message: '默认角色未定义' })
    }
  }
  return defaultRoleId
}

export default defineEventHandler(async (event) => {
  const result = z.object({
    nickname: z.string().min(1).max(80),
    username: z.string().min(1).max(32),
    password: z.string().min(1).max(128),
  }).safeParse(await readBody(event))

  // 判断是否缺少必填字段
  if (!result.success) {
    throw createError({ statusCode: 400, message: '缺少必填字段' })
  }

  // 通过用户名查找用户信息
  const existingUser = await prisma.user.findUnique({ where: { username: result.data.username } })
  // 判断用户是否存在
  if (existingUser) {
    throw createError({ statusCode: 409, message: '用户已存在' })
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10)

  // 使用事务创建用户和角色关联
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        nickname: result.data.nickname,
        username: result.data.username,
        password: hashedPassword,
      },
    })

    // 获取默认角色ID
    const defaultRoleId = await getDefaultRoleId()

    if (defaultRoleId) {
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRoleId,
        },
      })
    }
    return user
  })

  return {
    statusCode: 201,
    message: '账号注册成功',
    data: {
      user: {
        id: createdUser.id,
        nickname: createdUser.nickname,
        username: createdUser.username,
      },
    },
  }
})
