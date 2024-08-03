import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SECRET = useRuntimeConfig().authSecret

interface User {
  username: string
  roles: object
}

interface JwtPayload extends User {
  iss: string
  sub: string
  exp: number
}

export default eventHandler(async (event) => {
  const body = await readBody<{ refreshToken: string }>(event)

  if (!body.refreshToken) {
    throw createError({ statusCode: 403, message: '缺少刷新令牌' })
  }

  try {
    const decoded = jwt.verify(body.refreshToken, SECRET) as JwtPayload | undefined

    if (!decoded) {
      throw createError({ statusCode: 403, message: '无法验证刷新令牌' })
    }

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw createError({ statusCode: 403, message: '刷新令牌已过期' })
    }

    // 通过用户 ID 查找用户及所属角色信息
    const userFromDb = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
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

    // 将用户名及用户全部角色整合为对象
    const user = {
      username: userFromDb.username,
      roles: userFromDb.roles.map(userRole => userRole.Role.name), // 用户所属角色
    }

    // 获取当前时间，用于 Token 签发时间
    const currentTime = Math.floor(Date.now() / 1000)
    // JWT 签发者
    const cookieDomain = useRuntimeConfig().cookieDomain

    const newAccessToken = jwt.sign({
      iss: cookieDomain,
      sub: userFromDb.id, // 用户 ID
      iat: currentTime,
      ...user,
    }, SECRET, { expiresIn: useRuntimeConfig().authAccessExpiresIn })

    return {
      token: {
        accessToken: newAccessToken,
        refreshToken: body.refreshToken,
      },
    }
  }
  catch (error) {
    console.error('刷新令牌无效：', error)
    throw createError({ statusCode: 403, message: '刷新令牌无效' })
  }
})
