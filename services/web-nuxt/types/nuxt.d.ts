import type { SensorsApi, ReadingsApi } from '@/clients/api'

declare module '#app' {
  interface NuxtApp {
    $sensorsApi: SensorsApi
    $readingsApi: ReadingsApi
  }
}