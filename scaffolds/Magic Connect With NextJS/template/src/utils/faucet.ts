import { Networks } from "./networks"

export const getFaucetUrl = () => {
  const network = localStorage.getItem("network")
  switch (network) {
    case Networks.Polygon:
      return "https://faucet.polygon.technology/"
    case Networks.Optimism:
      return "https://community.optimism.io/docs/useful-tools/faucets/"
    default:
      return "https://goerlifaucet.com/"
  }
}
