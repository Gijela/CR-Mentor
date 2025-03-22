import { SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EmptyCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const { user } = useUser();
  return (
    <Card className="flex flex-col items-center justify-center p-12">
      <CardHeader>
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          {description}
        </p>
      </CardContent>
      {!user && (
        <CardFooter>
          <div className="text-[blue] border border-[blue] rounded-md px-3 py-1">
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmptyCard;
