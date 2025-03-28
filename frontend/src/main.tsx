import "@/components/ui/globals.css";
import "./i18n";

import * as React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Fallback } from "@/components/fallback";
import { RootProviders } from "@/providers/root-providers";

import { router } from "./router";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <RootProviders>
      <RouterProvider router={router} fallbackElement={<Fallback />} />
    </RootProviders>
  </React.StrictMode>
);
