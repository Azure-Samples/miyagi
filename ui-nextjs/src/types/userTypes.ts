// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UserLayoutType = {
  id: string | undefined
}

export type UsersType = {
  productId: number
  createdAt: string
  description: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  productName: string
  categoryId: string
  unitCost: number
  unitPrice: number
  currentPlan: string
  avatarColor?: ThemeColor
}
