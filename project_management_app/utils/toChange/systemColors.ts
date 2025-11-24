export function getSystemColor(system: string): string {
  switch (system.toLowerCase()) {
    case "phrase":
      return "bg-emerald-500";
    case "trados":
      return "bg-blue-500";
    case "memoq":
      return "bg-purple-500";
    default:
      return "bg-gray-400";
  }
}
