export type DonutSlice = {
  label: string
  value: number
  color: string
}

export type IDonutChartProps = {
  data: Array<DonutSlice>
  size: number
  minSize?: number
  showLabelsOnSlices?: boolean
  shadows?: boolean
  middleText?: string
  tight?: boolean
  padding?: number
} 
