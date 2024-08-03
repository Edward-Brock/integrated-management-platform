import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const result = z.object({
    name: z.string().min(1),
    remark: z.string().optional(),
    isFixed: z.preprocess(val => Boolean(val), z.boolean().optional()),
  }).safeParse(await readBody(event))

  // 判断是否缺少必填字段
  if (!result.success) {
    throw createError({ statusCode: 400, message: '缺少必填字段' })
  }

  // 通过角色名查找角色信息
  const existingRole = await prisma.role.findUnique({ where: { name: result.data.name } })
  // 判断角色是否存在
  if (existingRole) {
    throw createError({
      statusCode: 409,
      message: '角色已存在',
    })
  }

  try {
    // 创建新角色
    const createdRole = await prisma.role.create({
      data: {
        name: result.data.name,
        remark: result.data.remark,
        isFixed: result.data.isFixed,
      },
    })

    // 返回成功信息和新角色
    return {
      statusCode: 201,
      message: '角色创建成功',
      data: createdRole,
    }
  }
  catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, message: '角色创建失败' })
  }
})
