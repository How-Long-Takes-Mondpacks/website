import { siteConfig } from "@/config/site"

export const getAllModpacks = async () => {
  const modpacks = await fetch(`${siteConfig.cfv1}/search?gameId=&classId=`, {
    method: 'GET',
    headers: {
      'X-Api-Token': process.env.CF_API_KEY || '',
      'Accept': 'application/json'
    }
  })
}

export const getModpack = async () => {
  const modpack = await fetch(`${siteConfig.cfv1}/925200`, {
    method: 'GET',
    headers: {
      'X-Api-Token': process.env.CF_API_KEY || '',
      'Accept': 'application/json'
    },
    next: {
      revalidate: 5,
      tags: ["modpack"]
    }
  })
  .then(res => {
    console.log(res)
    if (res.ok)
      return res.json()
    else 
      return {
        data: null
      }
  }).then(res => {
    console.log(res)
    return res.data
  })
  console.log({modpack})
}

/*export const getModpack = async (modpackId: string) => {

}*/