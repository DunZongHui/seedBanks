import request from '@/utils/requestMockData'

export function reqReportData() {
    return request('/getEchartsData')
  }
  