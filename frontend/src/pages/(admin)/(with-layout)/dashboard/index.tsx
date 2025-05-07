// import { redirect } from "react-router-dom"

import { ChartAreaInteractive } from "./components/ChartAreaInteractive";
import { DataTable } from "./components/DataTable";
import { SectionCards } from "./components/SectionCards";

// export const loader = () => redirect(`/repository`)
import data from "./data.json";

export function Component() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
