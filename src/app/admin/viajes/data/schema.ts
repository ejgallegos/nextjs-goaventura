import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.string(),
  price: z.number().optional(),
  currency: z.string().optional(),
})

export type Task = z.infer<typeof productSchema>
