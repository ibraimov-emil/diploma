import $host from "./index";

export const fetchStatsCounts = async () => {
    const {data} = await $host.get('stats/counts')
    return data
}
