import * as React from "react";
import Minions from "./Minions";
import DateTime from "./DateTime";

export default [
  {
    name: "Minions",
    width: 800,
    height: 600,
    component: <Minions />,
  },
  {
    name: "DateTime",
    component: <DateTime />,
  },
  {
    name: "test",
    width: 600,
    component: <div>test page</div>,
  },
];
