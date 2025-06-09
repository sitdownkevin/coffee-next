## 接口

### `/api/langchain-chat`

<details> 
<summary>参数</summary> 

```json
{
    "chat": [
        {
            "role": "assistant",
            "content": "您好！我是您的咖啡助手，请问有什么可以帮您的？"
        },
        {
            "role": "human",
            "content": "我想点一杯卡布奇诺，大杯，半糖，常温，还有两杯拿铁，大杯，全糖，常温。此外，我还想要一个凯撒沙拉。"
        }
    ]
}
```
</details>

<details> 
<summary>返回</summary> 

```json
{
    "success": true,
    "data": {
        "chat": [
            {
                "role": "assistant",
                "content": "您好！我是您的咖啡助手，请问有什么可以帮您的？"
            },
            {
                "role": "human",
                "content": "我想点一杯卡布奇诺，大杯，半糖，常温，还有两杯拿铁，大杯，全糖，常温。此外，我还想要一个凯撒沙拉。"
            },
            {
                "role": "assistant",
                "content": "好的，已为你选择以下商品。"
            }
        ],
        "itemsInChat": [
            {
                "name": "卡布奇诺",
                "description": "意式经典咖啡，浓缩咖啡、蒸制牛奶和丰富奶泡的三重奏，口感层次分明，奶泡细腻。",
                "type": "coffee",
                "basePrice": 16,
                "options": {
                    "cup": [
                        {
                            "name": "中杯",
                            "addPrice": 0
                        },
                        {
                            "name": "大杯",
                            "addPrice": 3
                        },
                        {
                            "name": "超大杯",
                            "addPrice": 6
                        }
                    ],
                    "sugar": [
                        {
                            "name": "正常糖",
                            "addPrice": 0
                        },
                        {
                            "name": "少糖",
                            "addPrice": 0
                        },
                        {
                            "name": "无糖",
                            "addPrice": 0
                        },
                        {
                            "name": "多糖",
                            "addPrice": 1
                        }
                    ],
                    "temperature": [
                        {
                            "name": "常温",
                            "addPrice": 0
                        },
                        {
                            "name": "热",
                            "addPrice": 0
                        },
                        {
                            "name": "冰",
                            "addPrice": 0
                        },
                        {
                            "name": "去冰",
                            "addPrice": 0
                        },
                        {
                            "name": "少冰",
                            "addPrice": 0
                        }
                    ]
                },
                "optionsSelected": {
                    "cup": {
                        "name": "大杯",
                        "addPrice": 3
                    },
                    "sugar": {
                        "name": "正常糖",
                        "addPrice": 0
                    },
                    "temperature": {
                        "name": "常温",
                        "addPrice": 0
                    }
                },
                "quantity": 1,
                "hash": "卡布奇诺-大杯-正常糖-常温"
            },
            {
                "name": "拿铁",
                "description": "浓缩咖啡与蒸制牛奶的完美结合，奶香浓郁，口感丝滑，咖啡与牛奶的比例恰到好处。",
                "type": "coffee",
                "basePrice": 15,
                "options": {
                    "cup": [
                        {
                            "name": "中杯",
                            "addPrice": 0
                        },
                        {
                            "name": "大杯",
                            "addPrice": 3
                        },
                        {
                            "name": "超大杯",
                            "addPrice": 6
                        }
                    ],
                    "sugar": [
                        {
                            "name": "正常糖",
                            "addPrice": 0
                        },
                        {
                            "name": "少糖",
                            "addPrice": 0
                        },
                        {
                            "name": "无糖",
                            "addPrice": 0
                        },
                        {
                            "name": "多糖",
                            "addPrice": 1
                        }
                    ],
                    "temperature": [
                        {
                            "name": "常温",
                            "addPrice": 0
                        },
                        {
                            "name": "热",
                            "addPrice": 0
                        },
                        {
                            "name": "冰",
                            "addPrice": 0
                        },
                        {
                            "name": "去冰",
                            "addPrice": 0
                        },
                        {
                            "name": "少冰",
                            "addPrice": 0
                        }
                    ]
                },
                "optionsSelected": {
                    "cup": {
                        "name": "大杯",
                        "addPrice": 3
                    },
                    "sugar": {
                        "name": "正常糖",
                        "addPrice": 0
                    },
                    "temperature": {
                        "name": "常温",
                        "addPrice": 0
                    }
                },
                "quantity": 2,
                "hash": "拿铁-大杯-正常糖-常温"
            },
            {
                "name": "凯撒沙拉",
                "description": "新鲜罗马生菜配以经典凯撒酱汁，撒上帕尔马干酪和酥脆面包丁，清爽健康。",
                "type": "salad",
                "basePrice": 35,
                "options": {},
                "optionsSelected": {},
                "quantity": 1,
                "hash": "凯撒沙拉-undefined-undefined-undefined"
            }
        ]
    }
}
```

</details>