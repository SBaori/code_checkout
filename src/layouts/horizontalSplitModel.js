import { Model } from "flexlayout-react";

var horizontalSplitLayout = {
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "column",
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
                                component: "Editor",
                            },
                            {
                                type: "tab",
                                name: "input",
                                enableClose: false,
                                component: "Input",
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
                                component: "Output",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export const horizontalSplitModel = Model.fromJson(horizontalSplitLayout);
