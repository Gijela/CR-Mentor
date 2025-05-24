import { Markdown, type MarkdownProps } from "@lobehub/ui";
import { StoryBook, useControls, useCreateStore } from "@lobehub/ui/storybook";

import { content } from "./data";

export function Component() {
  const store = useCreateStore();
  const { children, ...rest } = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      fullFeaturedCodeBlock: true,
    },
    { store }
  ) as MarkdownProps;

  return (
    <div>
      <Markdown variant={"chat"} {...rest}>
        {children}
      </Markdown>
    </div>
  );
}
