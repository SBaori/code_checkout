import { Model } from "flexlayout-react";

var vertSplitLayout = {
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "code",
                        enableClose: false,
                        component: "Editor"
                    },
                ],
            },
            {
              type: "tabset",
              weight: 50,
              children: [
                    {
                        type: "tab",
                        name: "output",
                        enableClose: false,
                        component: "Output"
                    },
              ],
            },
        ],
    },
};

export const vertSplitModel = Model.fromJson(vertSplitLayout);