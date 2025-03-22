import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 团队成员类型
export type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  step: number;
  renderData: (
    diffsData: any,
    combinedContextList?: any,
    diffEntityObj?: any,
    codeKnowledgeGraph?: any
  ) => React.ReactNode;
};

// 团队成员列表组件
export const TeamMembersList = ({
  teamMembers,
  selectedMember,
  setSelectedMember,
  step,
  setHasSelectedRole,
}: {
  teamMembers: TeamMember[];
  selectedMember: string;
  setSelectedMember: (name: string) => void;
  step: number;
  setHasSelectedRole: (hasSelected: boolean) => void;
}) => {
  return (
    <div className="border-b bg-card">
      <div className="px-4 py-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm text-muted-foreground">分析团队</span>
        <span className="text-sm text-muted-foreground">
          {teamMembers.length}
        </span>
      </div>

      {/* 成员列表 */}
      <div className="flex flex-wrap px-4 py-2 gap-2">
        {teamMembers.map((member) => (
          <button
            key={member.name}
            onClick={() => {
              setSelectedMember(member.name);
              setHasSelectedRole(true);
            }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                selectedMember === member.name
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                  : step >= member.step
                  ? "hover:bg-accent/40 hover:scale-[1.02]"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
            disabled={step < member.step}
          >
            <Avatar className="h-9 w-9 border-2 border-background">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm font-medium leading-none mb-1">
                {member.name}
              </div>
              <div
                className={`text-xs ${
                  selectedMember === member.name
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {member.role}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
