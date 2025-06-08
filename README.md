## Interface

### `/api/coffeeprefer`

```json
{
    "uuid": "xxxxxx"
}
```

```json
{
    "response": [
        {
            "role": "assistant",
            "content": "xxx"
        }
    ],
    "orders": [
        {
            "cup": "中杯",
            "name": "卡布奇诺",
            "price": "20",
            "sugar": "不另外加糖",
            "temperature": "热"
        },
        {
            "cup": "中杯",
            "name": "卡布奇诺",
            "price": "20",
            "sugar": "不另外加糖",
            "temperature": "热"
        }
    ]
}
```

### `/api/coffee`

```json
{
    "questions": [
        {
            "role": "system",
            "content": "xxx"
        },
        {
            "role": "human",
            "content": "我要点一杯红茶玛奇朵"
        },
    ]
}
```


```json
{
    "response": [
        {
            "role": "assistant",
            "content": "xxx"
        }
    ],
    "orders": [
        {
            "cup": "中杯",
            "name": "卡布奇诺",
            "price": "20",
            "sugar": "不另外加糖",
            "temperature": "热"
        },
        {
            "cup": "中杯",
            "name": "卡布奇诺",
            "price": "20",
            "sugar": "不另外加糖",
            "temperature": "热"
        }
    ]
}
```