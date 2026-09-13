export interface ClusterConfig {
  workerCount: number;
  healthCheckIntervalMs: number;
  maxAuthRetries: number;
  circuitBreakerThreshold: number;
}

export const clusterConfig: ClusterConfig = {
  workerCount: 4,
  healthCheckIntervalMs: 5000,
  maxAuthRetries: 3,
  circuitBreakerThreshold: 500 // Mitigate deployment delays caused by 500 authentication errors
};
