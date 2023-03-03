export type PricingPlanType = {
  title: string
  imgSrc: string
  imgWidth: number
  subtitle: string
  imgHeight: number
  currentPlan: boolean
  popularPlan: boolean
  monthlyPrice: number
  planBenefits: string[]
  yearlyPlan: {
    perMonth: number
    totalAnnual: number
  }
}

export type PricingPlanProps = {
  plan: string
  data?: PricingPlanType
}

export type PricingFaqType = {
  id: string
  answer: string
  question: string
}

export type PricingDataType = {
  faq: PricingFaqType[]
  pricingPlans: PricingPlanType[]
}
