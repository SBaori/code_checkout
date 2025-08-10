import { Model } from "flexlayout-react";

var vertSplitLayout2 = {
    global: {},
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
				type: "column",
				weight: 50,
				children: [
                    {
                        type: "tabset",
                        weight: 25,
                        children: [
                            {
                            type: "tab",
                            name: "code",
                            enableClose: false,
                            component: "Editor"
                            }
                        ]
                    },
                    {
                        type: "tabset",
                        weight: 25,
                        children: [
                            {
                            type: "tab",
                            name: "input",
                            enableClose: false,
                            component: "Input"
                            }
                        ]
                    }
				]
                        
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

export const vertSplitModel2 = Model.fromJson(vertSplitLayout2);
