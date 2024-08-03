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

  // 通过权限名查找权限信息
  const existingPermission = await prisma.permission.findUnique({ where: { name: result.data.name } })
  // 判断权限是否存在
  if (existingPermission) {
    throw createError({
      statusCode: 409,
      message: '权限已存在',
    })
  }

  try {
    // 创建新权限
    const createdPermission = await prisma.permission.create({
      data: {
        name: result.data.name,
        remark: result.data.remark,
        isFixed: result.data.isFixed,
      },
    })

    // 返回成功信息和新权限
    return {
      statusCode: 201,
      message: '权限创建成功',
      data: createdPermission,
    }
  }
  catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, message: '权限创建失败' })
  }
})
