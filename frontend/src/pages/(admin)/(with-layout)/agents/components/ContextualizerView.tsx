import { Card, CardContent } from "@/components/ui/card";

export const ContextualizerView = ({
  combinedContextList,
}: {
  combinedContextList: string[];
}) => {
  return (
    <>
      {combinedContextList.map((context, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px]">
              {context}
            </pre>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
