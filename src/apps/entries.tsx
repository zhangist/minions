import * as React from "react";
import Minions from "./minions";
import DateTime from "./dateTime";

export default [{
    name: "Minions",
    width: 800,
    height: 600,
    component: <Minions />,
}, {
    name: "DateTime",
    component: <DateTime />,
}, {
    name: "online",
    component: <div>online page</div>,
}, {
    name: "offline",
    component: <div>offline page</div>,
}, {
    name: "bond",
    component: <div>bond page</div>,
}, {
    name: "test",
    width: 600,
    component: <div>test page</div>,
}]
