import { Injectable, PipeTransform } from '@nestjs/common'

export interface IPageOptions {
  page: number
  take: number
  search?: string
  orderBy?: string
  order?: 'asc' | 'desc'
}

export interface IPageMeta {
  currentPage: number
  total: number
  perPage: number
  lastPage: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface IPage<T> {
  data: Array<T>
  meta: IPageMeta
}

export class PageMeta implements IPageMeta {
  readonly currentPage: number
  readonly perPage: number
  readonly total: number
  readonly lastPage: number
  readonly hasPreviousPage: boolean
  readonly hasNextPage: boolean

  constructor({ pageOptions, itemCount }: { pageOptions: IPageOptions; itemCount: number }) {
    this.currentPage = pageOptions.page || 1
    this.perPage = pageOptions.take || paginationTakeValue
    this.total = itemCount
    this.lastPage = Math.ceil(itemCount / (pageOptions.take || paginationTakeValue))
    this.hasPreviousPage = this.currentPage > 0
    this.hasNextPage = this.currentPage < this.lastPage
  }
}

export class Page<T> {
  readonly data: Array<T>
  readonly meta: IPageMeta

  constructor(data: T[], meta: IPageMeta) {
    this.data = data
    this.meta = meta
  }
}

const paginationSkipValue = 0
const paginationTakeValue = 10

export const defaultPageOptions: IPageOptions = {
  page: paginationSkipValue + 1,
  take: paginationTakeValue,
  search: '',
  orderBy: 'id',
  order: 'desc',
}

@Injectable()
export class PageOptionsPipe implements PipeTransform {
  transform(pageOptions: Partial<IPageOptions>) {
    const options: IPageOptions = { ...defaultPageOptions, ...pageOptions }

    options.search = pageOptions.search ? pageOptions.search.trim().toLowerCase() : ''
    options.take = +options.take || defaultPageOptions.take
    options.page = +options.page || defaultPageOptions.page

    if (options.take > 100) {
      options.take = 100
    }
    return options
  }
}
