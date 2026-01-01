import type { MetadataRoute } from "next"

import { getDatasets } from "@/lib/datasets"

const BASE_URL = "https://novaaetus.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const datasets = getDatasets()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/news`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/research`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reproducibility`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/repos`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/legal`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const datasetRoutes: MetadataRoute.Sitemap = datasets.flatMap((dataset) => {
    const lastModified = dataset.updatedAt

    return [
      {
        url: `${BASE_URL}/research/${dataset.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/reproducibility/model-card/${dataset.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/reproducibility/datasheet/${dataset.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
    ]
  })

  return [...staticRoutes, ...datasetRoutes]
}
