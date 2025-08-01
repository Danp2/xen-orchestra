import path from 'node:path'
import pick from 'lodash/pick.js'
import { Request } from 'express'
import type { XoRecord } from '@vates/types'

import { BASE_URL } from '../index.mjs'
import type { WithHref } from './helper.type.mjs'

const { join } = path.posix

export function makeObjectMapper<T extends XoRecord>(req: Request, path?: string) {
  if (path === undefined) {
    path = req.path
  } else {
    path = `${BASE_URL}/${path}`
  }

  const makeUrl = ({ id }: T) => join(path, typeof id === 'number' ? String(id) : id)
  let objectMapper: (object: T) => string | WithHref<Partial<T>> | WithHref<T>

  const { query } = req
  const { fields } = query
  if (fields === '*') {
    objectMapper = object => ({
      ...object,
      href: makeUrl(object),
    })
  } else if (typeof fields === 'string') {
    const _fields = fields.split(',')
    objectMapper = object => {
      const url = makeUrl(object)
      return { ...pick(object, _fields), href: url }
    }
  } else {
    objectMapper = makeUrl
  }

  return function (obj: T) {
    return objectMapper(obj)
  }
}
