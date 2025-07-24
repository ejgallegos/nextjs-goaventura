
import {
  QuestionMarkCircledIcon,
  CircleIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "draft",
    label: "Borrador",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "published",
    label: "Publicado",
    icon: CircleIcon,
  },
  {
    value: "archived",
    label: "Archivado",
    icon: StopwatchIcon,
  },
]
