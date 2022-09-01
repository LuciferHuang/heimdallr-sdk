export default function () {
  return performance.getEntriesByType('resource').map((item: PerformanceResourceTiming) => ({
    name: item.name,
    time: item.responseEnd
  }));
}
